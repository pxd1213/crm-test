import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { CasesService } from '../services/casesService';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Chip,
  Divider,
  CircularProgress,
} from '@mui/material';
import Case from './Case';
import CreateCase from './CreateCase';
import {
  SupportAgent as SupportAgentIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Chat as ChatIcon,
  TrendingUp as TrendingUpIcon,
  Timer as TimerIcon,
} from '@mui/icons-material';

const loadDashboardData = async () => {
  const casesService = new CasesService();
  const [stats, recentActivity, openCases] = await Promise.all([
    casesService.getCaseStats(),
    casesService.getRecentActivity(),
    casesService.getOpenCases(),
  ]);
  return { stats, recentActivity, openCases };
};

export default function Dashboard() {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [recentActivity, setRecentActivity] = useState([]);
  const [openCases, setOpenCases] = useState([]);
  const casesService = new CasesService();

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // Load case stats
        const stats = await casesService.getCaseStats();
        setStats(stats);

        // Load recent activity
        const activity = await casesService.getRecentActivity(5);
        setRecentActivity(activity);

        // Load open cases
        const openCases = await casesService.getCases({ status: 'open' });
        setOpenCases(openCases);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const [createCaseOpen, setCreateCaseOpen] = useState(false);

  const handleCreateCaseOpen = () => {
    setCreateCaseOpen(true);
  };

  const handleCreateCaseClose = () => {
    setCreateCaseOpen(false);
  };

  const handleCaseCreated = () => {
    // Refresh dashboard data after case is created
    loadDashboardData();
  };

  return (
    <Container maxWidth="xl">
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Box sx={{ mt: 4, mb: 4 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
              <Typography variant="h4" component="h1" gutterBottom>
                Welcome to CRM Dashboard
              </Typography>
              <Typography variant="h6" gutterBottom>
                Welcome, {currentUser?.email}
              </Typography>
            </Paper>
          </Box>

          {/* Overview Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <SupportAgentIcon sx={{ color: 'primary.main', mr: 1 }} />
                    <Typography variant="h6">Total Cases</Typography>
                  </Box>
                  <Typography variant="h3" component="div" sx={{ mt: 2 }}>
                    {stats.totalCases || 0}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <TimerIcon sx={{ color: 'warning.main', mr: 1 }} />
                    <Typography variant="h6">Avg Response Time</Typography>
                  </Box>
                  <Typography variant="h3" component="div" sx={{ mt: 2 }}>
                    {stats.responseTime ? `${Math.round(stats.responseTime / 60)}m` : 'N/A'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <TrendingUpIcon sx={{ color: 'success.main', mr: 1 }} />
                    <Typography variant="h6">Satisfaction Score</Typography>
                  </Box>
                  <Typography variant="h3" component="div" sx={{ mt: 2 }}>
                    {stats.satisfactionScore || 0}/5
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <ChatIcon sx={{ color: 'info.main', mr: 1 }} />
                    <Typography variant="h6">Open Cases</Typography>
                  </Box>
                  <Typography variant="h3" component="div" sx={{ mt: 2 }}>
                    {stats.openCases || 0}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Recent Activity */}
          <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
            <Typography variant="h5" gutterBottom>
              Recent Activity
            </Typography>
            <List>
              {recentActivity.map(renderActivityItem)}
            </List>
          </Paper>

          {/* Open Cases */}
          <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
            <Typography variant="h5" gutterBottom>
              Open Cases
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              {openCases.map((caseData) => (
                <Case key={caseData.id} caseData={caseData} />
              ))}
            </Box>
          </Paper>

          {/* Quick Actions */}
          <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom>
              Quick Actions
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  startIcon={<SupportAgentIcon />}
                  onClick={handleCreateCaseOpen}
                >
                  Create New Case
                </Button>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                  variant="contained"
                  color="secondary"
                  fullWidth
                  startIcon={<EmailIcon />}
                  onClick={() => {
                    // TODO: Implement send email functionality
                  }}
                >
                  Send Email
                </Button>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                  variant="outlined"
                  color="primary"
                  fullWidth
                  startIcon={<ChatIcon />}
                  onClick={() => {
                    // TODO: Implement start chat functionality
                  }}
                >
                  Start Chat
                </Button>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                  variant="outlined"
                  color="secondary"
                  fullWidth
                  startIcon={<PhoneIcon />}
                  onClick={() => {
                    // TODO: Implement make call functionality
                  }}
                >
                  Make Call
                </Button>
              </Grid>
            </Grid>
          </Paper>

          <CreateCase
            open={createCaseOpen}
            onClose={handleCreateCaseClose}
            onCreate={handleCaseCreated}
          />
        </>
      )}
    </Container>
  );
}
