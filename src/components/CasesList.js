import React, { useState, useEffect, useCallback } from 'react';
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
  const [loading, _setLoading] = useState(true);
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

    return () => unsubscribe();
  }, [casesService]);

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

  const handleSearch = useCallback((event) => {
    setSearch(event.target.value);
  }, []);

  const handleChangePage = useCallback((event, newPage) => {
    setPage(newPage);
  }, []);

  const handleChangeRowsPerPage = useCallback((event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }, []);

  const handleFilterChange = useCallback((field) => (event) => {
    setFilters(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  }, []);

  const filteredCases = cases.filter(caseData => {
    const matchesSearch = caseData.subject.toLowerCase().includes(search.toLowerCase()) ||
      caseData.description?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !filters.status || caseData.status === filters.status;
    const matchesPriority = !filters.priority || caseData.priority === filters.priority;
    const matchesChannel = !filters.channel || caseData.channel === filters.channel;
    return matchesSearch && matchesStatus && matchesPriority && matchesChannel;
  });

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
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
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <TextField
              variant="outlined"
              size="small"
              placeholder="Search cases..."
              value={search}
              onChange={handleSearch}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={filters.status}
                onChange={handleFilterChange('status')}
                label="Status"
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="open">Open</MenuItem>
                <MenuItem value="in_progress">In Progress</MenuItem>
                <MenuItem value="resolved">Resolved</MenuItem>
                <MenuItem value="closed">Closed</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Priority</InputLabel>
              <Select
                value={filters.priority}
                onChange={handleFilterChange('priority')}
                label="Priority"
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
                <MenuItem value="urgent">Urgent</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Channel</InputLabel>
              <Select
                value={filters.channel}
                onChange={handleFilterChange('channel')}
                label="Channel"
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="email">Email</MenuItem>
                <MenuItem value="phone">Phone</MenuItem>
                <MenuItem value="chat">Chat</MenuItem>
                <MenuItem value="ticket">Ticket</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Toolbar>
      </Paper>
      
      <TableContainer component={Paper}>
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
            {filteredCases
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((caseData) => (
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
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                colSpan={6}
                count={filteredCases.length}
                rowsPerPage={rowsPerPage}
                page={page}
                SelectProps={{
                  size: 'small',
                }}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </Box>
  );
}
