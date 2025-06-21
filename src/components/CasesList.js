import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  TextField,
  Select,
  MenuItem,
  Chip,
  Paper,
  InputAdornment,
  Link
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { mockCases } from './mock/cases.js';
import { useNavigate } from 'react-router-dom';

const CasesList = () => {
  const navigate = useNavigate();
  const [cases] = useState(mockCases);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    channel: '',
  });

  const filteredCases = cases.filter((caseItem) => {
    const matchesSearch = caseItem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caseItem.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filters.status || caseItem.status === filters.status;
    const matchesPriority = !filters.priority || caseItem.priority === filters.priority;
    const matchesChannel = !filters.channel || caseItem.channel === filters.channel;
    return matchesSearch && matchesStatus && matchesPriority && matchesChannel;
  });

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (field) => (e) => {
    setFilters(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open':
        return 'error';
      case 'in_progress':
        return 'warning';
      case 'resolved':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Cases
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search cases..."
          value={searchTerm}
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <Select
          value={filters.status}
          onChange={handleFilterChange('status')}
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="open">Open</MenuItem>
          <MenuItem value="in_progress">In Progress</MenuItem>
          <MenuItem value="resolved">Resolved</MenuItem>
        </Select>
        <Select
          value={filters.priority}
          onChange={handleFilterChange('priority')}
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="high">High</MenuItem>
          <MenuItem value="medium">Medium</MenuItem>
          <MenuItem value="low">Low</MenuItem>
        </Select>
        <Select
          value={filters.channel}
          onChange={handleFilterChange('channel')}
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="email">Email</MenuItem>
          <MenuItem value="phone">Phone</MenuItem>
          <MenuItem value="chat">Chat</MenuItem>
        </Select>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Channel</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Assigned To</TableCell>
              <TableCell>Last Updated</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCases.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7}>
                  <Typography variant="body1" align="center">
                    No cases found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredCases.map((caseItem) => (
                <TableRow
                  key={caseItem.id}
                  hover
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell>
                    <Link
                      component="button"
                      onClick={() => navigate(`/cases/${caseItem.id}`)}
                      sx={{
                        color: 'inherit',
                        textDecoration: 'none',
                        '&:hover': {
                          color: 'primary.main',
                          textDecoration: 'underline',
                        },
                      }}
                    >
                      {caseItem.title}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={caseItem.status}
                      color={getStatusColor(caseItem.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{caseItem.priority}</TableCell>
                  <TableCell>{caseItem.channel}</TableCell>
                  <TableCell>{caseItem.createdAt}</TableCell>
                  <TableCell>{caseItem.assignedTo}</TableCell>
                  <TableCell>{caseItem.lastUpdated}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default CasesList;
