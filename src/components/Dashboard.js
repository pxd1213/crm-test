import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
} from '@mui/material';

export default function Dashboard() {
  const { currentUser } = useAuth();

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Welcome to CRM Dashboard
          </Typography>
          <Typography variant="h6" gutterBottom>
            Welcome, {currentUser?.email}
          </Typography>
          <Box sx={{ mt: 4 }}>
            <Button variant="contained" color="primary">
              Create New Customer
            </Button>
            <Button variant="contained" color="secondary" sx={{ ml: 2 }}>
              View Customers
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
