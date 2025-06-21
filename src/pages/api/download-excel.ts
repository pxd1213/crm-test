import { NextApiRequest, NextApiResponse } from 'next';
import * as XLSX from 'xlsx';
import { ParsedData } from '../../components/EnergyLinkUploader';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const data = req.query.data as string;
    const parsedData = JSON.parse(data) as ParsedData;

    // Create worksheet data
    const wsData = [
      ['Account Name', 'Statement Date', 'Net Revenue'],
      [parsedData.accountName, parsedData.statementDate, parsedData.netRevenue],
    ];

    // Create workbook and worksheet
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'EnergyLink Statement');

    // Set response headers for Excel download
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=energylink_statement.xlsx');

    // Write the Excel file to the response
    const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });
    res.send(buffer);
  } catch (error) {
    console.error('Error generating Excel:', error);
    res.status(500).json({ error: 'Failed to generate Excel file' });
  }
}
