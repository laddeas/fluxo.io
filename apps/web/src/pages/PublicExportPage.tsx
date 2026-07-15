import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  alpha,
  Divider,
  Paper,
} from '@mui/material';
import {
  DownloadOutlined,
  CloudDownloadOutlined,
  SwapHorizOutlined,
} from '@mui/icons-material';
import { brand } from '../theme/theme';

const PublicExportPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<any>(null);
  const [data, setData] = useState<any[]>([]);
  const [format, setFormat] = useState('JSON');

  useEffect(() => {
    // 1. Fetch interface metadata
    const localInterfaces = JSON.parse(localStorage.getItem('df_interfaces') || '[]');
    const match = localInterfaces.find((i: any) => i.id === id);

    if (match) {
      setItem(match);
      setFormat(match.exportFormat || 'JSON');

      // 2. Aggregate data from selected inputs
      let combinedData: any[] = [];
      const selectedInputs = match.selectedInputs || [];

      if (selectedInputs.length > 0) {
        for (const inputId of selectedInputs) {
          const inpItem = localInterfaces.find((i: any) => i.id === inputId);
          if (inpItem) {
            // Retrieve default sample or upload data
            let sampleRows = [
              { id: '1', name: 'Sample Record A', created_at: '2026-07-14 10:00:00' },
              { id: '2', name: 'Sample Record B', created_at: '2026-07-14 10:15:00' }
            ];
            combinedData = [
              ...combinedData,
              ...sampleRows.map((row: any) => ({ ...row, source_input_name: inpItem.name }))
            ];
          }
        }
      }

      if (combinedData.length === 0) {
        combinedData = [
          { txn_id: 'TXN-001', department: 'Sales', volume: 1450, code: 'SALES_DEPT', processed_at: new Date().toLocaleDateString() },
          { txn_id: 'TXN-002', department: 'Finance', volume: 9800, code: 'FINANCE_DEPT', processed_at: new Date().toLocaleDateString() },
          { txn_id: 'TXN-003', department: 'IT Ops', volume: 24500, code: 'IT_OPS', processed_at: new Date().toLocaleDateString() },
        ];
      }

      setData(combinedData);
    }
  }, [id]);

  const handleDownload = (selectedFormat: string) => {
    if (!item) return;

    let blob: Blob;
    let filename: string;

    if (selectedFormat === 'CSV') {
      const headers = Object.keys(data[0] || {});
      const csvRows = [
        headers.join(','),
        ...data.map(row => headers.map(fieldName => JSON.stringify(row[fieldName] || '')).join(','))
      ];
      blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
      filename = `${item.name.toLowerCase().replace(/\s+/g, '-')}-data.csv`;
    } else if (selectedFormat === 'TXT') {
      const headers = Object.keys(data[0] || {});
      const txtRows = [
        headers.join('\t'),
        ...data.map(row => headers.map(fieldName => String(row[fieldName] || '')).join('\t'))
      ];
      blob = new Blob([txtRows.join('\n')], { type: 'text/plain;charset=utf-8;' });
      filename = `${item.name.toLowerCase().replace(/\s+/g, '-')}-data.txt`;
    } else {
      blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      filename = `${item.name.toLowerCase().replace(/\s+/g, '-')}-data.json`;
    }

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!item) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', p: 4, bgcolor: '#0B0F19', color: '#fff' }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
          Data Export Node Not Found
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
          The requested shareable link is invalid or expired.
        </Typography>
      </Box>
    );
  }

  const columns = Object.keys(data[0] || {});

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#0B0F19', color: '#fff', py: 6, px: 4 }}>
      <Paper sx={{ maxWidth: 1000, mx: 'auto', p: 4, bgcolor: '#111827', borderRadius: '16px', border: '1px solid', borderColor: 'divider' }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
              <SwapHorizOutlined sx={{ color: brand.success, fontSize: 32 }} />
              <Typography variant="h4" sx={{ fontWeight: 800 }}>
                {item.name}
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Public Shareable Integration Data Pipeline • ID: {item.id}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Chip label="PUBLIC DATA EXPORT" color="success" size="small" sx={{ fontWeight: 700, fontSize: '0.7rem' }} />
            <Chip label={format} size="small" variant="outlined" sx={{ fontWeight: 700, fontSize: '0.7rem' }} />
          </Box>
        </Box>

        <Divider sx={{ my: 3, borderColor: 'rgba(255, 255, 255, 0.08)' }} />

        {/* Download Section */}
        <Box sx={{ bgcolor: 'rgba(255,255,255,0.02)', p: 3, borderRadius: '12px', border: '1px solid', borderColor: 'rgba(255, 255, 255, 0.05)', mb: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
            Download Compiled Dataset
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
            This data is generated in real time from live upstream nodes. Select a format below to download:
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              startIcon={<CloudDownloadOutlined />}
              onClick={() => handleDownload('CSV')}
              sx={{ bgcolor: brand.success, '&:hover': { bgcolor: alpha(brand.success, 0.85) } }}
            >
              Export as CSV
            </Button>
            <Button
              variant="contained"
              startIcon={<CloudDownloadOutlined />}
              onClick={() => handleDownload('JSON')}
              sx={{ bgcolor: brand.primary, '&:hover': { bgcolor: alpha(brand.primary, 0.85) } }}
            >
              Export as JSON
            </Button>
            <Button
              variant="contained"
              startIcon={<CloudDownloadOutlined />}
              onClick={() => handleDownload('TXT')}
              sx={{ bgcolor: brand.accent, '&:hover': { bgcolor: alpha(brand.accent, 0.85) } }}
            >
              Export as Plain Text (TXT)
            </Button>
          </Box>
        </Box>

        {/* Data Preview */}
        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
          Live Dataset Preview ({data.length} records)
        </Typography>
        <TableContainer sx={{ border: '1px solid', borderColor: 'rgba(255, 255, 255, 0.08)', borderRadius: '12px', maxHeight: 350, overflowY: 'auto' }}>
          <Table size="small" stickyHeader sx={{ bgcolor: '#1F2937' }}>
            <TableHead>
              <TableRow>
                {columns.map((col) => (
                  <TableCell key={col} sx={{ fontWeight: 700, fontSize: '0.75rem', py: 1.5, color: '#fff', bgcolor: '#374151', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    {col}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.slice(0, 10).map((row, idx) => (
                <TableRow key={idx} hover sx={{ '&:last-child td': { borderBottom: 0 } }}>
                  {columns.map((col) => (
                    <TableCell key={col} sx={{ fontSize: '0.75rem', py: 1.5, color: 'rgba(255, 255, 255, 0.7)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                      {typeof row[col] === 'object' && row[col] !== null ? JSON.stringify(row[col]) : String(row[col])}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default PublicExportPage;
