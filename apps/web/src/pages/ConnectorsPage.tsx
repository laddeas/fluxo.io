// ============================================================================
// DataFusion AI — Connectors Page
// Connector management with cards view and registry
// ============================================================================

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Grid,
  TextField,
  InputAdornment,
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
  MenuItem,
  IconButton,
  Tabs,
  Tab,
} from '@mui/material';
import {
  AddOutlined,
  SearchOutlined,
  CheckCircleOutlined,
  ErrorOutlined,
  SettingsOutlined,
  DeleteOutlined,
  PlayArrowOutlined,
  CloudOutlined,
  StorageOutlined,
  ApiOutlined,
  BusinessOutlined,
  FolderOutlined,
  ViewModuleOutlined,
  ViewListOutlined,
} from '@mui/icons-material';
import { brand } from '../theme/theme';

const connectors = [
  {
    id: 'CON-001',
    name: 'Salesforce',
    type: 'ENTERPRISE_APP',
    status: 'ACTIVE',
    version: '2.1.0',
    description: 'CRM integration for contacts, leads, and opportunities',
    icon: '☁️',
    color: '#00A1E0',
    lastTested: '2 min ago',
    interfaces: 3,
  },
  {
    id: 'CON-002',
    name: 'SAP S/4HANA',
    type: 'ENTERPRISE_APP',
    status: 'ACTIVE',
    version: '1.5.0',
    description: 'ERP integration for finance, logistics, and procurement',
    icon: '🏭',
    color: '#0FAAFF',
    lastTested: '15 min ago',
    interfaces: 5,
  },
  {
    id: 'CON-003',
    name: 'PostgreSQL',
    type: 'DATABASE',
    status: 'ACTIVE',
    version: '1.0.0',
    description: 'Relational database connector with full CRUD support',
    icon: '🐘',
    color: '#336791',
    lastTested: '1 min ago',
    interfaces: 8,
  },
  {
    id: 'CON-004',
    name: 'AWS S3',
    type: 'CLOUD_STORAGE',
    status: 'ACTIVE',
    version: '1.2.0',
    description: 'Amazon S3 object storage for file ingestion and export',
    icon: '📦',
    color: '#FF9900',
    lastTested: '5 min ago',
    interfaces: 4,
  },
  {
    id: 'CON-005',
    name: 'REST API',
    type: 'REST_API',
    status: 'ACTIVE',
    version: '1.0.0',
    description: 'Generic REST API connector with OAuth2 support',
    icon: '🔗',
    color: brand.accent,
    lastTested: '8 min ago',
    interfaces: 12,
  },
  {
    id: 'CON-006',
    name: 'ServiceNow',
    type: 'ENTERPRISE_APP',
    status: 'ACTIVE',
    version: '1.3.0',
    description: 'ITSM integration for incidents, tickets, and changes',
    icon: '🎫',
    color: '#81B5A1',
    lastTested: '20 min ago',
    interfaces: 2,
  },
  {
    id: 'CON-007',
    name: 'Azure Blob Storage',
    type: 'CLOUD_STORAGE',
    status: 'ERROR',
    version: '1.1.0',
    description: 'Microsoft Azure blob storage for large-scale data',
    icon: '☁️',
    color: '#0078D4',
    lastTested: '1 hour ago',
    interfaces: 1,
  },
  {
    id: 'CON-008',
    name: 'SFTP Server',
    type: 'FILE_SYSTEM',
    status: 'INACTIVE',
    version: '1.0.0',
    description: 'Secure file transfer protocol connector',
    icon: '📁',
    color: '#607D8B',
    lastTested: '3 days ago',
    interfaces: 0,
  },
];

const ConnectorsPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [createOpen, setCreateOpen] = useState(false);

  const filtered = connectors.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>Connectors</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Manage data source and destination connectors
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddOutlined />} onClick={() => setCreateOpen(true)}>
          Add Connector
        </Button>
      </Box>

      {/* Search */}
      <Box sx={{ mb: 3 }}>
        <TextField
          size="small"
          placeholder="Search connectors..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ width: 400 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchOutlined sx={{ fontSize: 20, color: 'text.secondary' }} />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Connector Cards Grid */}
      <Grid container spacing={2.5}>
        {filtered.map((connector) => (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={connector.id}>
            <Card
              sx={{
                height: '100%',
                position: 'relative',
                cursor: 'pointer',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 3,
                  background: connector.status === 'ACTIVE'
                    ? `linear-gradient(90deg, ${connector.color}, ${alpha(connector.color, 0.3)})`
                    : connector.status === 'ERROR'
                    ? `linear-gradient(90deg, ${brand.error}, ${alpha(brand.error, 0.3)})`
                    : `linear-gradient(90deg, #64748B, ${alpha('#64748B', 0.3)})`,
                },
              }}
            >
              <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Avatar
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: '14px',
                      fontSize: '1.5rem',
                      bgcolor: alpha(connector.color, 0.1),
                    }}
                  >
                    {connector.icon}
                  </Avatar>
                  <Chip
                    label={connector.status}
                    size="small"
                    icon={
                      connector.status === 'ACTIVE'
                        ? <CheckCircleOutlined sx={{ fontSize: '14px !important' }} />
                        : connector.status === 'ERROR'
                        ? <ErrorOutlined sx={{ fontSize: '14px !important' }} />
                        : undefined
                    }
                    sx={{
                      fontWeight: 700,
                      fontSize: '0.65rem',
                      bgcolor: alpha(
                        connector.status === 'ACTIVE' ? brand.success :
                        connector.status === 'ERROR' ? brand.error : '#64748B',
                        0.1
                      ),
                      color:
                        connector.status === 'ACTIVE' ? brand.success :
                        connector.status === 'ERROR' ? brand.error : '#64748B',
                      '& .MuiChip-icon': { color: 'inherit' },
                    }}
                  />
                </Box>

                <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1rem', mb: 0.5 }}>
                  {connector.name}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1.5, lineHeight: 1.5 }}>
                  {connector.description}
                </Typography>

                <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                  <Chip label={connector.type.replace(/_/g, ' ')} size="small" variant="outlined" sx={{ fontSize: '0.65rem', height: 22 }} />
                  <Chip label={`v${connector.version}`} size="small" variant="outlined" sx={{ fontSize: '0.65rem', height: 22 }} />
                  <Chip label={`${connector.interfaces} interfaces`} size="small" variant="outlined" sx={{ fontSize: '0.65rem', height: 22 }} />
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                    Tested: {connector.lastTested}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <Tooltip title="Test Connection">
                      <IconButton size="small"><PlayArrowOutlined fontSize="small" /></IconButton>
                    </Tooltip>
                    <Tooltip title="Configure">
                      <IconButton size="small"><SettingsOutlined fontSize="small" /></IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Add Connector Dialog */}
      <Dialog open={createOpen} onClose={() => setCreateOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Add New Connector</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Grid container spacing={2} sx={{ mt: 0 }}>
            <Grid size={12}>
              <TextField fullWidth label="Connector Name" />
            </Grid>
            <Grid size={6}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select label="Type" defaultValue="">
                  <MenuItem value="REST_API">REST API</MenuItem>
                  <MenuItem value="DATABASE">Database</MenuItem>
                  <MenuItem value="CLOUD_STORAGE">Cloud Storage</MenuItem>
                  <MenuItem value="ENTERPRISE_APP">Enterprise App</MenuItem>
                  <MenuItem value="FILE_SYSTEM">File System</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={6}>
              <FormControl fullWidth>
                <InputLabel>Auth Method</InputLabel>
                <Select label="Auth Method" defaultValue="">
                  <MenuItem value="OAUTH2">OAuth 2.0</MenuItem>
                  <MenuItem value="API_KEY">API Key</MenuItem>
                  <MenuItem value="BASIC">Basic Auth</MenuItem>
                  <MenuItem value="JWT">JWT</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={12}>
              <TextField fullWidth label="Host / URL" placeholder="https://api.example.com" />
            </Grid>
            <Grid size={12}>
              <TextField fullWidth label="Description" multiline rows={2} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setCreateOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => setCreateOpen(false)}>
            Add Connector
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ConnectorsPage;
