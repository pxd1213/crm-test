import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Typography,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
} from '@mui/material';
import { Upload as UploadIcon, Download as DownloadIcon } from '@mui/icons-material';
import axios from 'axios';

interface ParsedData {
  accountName: string;
  statementDate: string;
  netRevenue: number;
}

export default function EnergyScan() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [parsedData, setParsedData] = useState<ParsedData | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setError('');
    } else {
      setError('Please select a PDF file');
      setFile(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    setError('');

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
      setError('Failed to parse PDF');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!parsedData) return;

    axios.get('/api/download-excel', {
      params: { data: JSON.stringify(parsedData) },
      responseType: 'blob',
    }).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'energylink_statement.xlsx');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }).catch(() => {
      setError('Failed to download Excel file');
    });
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4 }}>
      <Card>
        <CardHeader title="EnergyLink Statement Parser" />
        <CardContent>
          <Box sx={{ mb: 3 }}>
            <Button
              variant="outlined"
              component="label"
              startIcon={<UploadIcon />}
              sx={{ mr: 2 }}
            >
              Upload PDF
              <input
                type="file"
                hidden
                accept="application/pdf"
                onChange={handleFileChange}
              />
            </Button>
            {file && (
              <Typography variant="body2" color="textSecondary">
                Selected file: {file.name}
              </Typography>
            )}
            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
          </Box>

          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <CircularProgress />
            </Box>
          )}

          {parsedData && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Parsed Data Preview
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell>Account Name:</TableCell>
                      <TableCell>{parsedData.accountName}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Statement Date:</TableCell>
                      <TableCell>{parsedData.statementDate}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Net Revenue:</TableCell>
                      <TableCell>${parsedData.netRevenue.toFixed(2)}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<DownloadIcon />}
                  onClick={handleDownload}
                >
                  Download Excel
                </Button>
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
