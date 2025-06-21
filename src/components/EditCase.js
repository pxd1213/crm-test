import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Chip,
  FormControlLabel,
  Checkbox,
  Alert,
} from '@mui/material';
import {
  CASE_STATUS,
  CASE_PRIORITY,
  CASE_CHANNEL,
} from '../services/casesService';

export default function EditCase({ open, caseData, onClose, onUpdate }) {
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    type: 'technical_support',
    channel: CASE_CHANNEL.EMAIL,
    priority: CASE_PRIORITY.MEDIUM,
    status: CASE_STATUS.OPEN,
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    assignTo: '',
    dueDate: '',
    tags: [],
    error: '',
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (caseData) {
      setFormData({
        ...caseData,
        dueDate: caseData.dueDate ? new Date(caseData.dueDate).toISOString().split('T')[0] : '',
        tags: caseData.tags || [],
      });
    }
  }, [caseData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTags = (e) => {
    const { checked, value } = e.target;
    setFormData(prev => ({
      ...prev,
      tags: checked
        ? [...prev.tags, value]
        : prev.tags.filter(tag => tag !== value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFormData(prev => ({ ...prev, error: '' }));

    try {
      // Basic validation
      if (!formData.subject.trim()) {
        throw new Error('Subject is required');
      }
      if (!formData.description.trim()) {
        throw new Error('Description is required');
      }
      if (!formData.customerEmail.trim()) {
        throw new Error('Customer email is required');
      }

      // Update case using CasesService
      const casesService = new CasesService();
      await casesService.updateCase(caseData.id, {
        ...formData,
        updatedAt: new Date(),
        status: formData.status, // Allow status change
      });

      // Close dialog and refresh data
      onClose();
      onUpdate();
    } catch (error) {
      setFormData(prev => ({ ...prev, error: error.message }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Edit Case</DialogTitle>
      <DialogContent>
        {formData.error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {formData.error}
          </Alert>
        )}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="subject"
            label="Subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            multiline
            rows={4}
            id="description"
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />

          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select
                name="type"
                value={formData.type}
                label="Type"
                onChange={handleChange}
              >
                <MenuItem value="technical_support">Technical Support</MenuItem>
                <MenuItem value="billing">Billing</MenuItem>
                <MenuItem value="feature_request">Feature Request</MenuItem>
                <MenuItem value="general_inquiry">General Inquiry</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={formData.status}
                label="Status"
                onChange={handleChange}
              >
                <MenuItem value={CASE_STATUS.OPEN}>Open</MenuItem>
                <MenuItem value={CASE_STATUS.IN_PROGRESS}>In Progress</MenuItem>
                <MenuItem value={CASE_STATUS.RESOLVED}>Resolved</MenuItem>
                <MenuItem value={CASE_STATUS.CLOSED}>Closed</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Channel</InputLabel>
              <Select
                name="channel"
                value={formData.channel}
                label="Channel"
                onChange={handleChange}
              >
                <MenuItem value={CASE_CHANNEL.EMAIL}>Email</MenuItem>
                <MenuItem value={CASE_CHANNEL.CHAT}>Chat</MenuItem>
                <MenuItem value={CASE_CHANNEL.PHONE}>Phone</MenuItem>
                <MenuItem value={CASE_CHANNEL.TICKET}>Ticket</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                name="priority"
                value={formData.priority}
                label="Priority"
                onChange={handleChange}
              >
                <MenuItem value={CASE_PRIORITY.LOW}>Low</MenuItem>
                <MenuItem value={CASE_PRIORITY.MEDIUM}>Medium</MenuItem>
                <MenuItem value={CASE_PRIORITY.HIGH}>High</MenuItem>
                <MenuItem value={CASE_PRIORITY.URGENT}>Urgent</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              fullWidth
              id="dueDate"
              label="Due Date"
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
              }}
            />

            <TextField
              fullWidth
              id="assignTo"
              label="Assign To"
              name="assignTo"
              value={formData.assignTo}
              onChange={handleChange}
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              fullWidth
              id="customerName"
              label="Customer Name"
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
            />

            <TextField
              fullWidth
              required
              id="customerEmail"
              label="Customer Email"
              name="customerEmail"
              value={formData.customerEmail}
              onChange={handleChange}
            />
          </Box>

          <TextField
            fullWidth
            id="customerPhone"
            label="Customer Phone (Optional)"
            name="customerPhone"
            value={formData.customerPhone}
            onChange={handleChange}
          />

          <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
            Tags
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.tags.includes('bug')}
                  onChange={handleTags}
                  name="tags"
                  value="bug"
                />
              }
              label={<Chip label="Bug" color="error" size="small" />}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.tags.includes('feature')}
                  onChange={handleTags}
                  name="tags"
                  value="feature"
                />
              }
              label={<Chip label="Feature" color="primary" size="small" />}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.tags.includes('billing')}
                  onChange={handleTags}
                  name="tags"
                  value="billing"
                />
              }
              label={<Chip label="Billing" color="success" size="small" />}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.tags.includes('urgent')}
                  onChange={handleTags}
                  name="tags"
                  value="urgent"
                />
              }
              label={<Chip label="Urgent" color="warning" size="small" />}
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit" variant="contained" disabled={loading}>
          {loading ? 'Updating...' : 'Update Case'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
