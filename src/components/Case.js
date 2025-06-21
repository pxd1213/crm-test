import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  Chip,
  Button,
  Avatar,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from '@mui/material';
import {
  SupportAgent as SupportAgentIcon,
  Chat as ChatIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Timer as TimerIcon,
  Star as StarIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  DeleteForever as DeleteForeverIcon,
} from '@mui/icons-material';
import { CASE_STATUS, CASE_PRIORITY, CASE_CHANNEL } from '../services/casesService';
import EditCase from './EditCase';

export default function Case({ caseData, onEdit, onDelete }) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [error, setError] = useState('');

  const handleEditOpen = () => {
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setEditOpen(false);
  };

  const handleDeleteOpen = () => {
    setDeleteOpen(true);
  };

  const handleDeleteClose = () => {
    setDeleteOpen(false);
  };

  const handleDeleteConfirm = async () => {
    try {
      const casesService = new CasesService();
      await casesService.deleteCase(caseData.id);
      onDelete(caseData.id);
    } catch (error) {
      setError(error.message);
    } finally {
      handleDeleteClose();
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case CASE_STATUS.OPEN:
        return 'warning';
      case CASE_STATUS.IN_PROGRESS:
        return 'info';
      case CASE_STATUS.RESOLVED:
        return 'success';
      case CASE_STATUS.CLOSED:
        return 'default';
      default:
        return 'primary';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case CASE_PRIORITY.LOW:
        return 'success';
      case CASE_PRIORITY.MEDIUM:
        return 'warning';
      case CASE_PRIORITY.HIGH:
        return 'error';
      case CASE_PRIORITY.URGENT:
        return 'error';
      default:
        return 'primary';
    }
  };

  const getChannelIcon = (channel) => {
    switch (channel) {
      case CASE_CHANNEL.CHAT:
        return <ChatIcon />;
      case CASE_CHANNEL.EMAIL:
        return <EmailIcon />;
      case CASE_CHANNEL.PHONE:
        return <PhoneIcon />;
      default:
        return <SupportAgentIcon />;
    }
  };

  return (
    <>
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                {getChannelIcon(caseData.channel)}
              </Avatar>
              <Box>
                <Typography variant="h6" component="div">
                  {caseData.subject}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {caseData.customerName} • {caseData.customerEmail}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Chip
                label={caseData.status}
                color={getStatusColor(caseData.status)}
                size="small"
                sx={{ textTransform: 'capitalize' }}
              />
              <Chip
                label={caseData.priority}
                color={getPriorityColor(caseData.priority)}
                size="small"
                sx={{ textTransform: 'capitalize' }}
              />
            </Box>
          </Box>

          <Typography variant="body1" sx={{ mb: 2 }}>
            {caseData.description}
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            {caseData.responseTime && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <TimerIcon color="primary" fontSize="small" />
                <Typography variant="body2" color="text.secondary">
                  Response Time: {caseData.responseTime} mins
                </Typography>
              </Box>
            )}
            {caseData.satisfactionScore && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <StarIcon color="warning" fontSize="small" />
                <Typography variant="body2" color="text.secondary">
                  {caseData.satisfactionScore}/5
                </Typography>
              </Box>
            )}
          </Box>
        </CardContent>

        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Tooltip title="Edit Case">
            <IconButton onClick={handleEditOpen}>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Case">
            <IconButton onClick={handleDeleteOpen} color="error">
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </CardActions>
      </Card>

      <EditCase
        open={editOpen}
        caseData={caseData}
        onClose={handleEditClose}
        onUpdate={onEdit}
      />

      <Dialog
        open={deleteOpen}
        onClose={handleDeleteClose}
        maxWidth="xs"
      >
        <DialogTitle>Delete Case</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Typography variant="body1" sx={{ mt: 2 }}>
            Are you sure you want to delete this case? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteClose}>Cancel</Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            color="error"
            startIcon={<DeleteForeverIcon />}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
