import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import { Download as DownloadIcon, Upload as UploadIcon } from '@mui/icons-material';
import { mockEnergyScanData } from './mock/energyScan.js';
import * as XLSX from 'xlsx';

const EnergyScan = () => {
  const [file, setFile] = useState(null);
  const [parsedData] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError('');
    }
  };

  const handleDownloadExcel = () => {
    // Simulate Excel download with mock data
    const ws = XLSX.utils.json_to_sheet([mockEnergyScanData]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Energy Statement');
    XLSX.writeFile(wb, 'energy-statement.xlsx');
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Energy Statement Scanner
      </Typography>

      <Card sx={{ mb: 4 }}>
        <CardHeader title="Upload Energy Statement" />
        <CardContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
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
              >
                {file ? file.name : 'Choose PDF File'}
              </Button>
            </label>
            {error && (
              <Typography color="error" variant="body2">
                {error}
              </Typography>
            )}
          </Box>
        </CardContent>
      </Card>

      {parsedData && (
        <>
          <Card>
            <CardHeader title="Parsed Statement Data" />
            <CardContent>
              <TableContainer component={Paper}>
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
            </CardContent>
          </Card>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={handleDownloadExcel}
            >
              Download Excel
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
};

export default EnergyScan;
