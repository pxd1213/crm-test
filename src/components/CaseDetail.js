import React from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Divider,
} from '@mui/material';
import { Download as DownloadIcon, Add as AddIcon } from '@mui/icons-material';
import { mockCaseDetails } from './mock/caseDetails.js';

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

const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleString();
};

const CaseDetail = () => {
  const [openCommentDialog, setOpenCommentDialog] = React.useState(false);
  const [newComment, setNewComment] = React.useState('');

  const handleAddComment = () => {
    // Add new comment logic here
    setOpenCommentDialog(false);
    setNewComment('');
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Main Case Info */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="div" sx={{ mb: 2 }}>
                {mockCaseDetails.title}
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <Chip
                  label={mockCaseDetails.status}
                  color={getStatusColor(mockCaseDetails.status)}
                  sx={{ textTransform: 'capitalize' }}
                />
                <Chip
                  label={mockCaseDetails.priority}
                  color={mockCaseDetails.priority === 'high' ? 'error' : 'default'}
                  sx={{ textTransform: 'capitalize' }}
                />
                <Chip
                  label={mockCaseDetails.channel}
                  sx={{ textTransform: 'capitalize' }}
                />
              </Box>

              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                {mockCaseDetails.description}
              </Typography>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Created: {formatTimestamp(mockCaseDetails.createdAt)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Last Updated: {formatTimestamp(mockCaseDetails.updatedAt)}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Customer Info */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Customer Information
              </Typography>
              <Typography variant="body1" color="text.secondary">
                <strong>Name:</strong> {mockCaseDetails.customer.name}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                <strong>Email:</strong> {mockCaseDetails.customer.email}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                <strong>Phone:</strong> {mockCaseDetails.customer.phone}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                <strong>Account #:</strong> {mockCaseDetails.customer.accountNumber}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Case History */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Case History
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Description</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {mockCaseDetails.history.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{formatTimestamp(item.timestamp)}</TableCell>
                      <TableCell>{item.type}</TableCell>
                      <TableCell>{item.description}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Grid>

        {/* Documents */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Attached Documents
              </Typography>
              <Grid container spacing={2}>
                {mockCaseDetails.documents.map((doc, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Paper
                      elevation={2}
                      sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}
                    >
                      <DownloadIcon />
                      <Typography variant="body1">
                        {doc.name}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Comments */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Comments
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setOpenCommentDialog(true)}
                sx={{ mb: 2 }}
              >
                Add Comment
              </Button>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Author</TableCell>
                    <TableCell>Time</TableCell>
                    <TableCell>Comment</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {mockCaseDetails.comments.map((comment, index) => (
                    <TableRow key={index}>
                      <TableCell>{comment.author}</TableCell>
                      <TableCell>{formatTimestamp(comment.timestamp)}</TableCell>
                      <TableCell>{comment.content}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Add Comment Dialog */}
      <Dialog open={openCommentDialog} onClose={() => setOpenCommentDialog(false)}>
        <DialogTitle>Add Comment</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={4}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Enter your comment..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCommentDialog(false)}>Cancel</Button>
          <Button onClick={handleAddComment} variant="contained">
            Add Comment
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CaseDetail;
