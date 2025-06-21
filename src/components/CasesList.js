import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Typography,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import { CasesService } from '../services/casesService';
import {
  OpenInNew as OpenInNewIcon,
} from '@mui/icons-material';

export default function CasesList() {
  const navigate = useNavigate();
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadCases = async () => {
      try {
        setLoading(true);
        setError('');
        const casesService = new CasesService();
        const allCases = await casesService.getCases();
        setCases(allCases);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadCases();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'open':
        return 'primary';
      case 'in_progress':
        return 'warning';
      case 'resolved':
        return 'success';
      case 'closed':
        return 'error';
      default:
        return 'default';
    }
  };

  const handleCaseClick = (caseId) => {
    navigate(`/cases/${caseId}`);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Typography>Loading cases...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 4 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">All Cases</Typography>
      </Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Subject</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Priority</TableCell>
            <TableCell>Channel</TableCell>
            <TableCell>Created</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {cases.map((caseData) => (
            <TableRow
              key={caseData.id}
              hover
              sx={{ cursor: 'pointer' }}
              onClick={() => handleCaseClick(caseData.id)}
            >
              <TableCell>{caseData.subject}</TableCell>
              <TableCell>
                <Chip
                  label={caseData.status}
                  color={getStatusColor(caseData.status)}
                  size="small"
                />
              </TableCell>
              <TableCell>{caseData.priority}</TableCell>
              <TableCell>{caseData.channel}</TableCell>
              <TableCell>{new Date(caseData.createdAt).toLocaleString()}</TableCell>
              <TableCell>
                <Tooltip title="View Details">
                  <IconButton onClick={(e) => {
                    e.stopPropagation();
                    handleCaseClick(caseData.id);
                  }}>
                    <OpenInNewIcon />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
