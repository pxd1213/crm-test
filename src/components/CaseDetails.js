import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Paper,
  Grid,
  Typography,
  Box,
  Button,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
} from '@mui/material';
import { CasesService } from '../services/casesService';
import {
  SupportAgent as SupportAgentIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Chat as ChatIcon,
  PriorityHigh as PriorityHighIcon,
  Timer as TimerIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material';

export default function CaseDetails() {
  const { id } = useParams();
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadCase = async () => {
      try {
        setLoading(true);
        setError('');
        const casesService = new CasesService();
        const caseData = await casesService.getCase(id);
        setCaseData(caseData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadCase();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Typography>Loading case details...</Typography>
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

  if (!caseData) {
    return null;
  }

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

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h5" gutterBottom>
            {caseData.subject}
          </Typography>
          <Chip
            label={caseData.status}
            color={getStatusColor(caseData.status)}
            sx={{ mb: 2 }}
          />
        </Paper>
      </Grid>

      <Grid item xs={12} md={8}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Case Details
          </Typography>
          <List>
            <ListItem>
              <ListItemAvatar>
                <Avatar>
                  <SupportAgentIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary="Type"
                secondary={caseData.type}
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemAvatar>
                <Avatar>
                  <DescriptionIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary="Description"
                secondary={caseData.description}
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemAvatar>
                <Avatar>
                  <PriorityHighIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary="Priority"
                secondary={caseData.priority}
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemAvatar>
                <Avatar>
                  <TimerIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary="Created"
                secondary={new Date(caseData.createdAt).toLocaleString()}
              />
            </ListItem>
          </List>
        </Paper>
      </Grid>

      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Case Info
          </Typography>
          <List>
            <ListItem>
              <ListItemAvatar>
                <Avatar>
                  <EmailIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary="Email"
                secondary={caseData.email}
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemAvatar>
                <Avatar>
                  <PhoneIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary="Phone"
                secondary={caseData.phone}
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemAvatar>
                <Avatar>
                  <ChatIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary="Channel"
                secondary={caseData.channel}
              />
            </ListItem>
          </List>
        </Paper>
      </Grid>
    </Grid>
  );
}
