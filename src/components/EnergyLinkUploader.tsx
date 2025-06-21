import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  LinearProgress,
  Alert,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { Upload as UploadIcon, Download as DownloadIcon } from '@mui/icons-material';
import axios from 'axios';

export interface ParsedData {
  accountName: string;
  statementDate: string;
  netRevenue: number;
  // Add other fields as needed
}

const EnergyLinkUploader: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [parsedData, setParsedData] = useState<ParsedData | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === 'application/pdf') {
        setFile(selectedFile);
        setError(null);
      } else {
        setError('Please upload a PDF file');
        setFile(null);
      }
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('pdf', file);

      const response = await axios.post('/api/parse-energylink', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setParsedData(response.data);
    } catch (err) {
      setError('Failed to process the file. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!parsedData) return;

    try {
      const response = await axios.get('/api/download-excel', {
        responseType: 'blob',
        params: { data: JSON.stringify(parsedData) },
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'energylink_statement.xlsx');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      setError('Failed to download the Excel file.');
    }
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          EnergyLink Statement Converter
        </Typography>
        <Typography variant="body1" color="textSecondary" paragraph>
          Upload your EnergyLink statement PDF to convert it into a structured format.
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ mb: 3 }}>
        <input
          accept="application/pdf"
          style={{ display: 'none' }}
          id="raised-button-file"
          type="file"
          onChange={handleFileChange}
        />
        <label htmlFor="raised-button-file">
          <Button
            variant="contained"
            component="span"
            startIcon={<UploadIcon />}
            disabled={loading}
          >
            {file ? file.name : 'Choose PDF'}
          </Button>
        </label>
        {file && (
          <Button
            variant="outlined"
            onClick={handleUpload}
            startIcon={<DownloadIcon />}
            disabled={loading}
            sx={{ ml: 2 }}
          >
            Process Statement
          </Button>
        )}
      </Box>

      {loading && <LinearProgress sx={{ mb: 3 }} />}

      {parsedData && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Parsed Data Preview
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Field</TableCell>
                  <TableCell>Value</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Account Name</TableCell>
                  <TableCell>{parsedData.accountName}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Statement Date</TableCell>
                  <TableCell>{parsedData.statementDate}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Net Revenue</TableCell>
                  <TableCell>${parsedData.netRevenue.toFixed(2)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          <Button
            variant="contained"
            onClick={handleDownload}
            startIcon={<DownloadIcon />}
            sx={{ mt: 2 }}
          >
            Download Excel
          </Button>
        </Box>
      )}
    </Paper>
  );
};

export default EnergyLinkUploader;
