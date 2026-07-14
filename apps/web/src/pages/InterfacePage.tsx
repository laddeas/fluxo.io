// ============================================================================
// DataFusion AI — Interface Page
// Input & Output interface management with tabs and mock handlers
// ============================================================================

import React, { useState, useRef } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Card,
  CardContent,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  Avatar,
  Tooltip,
  alpha,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  Grid,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  AddOutlined,
  SearchOutlined,
  FilterListOutlined,
  MoreVertOutlined,
  PlayArrowOutlined,
  EditOutlined,
  DeleteOutlined,
  VisibilityOutlined,
  CloudUploadOutlined,
  StorageOutlined,
  ApiOutlined,
  CloudOutlined,
  DescriptionOutlined,
  ScheduleOutlined,
  RefreshOutlined,
  InputOutlined,
  OutputOutlined,
  ContentCopyOutlined,
} from '@mui/icons-material';
import { brand } from '../theme/theme';

const initialInputInterfaces = [
  {
    id: 'INT-001',
    name: 'Salesforce Contact Sync',
    type: 'REST_API',
    connector: 'Salesforce',
    status: 'ACTIVE',
    triggerType: 'SCHEDULED',
    schedule: 'Every 15 min',
    lastRun: '2 min ago',
    records: '12,450',
    icon: '☁️',
  },
  {
    id: 'INT-002',
    name: 'SAP Invoice Import',
    type: 'ENTERPRISE_APP',
    connector: 'SAP',
    status: 'ACTIVE',
    triggerType: 'EVENT_BASED',
    schedule: 'On event',
    lastRun: '8 min ago',
    records: '8,231',
    icon: '🏭',
  },
  {
    id: 'INT-003',
    name: 'CSV File Upload',
    type: 'FILE_SYSTEM',
    connector: 'Local File',
    status: 'ACTIVE',
    triggerType: 'MANUAL',
    schedule: 'Manual',
    lastRun: '15 min ago',
    records: '5,678',
    icon: '📄',
  },
  {
    id: 'INT-004',
    name: 'PostgreSQL Orders Feed',
    type: 'DATABASE',
    connector: 'PostgreSQL',
    status: 'DRAFT',
    triggerType: 'SCHEDULED',
    schedule: 'Hourly',
    lastRun: 'Never',
    records: '0',
    icon: '🗄️',
  },
  {
    id: 'INT-005',
    name: 'Azure Blob Data Ingest',
    type: 'CLOUD_STORAGE',
    connector: 'Azure Blob',
    status: 'ERROR',
    triggerType: 'REAL_TIME',
    schedule: 'Real-time',
    lastRun: '1 hour ago',
    records: '0',
    icon: '☁️',
  },
];

const initialOutputInterfaces = [
  {
    id: 'OUT-001',
    name: 'Data Warehouse Export',
    type: 'DATABASE',
    connector: 'Snowflake',
    status: 'ACTIVE',
    triggerType: 'SCHEDULED',
    schedule: 'Daily 2 AM',
    lastRun: '6 hours ago',
    records: '124,500',
    icon: '🏢',
  },
  {
    id: 'OUT-002',
    name: 'S3 Archive Push',
    type: 'CLOUD_STORAGE',
    connector: 'AWS S3',
    status: 'ACTIVE',
    triggerType: 'EVENT_BASED',
    schedule: 'On completion',
    lastRun: '12 min ago',
    records: '45,200',
    icon: '📦',
  },
  {
    id: 'OUT-003',
    name: 'ServiceNow Ticket Create',
    type: 'ENTERPRISE_APP',
    connector: 'ServiceNow',
    status: 'ACTIVE',
    triggerType: 'REAL_TIME',
    schedule: 'Real-time',
    lastRun: '3 min ago',
    records: '3,421',
    icon: '🎫',
  },
];

const statusColors: Record<string, string> = {
  ACTIVE: brand.success,
  DRAFT: brand.warning,
  ERROR: brand.error,
  INACTIVE: '#64748B',
};

const typeIcons: Record<string, React.ReactElement> = {
  REST_API: <ApiOutlined />,
  DATABASE: <StorageOutlined />,
  FILE_SYSTEM: <DescriptionOutlined />,
  CLOUD_STORAGE: <CloudOutlined />,
  ENTERPRISE_APP: <CloudOutlined />,
};

const InterfacePage: React.FC = () => {
  const [tab, setTab] = useState(0);
  const [search, setSearch] = useState('');
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [createOpen, setCreateOpen] = useState(false);

  // Live API Connection state
  const [isLive, setIsLive] = useState(false);
  const [inputs, setInputs] = useState<any[]>([]);
  const [outputs, setOutputs] = useState<any[]>([]);

  // Form Fields States
  const [name, setName] = useState('');
  const [sourceType, setSourceType] = useState('');
  const [connector, setConnector] = useState('');
  const [triggerType, setTriggerType] = useState('');
  const [description, setDescription] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  // Feedback State
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info'>('success');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch Live Interfaces on Mount
  const fetchInterfaces = async () => {
    try {
      const response = await fetch('http://localhost:3005/api/v1/interfaces', {
        headers: {
          'x-tenant-id': 'TEN-001',
        },
      });
      const resData = await response.json();
      if (response.ok && resData.success) {
        const rawData = resData.data || [];
        // Sort into inputs/outputs by triggerType or type criteria
        const liveInputs = rawData.filter((item: any) =>
          ['REST_API', 'FILE_SYSTEM', 'CLOUD_STORAGE'].includes(item.type)
        ).map((item: any) => ({
          id: item.id,
          name: item.name,
          type: item.type,
          connector: item.connectorId || 'REST API',
          status: item.status || 'ACTIVE',
          triggerType: item.triggerType || 'MANUAL',
          schedule: item.triggerType === 'SCHEDULED' ? 'Hourly' : 'Manual',
          lastRun: 'Never',
          records: '0',
        }));

        const liveOutputs = rawData.filter((item: any) =>
          !['REST_API', 'FILE_SYSTEM', 'CLOUD_STORAGE'].includes(item.type)
        ).map((item: any) => ({
          id: item.id,
          name: item.name,
          type: item.type,
          connector: item.connectorId || 'Database Store',
          status: item.status || 'ACTIVE',
          triggerType: item.triggerType || 'MANUAL',
          schedule: item.triggerType === 'SCHEDULED' ? 'Daily' : 'Manual',
          lastRun: 'Never',
          records: '0',
        }));

        setInputs(liveInputs);
        setOutputs(liveOutputs);
        setIsLive(true);
      } else {
        throw new Error('API failed');
      }
    } catch (err) {
      console.warn('Interface Service API offline. Falling back to empty session data.');
      setInputs([]);
      setOutputs([]);
      setIsLive(false);
    }
  };

  React.useEffect(() => {
    fetchInterfaces();
  }, []);

  const data = tab === 0 ? inputs : outputs;
  const filtered = data.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.connector.toLowerCase().includes(search.toLowerCase())
  );

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setName(file.name.replace(/\.[^/.]+$/, "")); // Strip extension for interface name
      setSourceType('FILE_SYSTEM');
      setConnector('Local File');
      setTriggerType('MANUAL');
      setUploadedFile(file);
      setSnackbarMessage(`File "${file.name}" ready to ingest.`);
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setName(file.name.replace(/\.[^/.]+$/, ""));
      setSourceType('FILE_SYSTEM');
      setConnector('Local File');
      setTriggerType('MANUAL');
      setUploadedFile(file);
      setSnackbarMessage(`File "${file.name}" ready to ingest.`);
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    }
  };

  const handleCreate = async () => {
    if (!name.trim()) {
      setSnackbarMessage('Interface name is required');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    const payload = {
      name,
      type: sourceType || (tab === 0 ? 'REST_API' : 'DATABASE'),
      connectorId: connector || (tab === 0 ? 'REST API' : 'Snowflake'),
      triggerType: triggerType || 'MANUAL',
      scheduleConfig: {},
      schemaConfig: { description },
    };

    try {
      // 1. Post to live API if reachable
      const response = await fetch('http://localhost:3005/api/v1/interfaces', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-tenant-id': 'TEN-001',
        },
        body: JSON.stringify(payload),
      });

      const resData = await response.json();
      if (response.ok && resData.success) {
        setSnackbarMessage(`Interface "${name}" created successfully in live database!`);
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        fetchInterfaces();
      } else {
        throw new Error('API creation failed');
      }
    } catch (err) {
      // 2. Local Fallback simulation
      console.warn('API Offline. Simulating creation locally.');
      const newId = `${tab === 0 ? 'INT' : 'OUT'}-${String(Math.floor(100 + Math.random() * 900))}`;
      const newItem = {
        id: newId,
        name: name,
        type: payload.type,
        connector: payload.connectorId,
        status: 'ACTIVE',
        triggerType: payload.triggerType,
        schedule: triggerType === 'SCHEDULED' ? 'Hourly' : 'Manual',
        lastRun: 'Never',
        records: uploadedFile ? '1,024' : '0',
        icon: tab === 0 ? (sourceType === 'FILE_SYSTEM' ? '📄' : '☁️') : '🏢',
      };

      if (tab === 0) {
        setInputs([newItem, ...inputs]);
      } else {
        setOutputs([newItem, ...outputs]);
      }

      setSnackbarMessage(`Interface "${name}" created (Simulated Local Session).`);
      setSnackbarSeverity('info');
      setSnackbarOpen(true);
    }

    setCreateOpen(false);
    
    // Reset fields
    setName('');
    setSourceType('');
    setConnector('');
    setTriggerType('');
    setDescription('');
    setUploadedFile(null);
  };

  const handleRunInterface = (id: string, name: string) => {
    // Simulating running interface
    setSnackbarMessage(`Job execution started for "${name}" (${id})`);
    setSnackbarSeverity('info');
    setSnackbarOpen(true);
  };

  return (
    <Box>
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
        accept=".csv,.xls,.xlsx,.json,.xml,.txt,.pdf"
      />

      {/* Page Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            Interfaces
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Manage data ingestion and export interfaces
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddOutlined />}
          onClick={() => setCreateOpen(true)}
          sx={{ px: 3 }}
        >
          Create Interface
        </Button>
      </Box>

      {/* Tabs */}
      <Card sx={{ mb: 3 }}>
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          sx={{
            px: 2,
            borderBottom: '1px solid',
            borderColor: 'divider',
            '& .MuiTab-root': {
              minHeight: 56,
            },
          }}
        >
          <Tab
            icon={<InputOutlined sx={{ fontSize: 18 }} />}
            iconPosition="start"
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                Input Interface
                <Chip label={inputs.length} size="small" sx={{ height: 20, fontSize: '0.7rem' }} />
              </Box>
            }
          />
          <Tab
            icon={<OutputOutlined sx={{ fontSize: 18 }} />}
            iconPosition="start"
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                Output Interface
                <Chip label={outputs.length} size="small" sx={{ height: 20, fontSize: '0.7rem' }} />
              </Box>
            }
          />
        </Tabs>

        <CardContent sx={{ p: 2.5 }}>
          {/* Search & Filter Bar */}
          <Box sx={{ display: 'flex', gap: 2, mb: 2.5 }}>
            <TextField
              size="small"
              placeholder="Search interfaces..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ flex: 1, maxWidth: 400 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchOutlined sx={{ fontSize: 20, color: 'text.secondary' }} />
                  </InputAdornment>
                ),
              }}
            />
            <Button variant="outlined" startIcon={<FilterListOutlined />} size="small">
              Filters
            </Button>
            <Button variant="outlined" startIcon={<RefreshOutlined />} size="small">
              Refresh
            </Button>
          </Box>

          {/* Interface Table */}
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Interface</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Connector</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Trigger</TableCell>
                  <TableCell>Last Run</TableCell>
                  <TableCell>Records</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                      No interfaces found matching your search.
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((item) => (
                    <TableRow
                      key={item.id}
                      hover
                      sx={{ cursor: 'pointer', '&:last-child td': { borderBottom: 0 } }}
                    >
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Avatar
                            sx={{
                              width: 36,
                              height: 36,
                              borderRadius: '10px',
                              fontSize: '1.1rem',
                              bgcolor: alpha(brand.primary, 0.1),
                            }}
                          >
                            {item.icon}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                              {item.name}
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                              {item.id}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={typeIcons[item.type]}
                          label={item.type.replace(/_/g, ' ')}
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: '0.72rem', '& .MuiChip-icon': { fontSize: 14 } }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                          {item.connector}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={item.status}
                          size="small"
                          sx={{
                            fontWeight: 700,
                            fontSize: '0.7rem',
                            bgcolor: alpha(statusColors[item.status] || '#64748B', 0.1),
                            color: statusColors[item.status] || '#64748B',
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <ScheduleOutlined sx={{ fontSize: 14, color: 'text.secondary' }} />
                          <Typography variant="caption">{item.schedule}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontSize: '0.85rem', color: 'text.secondary' }}>
                          {item.lastRun}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                          {item.records}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
                          <Tooltip title="Execute">
                            <IconButton
                              size="small"
                              sx={{ color: brand.success }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRunInterface(item.id, item.name);
                              }}
                            >
                              <PlayArrowOutlined fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="View">
                            <IconButton size="small">
                              <VisibilityOutlined fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit">
                            <IconButton size="small">
                              <EditOutlined fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="More">
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                setMenuAnchor(e.currentTarget);
                              }}
                            >
                              <MoreVertOutlined fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Row Actions Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
        slotProps={{ paper: { sx: { width: 180, borderRadius: '12px' } } }}
      >
        <MenuItem onClick={() => setMenuAnchor(null)}>
          <ContentCopyOutlined sx={{ mr: 1.5, fontSize: 18 }} /> Duplicate
        </MenuItem>
        <MenuItem onClick={() => setMenuAnchor(null)}>
          <ScheduleOutlined sx={{ mr: 1.5, fontSize: 18 }} /> Schedule
        </MenuItem>
        <MenuItem onClick={() => setMenuAnchor(null)} sx={{ color: 'error.main' }}>
          <DeleteOutlined sx={{ mr: 1.5, fontSize: 18 }} /> Delete
        </MenuItem>
      </Menu>

      {/* Create Interface Dialog */}
      <Dialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700 }}>
          Create New {tab === 0 ? 'Input' : 'Output'} Interface
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Grid container spacing={2} sx={{ mt: 0 }}>
            <Grid size={12}>
              <TextField
                fullWidth
                label="Interface Name"
                placeholder="e.g., Salesforce Contact Sync"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Grid>
            <Grid size={6}>
              <FormControl fullWidth>
                <InputLabel>Source Type</InputLabel>
                <Select
                  label="Source Type"
                  value={sourceType}
                  onChange={(e) => setSourceType(e.target.value)}
                >
                  <MenuItem value="REST_API">REST API</MenuItem>
                  <MenuItem value="DATABASE">Database</MenuItem>
                  <MenuItem value="FILE_SYSTEM">File Upload</MenuItem>
                  <MenuItem value="CLOUD_STORAGE">Cloud Storage</MenuItem>
                  <MenuItem value="ENTERPRISE_APP">Enterprise App</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={6}>
              <FormControl fullWidth>
                <InputLabel>Connector</InputLabel>
                <Select
                  label="Connector"
                  value={connector}
                  onChange={(e) => setConnector(e.target.value)}
                >
                  <MenuItem value="Salesforce">Salesforce</MenuItem>
                  <MenuItem value="SAP">SAP</MenuItem>
                  <MenuItem value="PostgreSQL">PostgreSQL</MenuItem>
                  <MenuItem value="AWS S3">AWS S3</MenuItem>
                  <MenuItem value="REST API">REST API</MenuItem>
                  <MenuItem value="Local File">Local File</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={6}>
              <FormControl fullWidth>
                <InputLabel>Trigger Type</InputLabel>
                <Select
                  label="Trigger Type"
                  value={triggerType}
                  onChange={(e) => setTriggerType(e.target.value)}
                >
                  <MenuItem value="MANUAL">Manual</MenuItem>
                  <MenuItem value="SCHEDULED">Scheduled</MenuItem>
                  <MenuItem value="EVENT_BASED">Event-Based</MenuItem>
                  <MenuItem value="REAL_TIME">Real-Time</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={6}>
              <TextField
                fullWidth
                label="Description"
                placeholder="Optional description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Grid>

            {/* File Upload Area */}
            {tab === 0 && (
              <Grid size={12}>
                <Box
                  onClick={handleFileClick}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  sx={{
                    border: '2px dashed',
                    borderColor: uploadedFile ? brand.success : 'divider',
                    borderRadius: '16px',
                    p: 4,
                    textAlign: 'center',
                    cursor: 'pointer',
                    bgcolor: uploadedFile ? alpha(brand.success, 0.04) : 'transparent',
                    transition: 'all 0.2s',
                    '&:hover': {
                      borderColor: uploadedFile ? brand.success : brand.primary,
                      bgcolor: uploadedFile ? alpha(brand.success, 0.06) : alpha(brand.primary, 0.04),
                    },
                  }}
                >
                  <CloudUploadOutlined sx={{ fontSize: 40, color: uploadedFile ? brand.success : 'text.secondary', mb: 1 }} />
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {uploadedFile ? `File Selected: ${uploadedFile.name}` : 'Drag & drop files here, or click to browse'}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {uploadedFile ? `(${(uploadedFile.size / 1024).toFixed(1)} KB)` : 'Supports CSV, XLS, XLSX, JSON, XML, TXT, PDF (Max 100MB)'}
                  </Typography>
                </Box>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setCreateOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreate}>
            Create Interface
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar feedback */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default InterfacePage;
