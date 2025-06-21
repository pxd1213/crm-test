import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
  Chip,
  IconButton,
  Tooltip,
  CircularProgress,
  TablePagination,
  TableFooter,
  Toolbar,
  InputAdornment,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { CasesService } from '../services/casesService';
import {
  OpenInNew as OpenInNewIcon,
  Search as SearchIcon,
} from '@mui/icons-material';

export default function CasesList() {
  const navigate = useNavigate();
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    channel: ''
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const casesService = useMemo(() => new CasesService(), []);

  useEffect(() => {
    const unsubscribe = casesService.subscribeToCases((updatedCases) => {
      setCases(updatedCases);
    });

    // Initial fetch
    casesService.getCases().then(cases => {
      setCases(cases);
      setLoading(false);
    });

    return () => unsubscribe();

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

      {/* Search and Filters */}
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
        <TextField
          select
          label="Status"
          value={filters.status}
          onChange={handleFilterChange('status')}
          sx={{ minWidth: 150 }}
          SelectProps={{
            native: true,
          }}
        >
          <option value="">All</option>
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
        </TextField>
        <TextField
          select
          label="Priority"
          value={filters.priority}
          onChange={handleFilterChange('priority')}
          sx={{ minWidth: 150 }}
          SelectProps={{
            native: true,
          }}
        >
          <option value="">All</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </TextField>
        <TextField
          select
          label="Channel"
          value={filters.channel}
          onChange={handleFilterChange('channel')}
          sx={{ minWidth: 150 }}
          SelectProps={{
            native: true,
          }}
        >
          <option value="">All</option>
          <option value="email">Email</option>
          <option value="phone">Phone</option>
          <option value="chat">Chat</option>
        </TextField>
      </Box>

      {/* Cases Table */}
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
                  <TableCell>{caseItem.title}</TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                      }}
                    >
                      <Box
                        sx={{
                          width: 10,
                          height: 10,
                          borderRadius: '50%',
                          bgcolor: getStatusColor(caseItem.status),
                        }}
                      />
                      {caseItem.status}
                    </Box>
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
