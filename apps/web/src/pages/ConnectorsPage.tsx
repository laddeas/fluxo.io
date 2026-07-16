// ============================================================================
// DataFusion AI — Connectors Page
// Connector management with local storage persistence
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
  Snackbar,
  Alert,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import {
  AddOutlined,
  SearchOutlined,
  DeleteOutlined,
  PlayArrowOutlined,
  SettingsOutlined,
} from '@mui/icons-material';
import { brand } from '../theme/theme';

const ConnectorsPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingConnector, setEditingConnector] = useState<any | null>(null);

  // WhatsApp & Telegram states
  const [msgAppProvider, setMsgAppProvider] = useState('WHATSAPP');
  const [msgAppToken, setMsgAppToken] = useState('');
  const [msgAppPhoneId, setMsgAppPhoneId] = useState('');
  const [msgAppAllowImages, setMsgAppAllowImages] = useState(true);
  const [msgAppAllowDocs, setMsgAppAllowDocs] = useState(true);
  const [msgAppBucketPath, setMsgAppBucketPath] = useState('s3://whatsapp-telegram-media/');

  // Form Field States
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [authMethod, setAuthMethod] = useState('');
  const [hostUrl, setHostUrl] = useState('');
  const [description, setDescription] = useState('');

  // OAuth 2.0 Field States
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [tokenUrl, setTokenUrl] = useState('');
  const [authUrl, setAuthUrl] = useState('');
  const [redirectUrl, setRedirectUrl] = useState('');
  const [scopes, setScopes] = useState('');

  // API Key Field States
  const [apiKey, setApiKey] = useState('');

  // Basic Auth Field States
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // JWT Token Field States
  const [jwtToken, setJwtToken] = useState('');

  // Database Field States
  const [dbType, setDbType] = useState('POSTGRES');
  const [dbHost, setDbHost] = useState('');
  const [dbPort, setDbPort] = useState('');
  const [dbName, setDbName] = useState('');
  const [dbUsername, setDbUsername] = useState('');
  const [dbPassword, setDbPassword] = useState('');
  const [dbSsl, setDbSsl] = useState(false);
  const [dbSchema, setDbSchema] = useState('');

  // Cloud Storage Field States
  const [csProvider, setCsProvider] = useState('S3');
  const [csBucket, setCsBucket] = useState('');
  const [csRegion, setCsRegion] = useState('');
  const [csAccessKey, setCsAccessKey] = useState('');
  const [csSecretKey, setCsSecretKey] = useState('');
  const [csServiceAccountJson, setCsServiceAccountJson] = useState('');
  const [csPrefix, setCsPrefix] = useState('');

  // File System Field States
  const [fsRootPath, setFsRootPath] = useState('');
  const [fsRemoteType, setFsRemoteType] = useState('NONE');
  const [fsHost, setFsHost] = useState('');
  const [fsPort, setFsPort] = useState('');
  const [fsUsername, setFsUsername] = useState('');
  const [fsPassword, setFsPassword] = useState('');
  const [fsRead, setFsRead] = useState(true);
  const [fsWrite, setFsWrite] = useState(true);

  // Load connectors from localStorage
  const [connectorsList, setConnectorsList] = useState<any[]>(() => {
    return JSON.parse(localStorage.getItem('df_connectors') || '[]');
  });

  // Feedback State
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [toastSeverity, setToastSeverity] = useState<'success' | 'error' | 'info'>('success');

  const handleCreate = () => {
    if (!name.trim() || !type) {
      showToast('Name and Type are required.', 'error');
      return;
    }

    const newConnector = {
      id: `CON-${String(Math.floor(100 + Math.random() * 900))}`,
      name,
      type,
      status: 'ACTIVE',
      version: '1.0.0',
      description: description || `Connection configuration for ${name}`,
      icon: type === 'DATABASE' ? '🐘' : type === 'CLOUD_STORAGE' ? '📦' : type === 'FILE_SYSTEM' ? '📁' : type === 'MESSAGING_APP' ? (msgAppProvider === 'WHATSAPP' ? '💬' : '✈️') : '🔗',
      color: type === 'DATABASE' ? '#336791' : type === 'CLOUD_STORAGE' ? '#FF9900' : type === 'FILE_SYSTEM' ? '#10B981' : type === 'MESSAGING_APP' ? (msgAppProvider === 'WHATSAPP' ? '#25D366' : '#0088cc') : brand.accent,
      lastTested: 'Just now',
      interfaces: 0,
      hostUrl: type === 'DATABASE' ? dbHost : type === 'FILE_SYSTEM' ? fsRootPath : type === 'MESSAGING_APP' ? (msgAppProvider === 'WHATSAPP' ? 'graph.facebook.com' : 'api.telegram.org') : hostUrl,
      authMethod,
      // Map configuration based on authMethod selection
      oauthConfig: type === 'REST_API' && authMethod === 'OAUTH2' ? {
        clientId,
        clientSecret,
        tokenUrl,
        authUrl,
        redirectUrl,
        scopes,
      } : undefined,
      apiKeyConfig: type === 'REST_API' && authMethod === 'API_KEY' ? {
        apiKey,
      } : undefined,
      basicAuthConfig: type === 'REST_API' && authMethod === 'BASIC' ? {
        username,
        password,
      } : undefined,
      jwtConfig: type === 'REST_API' && authMethod === 'JWT' ? {
        jwtToken,
      } : undefined,
      // Database specific configs
      databaseConfig: type === 'DATABASE' ? {
        dbType,
        dbHost,
        dbPort,
        dbName,
        dbUsername,
        dbPassword,
        dbSsl,
        dbSchema,
      } : undefined,
      // Cloud storage configs
      cloudStorageConfig: type === 'CLOUD_STORAGE' ? {
        csProvider,
        csBucket,
        csRegion,
        csAccessKey,
        csSecretKey,
        csServiceAccountJson,
        csPrefix,
      } : undefined,
      // File system configs
      fileSystemConfig: type === 'FILE_SYSTEM' ? {
        fsRootPath,
        fsRemoteType,
        fsHost,
        fsPort,
        fsUsername,
        fsPassword,
        fsRead,
        fsWrite,
      } : undefined,
      // Messaging app configs
      messagingAppConfig: type === 'MESSAGING_APP' ? {
        provider: msgAppProvider,
        token: msgAppToken,
        phoneId: msgAppPhoneId,
        allowImages: msgAppAllowImages,
        allowDocs: msgAppAllowDocs,
        bucketPath: msgAppBucketPath,
      } : undefined,
    };

    const updated = [newConnector, ...connectorsList];
    setConnectorsList(updated);
    localStorage.setItem('df_connectors', JSON.stringify(updated));
    setCreateOpen(false);

    // Reset Form
    setName('');
    setType('');
    setAuthMethod('');
    setHostUrl('');
    setDescription('');
    setClientId('');
    setClientSecret('');
    setTokenUrl('');
    setAuthUrl('');
    setRedirectUrl('');
    setScopes('');
    setApiKey('');
    setUsername('');
    setPassword('');
    setJwtToken('');
    
    // DB resets
    setDbHost('');
    setDbPort('');
    setDbName('');
    setDbUsername('');
    setDbPassword('');
    setDbSsl(false);
    setDbSchema('');

    // Cloud resets
    setCsBucket('');
    setCsRegion('');
    setCsAccessKey('');
    setCsSecretKey('');
    setCsServiceAccountJson('');
    setCsPrefix('');

    // FS resets
    setFsRootPath('');
    setFsRemoteType('NONE');
    setFsHost('');
    setFsPort('');
    setFsUsername('');
    setFsPassword('');
    setFsRead(true);
    setFsWrite(true);

    showToast(`Connector "${name}" added successfully.`, 'success');
  };

  const handleOpenEdit = (connector: any) => {
    setEditingConnector(connector);
    setName(connector.name || '');
    setType(connector.type || '');
    setAuthMethod(connector.authMethod || '');
    setHostUrl(connector.hostUrl || '');
    setDescription(connector.description || '');

    // REST configs
    setClientId(connector.oauthConfig?.clientId || '');
    setClientSecret(connector.oauthConfig?.clientSecret || '');
    setTokenUrl(connector.oauthConfig?.tokenUrl || '');
    setAuthUrl(connector.oauthConfig?.authUrl || '');
    setRedirectUrl(connector.oauthConfig?.redirectUrl || '');
    setScopes(connector.oauthConfig?.scopes || '');
    setApiKey(connector.apiKeyConfig?.apiKey || '');
    setUsername(connector.basicAuthConfig?.username || '');
    setPassword(connector.basicAuthConfig?.password || '');
    setJwtToken(connector.jwtConfig?.jwtToken || '');

    // Database configs
    setDbType(connector.databaseConfig?.dbType || 'POSTGRES');
    setDbHost(connector.databaseConfig?.dbHost || '');
    setDbPort(connector.databaseConfig?.dbPort || '');
    setDbName(connector.databaseConfig?.dbName || '');
    setDbUsername(connector.databaseConfig?.dbUsername || '');
    setDbPassword(connector.databaseConfig?.dbPassword || '');
    setDbSsl(connector.databaseConfig?.dbSsl || false);
    setDbSchema(connector.databaseConfig?.dbSchema || '');

    // Cloud storage configs
    setCsProvider(connector.cloudStorageConfig?.csProvider || 'S3');
    setCsBucket(connector.cloudStorageConfig?.csBucket || '');
    setCsRegion(connector.cloudStorageConfig?.csRegion || '');
    setCsAccessKey(connector.cloudStorageConfig?.csAccessKey || '');
    setCsSecretKey(connector.cloudStorageConfig?.csSecretKey || '');
    setCsServiceAccountJson(connector.cloudStorageConfig?.csServiceAccountJson || '');
    setCsPrefix(connector.cloudStorageConfig?.csPrefix || '');

    // File system configs
    setFsRootPath(connector.fileSystemConfig?.fsRootPath || '');
    setFsRemoteType(connector.fileSystemConfig?.fsRemoteType || 'NONE');
    setFsHost(connector.fileSystemConfig?.fsHost || '');
    setFsPort(connector.fileSystemConfig?.fsPort || '');
    setFsUsername(connector.fileSystemConfig?.fsUsername || '');
    setFsPassword(connector.fileSystemConfig?.fsPassword || '');
    setFsRead(connector.fileSystemConfig?.fsRead ?? true);
    setFsWrite(connector.fileSystemConfig?.fsWrite ?? true);

    // Messaging app configs
    setMsgAppProvider(connector.messagingAppConfig?.provider || 'WHATSAPP');
    setMsgAppToken(connector.messagingAppConfig?.token || '');
    setMsgAppPhoneId(connector.messagingAppConfig?.phoneId || '');
    setMsgAppAllowImages(connector.messagingAppConfig?.allowImages ?? true);
    setMsgAppAllowDocs(connector.messagingAppConfig?.allowDocs ?? true);
    setMsgAppBucketPath(connector.messagingAppConfig?.bucketPath || 's3://whatsapp-telegram-media/');

    setEditOpen(true);
  };

  const handleSaveEdit = () => {
    if (!editingConnector) return;

    const updatedConnector = {
      ...editingConnector,
      name,
      type,
      description,
      icon: type === 'DATABASE' ? '🐘' : type === 'CLOUD_STORAGE' ? '📦' : type === 'FILE_SYSTEM' ? '📁' : type === 'MESSAGING_APP' ? (msgAppProvider === 'WHATSAPP' ? '💬' : '✈️') : '🔗',
      color: type === 'DATABASE' ? '#336791' : type === 'CLOUD_STORAGE' ? '#FF9900' : type === 'FILE_SYSTEM' ? '#10B981' : type === 'MESSAGING_APP' ? (msgAppProvider === 'WHATSAPP' ? '#25D366' : '#0088cc') : brand.accent,
      hostUrl: type === 'DATABASE' ? dbHost : type === 'FILE_SYSTEM' ? fsRootPath : type === 'MESSAGING_APP' ? (msgAppProvider === 'WHATSAPP' ? 'graph.facebook.com' : 'api.telegram.org') : hostUrl,
      authMethod,
      oauthConfig: type === 'REST_API' && authMethod === 'OAUTH2' ? {
        clientId,
        clientSecret,
        tokenUrl,
        authUrl,
        redirectUrl,
        scopes,
      } : undefined,
      apiKeyConfig: type === 'REST_API' && authMethod === 'API_KEY' ? {
        apiKey,
      } : undefined,
      basicAuthConfig: type === 'REST_API' && authMethod === 'BASIC' ? {
        username,
        password,
      } : undefined,
      jwtConfig: type === 'REST_API' && authMethod === 'JWT' ? {
        jwtToken,
      } : undefined,
      databaseConfig: type === 'DATABASE' ? {
        dbType,
        dbHost,
        dbPort,
        dbName,
        dbUsername,
        dbPassword,
        dbSsl,
        dbSchema,
      } : undefined,
      cloudStorageConfig: type === 'CLOUD_STORAGE' ? {
        csProvider,
        csBucket,
        csRegion,
        csAccessKey,
        csSecretKey,
        csServiceAccountJson,
        csPrefix,
      } : undefined,
      fileSystemConfig: type === 'FILE_SYSTEM' ? {
        fsRootPath,
        fsRemoteType,
        fsHost,
        fsPort,
        fsUsername,
        fsPassword,
        fsRead,
        fsWrite,
      } : undefined,
      messagingAppConfig: type === 'MESSAGING_APP' ? {
        provider: msgAppProvider,
        token: msgAppToken,
        phoneId: msgAppPhoneId,
        allowImages: msgAppAllowImages,
        allowDocs: msgAppAllowDocs,
        bucketPath: msgAppBucketPath,
      } : undefined,
    };

    const updatedList = connectorsList.map((c) => c.id === editingConnector.id ? updatedConnector : c);
    setConnectorsList(updatedList);
    localStorage.setItem('df_connectors', JSON.stringify(updatedList));
    setEditOpen(false);
    setEditingConnector(null);
    showToast(`Connector "${name}" updated successfully.`, 'success');
  };

  const getInterfaceCount = (connectorName: string) => {
    try {
      const localInterfaces = JSON.parse(localStorage.getItem('df_interfaces') || '[]');
      return localInterfaces.filter((i: any) => i.connector === connectorName).length;
    } catch (e) {
      return 0;
    }
  };

  const handleTestConnection = (connectorName: string) => {
    showToast(`Testing connection to ${connectorName}... Success!`, 'success');
  };

  const handleDelete = (id: string, connectorName: string) => {
    const updated = connectorsList.filter((c) => c.id !== id);
    setConnectorsList(updated);
    localStorage.setItem('df_connectors', JSON.stringify(updated));
    showToast(`Connector "${connectorName}" deleted.`, 'info');
  };

  const showToast = (msg: string, severity: 'success' | 'error' | 'info') => {
    setToastMsg(msg);
    setToastSeverity(severity);
    setToastOpen(true);
  };

  const filtered = connectorsList.filter(
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
        {filtered.length === 0 ? (
          <Grid size={12}>
            <Card sx={{ p: 4, textAlign: 'center', border: '1px dashed', borderColor: 'divider' }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                No active connectors configured. Click "Add Connector" to configure your first data node.
              </Typography>
            </Card>
          </Grid>
        ) : (
          filtered.map((connector) => (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={connector.id}>
              <Card
                sx={{
                  height: '100%',
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '4px',
                    height: '100%',
                    bgcolor: connector.color,
                  },
                }}
              >
                <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Avatar
                      sx={{
                        bgcolor: alpha(connector.color, 0.1),
                        color: connector.color,
                        fontSize: '1.25rem',
                        fontWeight: 700,
                        width: 44,
                        height: 44,
                        borderRadius: '12px',
                      }}
                    >
                      {connector.icon}
                    </Avatar>
                    <Chip
                      label={connector.status}
                      size="small"
                      sx={{
                        fontWeight: 700,
                        fontSize: '0.65rem',
                        bgcolor: alpha(brand.success, 0.1),
                        color: brand.success,
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
                    <Chip label={`${getInterfaceCount(connector.name)} interfaces`} size="small" variant="outlined" sx={{ fontSize: '0.65rem', height: 22 }} />
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                      Tested: {connector.lastTested}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <Tooltip title="Test Connection">
                        <IconButton size="small" onClick={() => handleTestConnection(connector.name)}>
                          <PlayArrowOutlined fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit Connection">
                        <IconButton size="small" onClick={() => handleOpenEdit(connector)}>
                          <SettingsOutlined fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton size="small" sx={{ color: 'error.main' }} onClick={() => handleDelete(connector.id, connector.name)}>
                          <DeleteOutlined fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      {/* Add Connector Dialog */}
      <Dialog open={createOpen} onClose={() => setCreateOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Add New Connector</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Grid container spacing={2} sx={{ mt: 0 }}>
            <Grid size={12}>
              <TextField
                fullWidth
                label="Connector Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Grid>
            <Grid size={6}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  label="Type"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <MenuItem value="REST_API">REST API</MenuItem>
                  <MenuItem value="DATABASE">Database</MenuItem>
                  <MenuItem value="CLOUD_STORAGE">Cloud Storage</MenuItem>
                  <MenuItem value="ENTERPRISE_APP">Enterprise App</MenuItem>
                  <MenuItem value="FILE_SYSTEM">File System</MenuItem>
                  <MenuItem value="MESSAGING_APP">Messaging App (WhatsApp/Telegram)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {(type === 'REST_API' || type === 'ENTERPRISE_APP') && (
              <Grid size={6}>
                <FormControl fullWidth>
                  <InputLabel>Auth Method</InputLabel>
                  <Select
                    label="Auth Method"
                    value={authMethod}
                    onChange={(e) => setAuthMethod(e.target.value)}
                  >
                    <MenuItem value="OAUTH2">OAuth 2.0</MenuItem>
                    <MenuItem value="API_KEY">API Key</MenuItem>
                    <MenuItem value="BASIC">Basic Auth</MenuItem>
                    <MenuItem value="JWT">JWT</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            )}

            {(type === 'REST_API' || type === 'ENTERPRISE_APP') && (
              <Grid size={12}>
                <TextField
                  fullWidth
                  label="Host / URL"
                  placeholder="https://api.example.com"
                  value={hostUrl}
                  onChange={(e) => setHostUrl(e.target.value)}
                />
              </Grid>
            )}

            {/* Database Specific Inputs */}
            {type === 'DATABASE' && (
              <>
                <Grid size={6}>
                  <FormControl fullWidth>
                    <InputLabel>Database Type</InputLabel>
                    <Select
                      label="Database Type"
                      value={dbType}
                      onChange={(e) => setDbType(e.target.value)}
                    >
                      <MenuItem value="POSTGRES">PostgreSQL</MenuItem>
                      <MenuItem value="MYSQL">MySQL</MenuItem>
                      <MenuItem value="ORACLE">Oracle DB</MenuItem>
                      <MenuItem value="MSSQL">SQL Server</MenuItem>
                      <MenuItem value="SNOWFLAKE">Snowflake</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={6}>
                  <TextField
                    fullWidth
                    label="Host"
                    placeholder="localhost or db.example.com"
                    value={dbHost}
                    onChange={(e) => setDbHost(e.target.value)}
                  />
                </Grid>
                <Grid size={6}>
                  <TextField
                    fullWidth
                    label="Port"
                    placeholder="e.g. 5432"
                    value={dbPort}
                    onChange={(e) => setDbPort(e.target.value)}
                  />
                </Grid>
                <Grid size={6}>
                  <TextField
                    fullWidth
                    label="Database Name"
                    placeholder="e.g. production_db"
                    value={dbName}
                    onChange={(e) => setDbName(e.target.value)}
                  />
                </Grid>
                <Grid size={6}>
                  <TextField
                    fullWidth
                    label="Username"
                    placeholder="Database Username"
                    value={dbUsername}
                    onChange={(e) => setDbUsername(e.target.value)}
                  />
                </Grid>
                <Grid size={6}>
                  <TextField
                    fullWidth
                    type="password"
                    label="Password"
                    placeholder="Database Password"
                    value={dbPassword}
                    onChange={(e) => setDbPassword(e.target.value)}
                  />
                </Grid>
                <Grid size={6}>
                  <TextField
                    fullWidth
                    label="Schema (Optional)"
                    placeholder="e.g. public"
                    value={dbSchema}
                    onChange={(e) => setDbSchema(e.target.value)}
                  />
                </Grid>
                <Grid size={6} sx={{ display: 'flex', alignItems: 'center' }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={dbSsl}
                        onChange={(e) => setDbSsl(e.target.checked)}
                      />
                    }
                    label="Enable SSL"
                  />
                </Grid>
              </>
            )}

            {/* Cloud Storage Specific Inputs */}
            {type === 'CLOUD_STORAGE' && (
              <>
                <Grid size={6}>
                  <FormControl fullWidth>
                    <InputLabel>Provider</InputLabel>
                    <Select
                      label="Provider"
                      value={csProvider}
                      onChange={(e) => setCsProvider(e.target.value)}
                    >
                      <MenuItem value="S3">Amazon AWS S3</MenuItem>
                      <MenuItem value="GCS">Google Cloud Storage (GCS)</MenuItem>
                      <MenuItem value="AZURE">Azure Blob Storage</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={6}>
                  <TextField
                    fullWidth
                    label="Bucket / Container Name"
                    placeholder="e.g. my-ingestion-bucket"
                    value={csBucket}
                    onChange={(e) => setCsBucket(e.target.value)}
                  />
                </Grid>
                <Grid size={6}>
                  <TextField
                    fullWidth
                    label="Region"
                    placeholder="e.g. us-east-1"
                    value={csRegion}
                    onChange={(e) => setCsRegion(e.target.value)}
                  />
                </Grid>
                <Grid size={6}>
                  <TextField
                    fullWidth
                    label="Path Prefix (Optional)"
                    placeholder="e.g. imports/daily/"
                    value={csPrefix}
                    onChange={(e) => setCsPrefix(e.target.value)}
                  />
                </Grid>
                {csProvider === 'GCS' ? (
                  <Grid size={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      label="Service Account JSON"
                      placeholder="Paste google credentials JSON block here..."
                      value={csServiceAccountJson}
                      onChange={(e) => setCsServiceAccountJson(e.target.value)}
                    />
                  </Grid>
                ) : (
                  <>
                    <Grid size={6}>
                      <TextField
                        fullWidth
                        label="Access Key ID"
                        placeholder="Access Key"
                        value={csAccessKey}
                        onChange={(e) => setCsAccessKey(e.target.value)}
                      />
                    </Grid>
                    <Grid size={6}>
                      <TextField
                        fullWidth
                        type="password"
                        label="Secret Access Key"
                        placeholder="Secret Key"
                        value={csSecretKey}
                        onChange={(e) => setCsSecretKey(e.target.value)}
                      />
                    </Grid>
                  </>
                )}
              </>
            )}

            {/* File System Specific Inputs */}
            {type === 'FILE_SYSTEM' && (
              <>
                <Grid size={12}>
                  <TextField
                    fullWidth
                    label="Root Path / Mount Point"
                    placeholder="e.g. /var/data/ingestion-nodes"
                    value={fsRootPath}
                    onChange={(e) => setFsRootPath(e.target.value)}
                  />
                </Grid>
                <Grid size={6}>
                  <FormControl fullWidth>
                    <InputLabel>Remote Connection Type</InputLabel>
                    <Select
                      label="Remote Connection Type"
                      value={fsRemoteType}
                      onChange={(e) => setFsRemoteType(e.target.value)}
                    >
                      <MenuItem value="NONE">Local Directory (No Mount)</MenuItem>
                      <MenuItem value="SFTP">SFTP Connection</MenuItem>
                      <MenuItem value="SSH">SSH Connection</MenuItem>
                      <MenuItem value="SMB">SMB/Samba Share</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={6} sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
                  <FormControlLabel
                    control={<Checkbox checked={fsRead} onChange={(e) => setFsRead(e.target.checked)} />}
                    label="Read"
                  />
                  <FormControlLabel
                    control={<Checkbox checked={fsWrite} onChange={(e) => setFsWrite(e.target.checked)} />}
                    label="Write"
                  />
                </Grid>
                {fsRemoteType !== 'NONE' && (
                  <>
                    <Grid size={6}>
                      <TextField
                        fullWidth
                        label="Remote Host"
                        placeholder="sftp.example.com"
                        value={fsHost}
                        onChange={(e) => setFsHost(e.target.value)}
                      />
                    </Grid>
                    <Grid size={6}>
                      <TextField
                        fullWidth
                        label="Remote Port"
                        placeholder="e.g. 22"
                        value={fsPort}
                        onChange={(e) => setFsPort(e.target.value)}
                      />
                    </Grid>
                    <Grid size={6}>
                      <TextField
                        fullWidth
                        label="Username"
                        placeholder="Remote Username"
                        value={fsUsername}
                        onChange={(e) => setFsUsername(e.target.value)}
                      />
                    </Grid>
                    <Grid size={6}>
                      <TextField
                        fullWidth
                        type="password"
                        label="Password / Private Key"
                        placeholder="Remote Password"
                        value={fsPassword}
                        onChange={(e) => setFsPassword(e.target.value)}
                      />
                    </Grid>
                  </>
                )}
              </>
            )}

            {/* Messaging App Specific Inputs */}
            {type === 'MESSAGING_APP' && (
              <>
                <Grid size={6}>
                  <FormControl fullWidth>
                    <InputLabel>Messaging Platform</InputLabel>
                    <Select
                      label="Messaging Platform"
                      value={msgAppProvider}
                      onChange={(e) => setMsgAppProvider(e.target.value)}
                    >
                      <MenuItem value="WHATSAPP">WhatsApp Business Cloud API</MenuItem>
                      <MenuItem value="TELEGRAM">Telegram Bot API</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={6}>
                  <TextField
                    fullWidth
                    label={msgAppProvider === 'WHATSAPP' ? 'Phone Number ID' : 'Telegram Chat ID'}
                    placeholder={msgAppProvider === 'WHATSAPP' ? 'e.g. 10843219432' : 'e.g. -100432943284'}
                    value={msgAppPhoneId}
                    onChange={(e) => setMsgAppPhoneId(e.target.value)}
                  />
                </Grid>
                <Grid size={12}>
                  <TextField
                    fullWidth
                    type="password"
                    label={msgAppProvider === 'WHATSAPP' ? 'Access Token / System Token' : 'Bot Authentication Token'}
                    placeholder="Enter confidential token"
                    value={msgAppToken}
                    onChange={(e) => setMsgAppToken(e.target.value)}
                  />
                </Grid>
                <Grid size={12}>
                  <TextField
                    fullWidth
                    label="Media Storage Cloud Bucket Path"
                    placeholder="e.g. s3://whatsapp-telegram-media/shared/"
                    value={msgAppBucketPath}
                    onChange={(e) => setMsgAppBucketPath(e.target.value)}
                  />
                </Grid>
                <Grid size={12} sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <FormControlLabel
                    control={<Checkbox checked={msgAppAllowImages} onChange={(e) => setMsgAppAllowImages(e.target.checked)} />}
                    label="Allow Image Storage"
                  />
                  <FormControlLabel
                    control={<Checkbox checked={msgAppAllowDocs} onChange={(e) => setMsgAppAllowDocs(e.target.checked)} />}
                    label="Allow Document Storage"
                  />
                </Grid>
              </>
            )}

            {/* OAuth 2.0 Conditionally Rendered Sub-inputs */}
            {(type === 'REST_API' || type === 'ENTERPRISE_APP') && authMethod === 'OAUTH2' && (
              <>
                <Grid size={6}>
                  <TextField
                    fullWidth
                    label="Client ID"
                    placeholder="Enter Client ID"
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                  />
                </Grid>
                <Grid size={6}>
                  <TextField
                    fullWidth
                    type="password"
                    label="Client Secret"
                    placeholder="Enter Client Secret"
                    value={clientSecret}
                    onChange={(e) => setClientSecret(e.target.value)}
                  />
                </Grid>
                <Grid size={6}>
                  <TextField
                    fullWidth
                    label="Authorization Endpoint URL"
                    placeholder="https://auth.example.com/oauth/authorize"
                    value={authUrl}
                    onChange={(e) => setAuthUrl(e.target.value)}
                  />
                </Grid>
                <Grid size={6}>
                  <TextField
                    fullWidth
                    label="Token Endpoint URL"
                    placeholder="https://auth.example.com/oauth/token"
                    value={tokenUrl}
                    onChange={(e) => setTokenUrl(e.target.value)}
                  />
                </Grid>
                <Grid size={6}>
                  <TextField
                    fullWidth
                    label="Redirect / Callback URL"
                    placeholder="http://localhost:5180/oauth/callback"
                    value={redirectUrl}
                    onChange={(e) => setRedirectUrl(e.target.value)}
                  />
                </Grid>
                <Grid size={6}>
                  <TextField
                    fullWidth
                    label="Scopes"
                    placeholder="read write email offline_access"
                    value={scopes}
                    onChange={(e) => setScopes(e.target.value)}
                  />
                </Grid>
              </>
            )}

            {/* API Key Conditionally Rendered Sub-inputs */}
            {(type === 'REST_API' || type === 'ENTERPRISE_APP') && authMethod === 'API_KEY' && (
              <Grid size={12}>
                <TextField
                  fullWidth
                  type="password"
                  label="API Key"
                  placeholder="Enter your confidential API Key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
              </Grid>
            )}

            {/* Basic Auth Conditionally Rendered Sub-inputs */}
            {(type === 'REST_API' || type === 'ENTERPRISE_APP') && authMethod === 'BASIC' && (
              <>
                <Grid size={6}>
                  <TextField
                    fullWidth
                    label="Username"
                    placeholder="Enter Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </Grid>
                <Grid size={6}>
                  <TextField
                    fullWidth
                    type="password"
                    label="Password"
                    placeholder="Enter Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Grid>
              </>
            )}

            {/* JWT Token Conditionally Rendered Sub-inputs */}
            {(type === 'REST_API' || type === 'ENTERPRISE_APP') && authMethod === 'JWT' && (
              <Grid size={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  label="JWT Token"
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  value={jwtToken}
                  onChange={(e) => setJwtToken(e.target.value)}
                />
              </Grid>
            )}
            <Grid size={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setCreateOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreate}>
            Add Connector
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Connector Dialog */}
      <Dialog open={editOpen} onClose={() => { setEditOpen(false); setEditingConnector(null); }} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Edit Connector: {editingConnector?.name}</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Grid container spacing={2} sx={{ mt: 0 }}>
            <Grid size={12}>
              <TextField
                fullWidth
                label="Connector Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Grid>
            <Grid size={6}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  label="Type"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <MenuItem value="REST_API">REST API</MenuItem>
                  <MenuItem value="DATABASE">Database</MenuItem>
                  <MenuItem value="CLOUD_STORAGE">Cloud Storage</MenuItem>
                  <MenuItem value="ENTERPRISE_APP">Enterprise App</MenuItem>
                  <MenuItem value="FILE_SYSTEM">File System</MenuItem>
                  <MenuItem value="MESSAGING_APP">Messaging App (WhatsApp/Telegram)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {(type === 'REST_API' || type === 'ENTERPRISE_APP') && (
              <Grid size={6}>
                <FormControl fullWidth>
                  <InputLabel>Auth Method</InputLabel>
                  <Select
                    label="Auth Method"
                    value={authMethod}
                    onChange={(e) => setAuthMethod(e.target.value)}
                  >
                    <MenuItem value="OAUTH2">OAuth 2.0</MenuItem>
                    <MenuItem value="API_KEY">API Key</MenuItem>
                    <MenuItem value="BASIC">Basic Auth</MenuItem>
                    <MenuItem value="JWT">JWT</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            )}

            {(type === 'REST_API' || type === 'ENTERPRISE_APP') && (
              <Grid size={12}>
                <TextField
                  fullWidth
                  label="Target Host API Endpoint URL"
                  placeholder="https://api.example.com/v1"
                  value={hostUrl}
                  onChange={(e) => setHostUrl(e.target.value)}
                />
              </Grid>
            )}

            {/* Database Specific Inputs */}
            {type === 'DATABASE' && (
              <>
                <Grid size={6}>
                  <FormControl fullWidth>
                    <InputLabel>Database Type</InputLabel>
                    <Select
                      label="Database Type"
                      value={dbType}
                      onChange={(e) => setDbType(e.target.value)}
                    >
                      <MenuItem value="POSTGRES">PostgreSQL</MenuItem>
                      <MenuItem value="MYSQL">MySQL</MenuItem>
                      <MenuItem value="ORACLE">Oracle DB</MenuItem>
                      <MenuItem value="MSSQL">SQL Server</MenuItem>
                      <MenuItem value="SNOWFLAKE">Snowflake</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={6}>
                  <TextField
                    fullWidth
                    label="Host Server / IP"
                    placeholder="db.example.com"
                    value={dbHost}
                    onChange={(e) => setDbHost(e.target.value)}
                  />
                </Grid>
                <Grid size={4}>
                  <TextField
                    fullWidth
                    label="Port"
                    placeholder="e.g. 5432"
                    value={dbPort}
                    onChange={(e) => setDbPort(e.target.value)}
                  />
                </Grid>
                <Grid size={8}>
                  <TextField
                    fullWidth
                    label="Database / Instance Name"
                    placeholder="production_db"
                    value={dbName}
                    onChange={(e) => setDbName(e.target.value)}
                  />
                </Grid>
                <Grid size={6}>
                  <TextField
                    fullWidth
                    label="Username"
                    placeholder="DB Username"
                    value={dbUsername}
                    onChange={(e) => setDbUsername(e.target.value)}
                  />
                </Grid>
                <Grid size={6}>
                  <TextField
                    fullWidth
                    type="password"
                    label="Password"
                    placeholder="DB Password"
                    value={dbPassword}
                    onChange={(e) => setDbPassword(e.target.value)}
                  />
                </Grid>
                <Grid size={6}>
                  <TextField
                    fullWidth
                    label="Default Schema"
                    placeholder="public"
                    value={dbSchema}
                    onChange={(e) => setDbSchema(e.target.value)}
                  />
                </Grid>
                <Grid size={6} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FormControlLabel
                    control={<Checkbox checked={dbSsl} onChange={(e) => setDbSsl(e.target.checked)} />}
                    label="Enable SSL Secure Connection"
                  />
                </Grid>
              </>
            )}

            {/* Cloud Storage Specific Inputs */}
            {type === 'CLOUD_STORAGE' && (
              <>
                <Grid size={6}>
                  <FormControl fullWidth>
                    <InputLabel>Provider</InputLabel>
                    <Select
                      label="Provider"
                      value={csProvider}
                      onChange={(e) => setCsProvider(e.target.value)}
                    >
                      <MenuItem value="S3">Amazon AWS S3</MenuItem>
                      <MenuItem value="GCS">Google Cloud Storage (GCS)</MenuItem>
                      <MenuItem value="AZURE">Azure Blob Storage</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={6}>
                  <TextField
                    fullWidth
                    label="Bucket Name / Container"
                    placeholder="fluxo-storage-bucket"
                    value={csBucket}
                    onChange={(e) => setCsBucket(e.target.value)}
                  />
                </Grid>
                <Grid size={6}>
                  <TextField
                    fullWidth
                    label="Region Endpoint"
                    placeholder="us-east-1"
                    value={csRegion}
                    onChange={(e) => setCsRegion(e.target.value)}
                  />
                </Grid>
                <Grid size={6}>
                  <TextField
                    fullWidth
                    label="Folder Prefix / Path (Optional)"
                    placeholder="e.g. data/ingests/"
                    value={csPrefix}
                    onChange={(e) => setCsPrefix(e.target.value)}
                  />
                </Grid>
                {csProvider === 'S3' && (
                  <>
                    <Grid size={6}>
                      <TextField
                        fullWidth
                        label="AWS Access Key ID"
                        placeholder="AKIAIOSFODNN7EXAMPLE"
                        value={csAccessKey}
                        onChange={(e) => setCsAccessKey(e.target.value)}
                      />
                    </Grid>
                    <Grid size={6}>
                      <TextField
                        fullWidth
                        type="password"
                        label="AWS Secret Access Key"
                        placeholder="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
                        value={csSecretKey}
                        onChange={(e) => setCsSecretKey(e.target.value)}
                      />
                    </Grid>
                  </>
                )}
                {csProvider === 'GCS' && (
                  <Grid size={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      label="Google Cloud Service Account JSON Key"
                      placeholder='{ "type": "service_account", ... }'
                      value={csServiceAccountJson}
                      onChange={(e) => setCsServiceAccountJson(e.target.value)}
                    />
                  </Grid>
                )}
              </>
            )}

            {/* File System Specific Inputs */}
            {type === 'FILE_SYSTEM' && (
              <>
                <Grid size={12}>
                  <TextField
                    fullWidth
                    label="Root Path / Mount Point"
                    placeholder="e.g. /var/data/ingestion-nodes"
                    value={fsRootPath}
                    onChange={(e) => setFsRootPath(e.target.value)}
                  />
                </Grid>
                <Grid size={6}>
                  <FormControl fullWidth>
                    <InputLabel>Remote Connection Type</InputLabel>
                    <Select
                      label="Remote Connection Type"
                      value={fsRemoteType}
                      onChange={(e) => setFsRemoteType(e.target.value)}
                    >
                      <MenuItem value="NONE">Local Directory (No Mount)</MenuItem>
                      <MenuItem value="SFTP">SFTP Connection</MenuItem>
                      <MenuItem value="SSH">SSH Connection</MenuItem>
                      <MenuItem value="SMB">SMB/Samba Share</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={6} sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
                  <FormControlLabel
                    control={<Checkbox checked={fsRead} onChange={(e) => setFsRead(e.target.checked)} />}
                    label="Read"
                  />
                  <FormControlLabel
                    control={<Checkbox checked={fsWrite} onChange={(e) => setFsWrite(e.target.checked)} />}
                    label="Write"
                  />
                </Grid>
                {fsRemoteType !== 'NONE' && (
                  <>
                    <Grid size={6}>
                      <TextField
                        fullWidth
                        label="Remote Host"
                        placeholder="sftp.example.com"
                        value={fsHost}
                        onChange={(e) => setFsHost(e.target.value)}
                      />
                    </Grid>
                    <Grid size={6}>
                      <TextField
                        fullWidth
                        label="Remote Port"
                        placeholder="e.g. 22"
                        value={fsPort}
                        onChange={(e) => setFsPort(e.target.value)}
                      />
                    </Grid>
                    <Grid size={6}>
                      <TextField
                        fullWidth
                        label="Username"
                        placeholder="Remote Username"
                        value={fsUsername}
                        onChange={(e) => setFsUsername(e.target.value)}
                      />
                    </Grid>
                    <Grid size={6}>
                      <TextField
                        fullWidth
                        type="password"
                        label="Password / Private Key"
                        placeholder="Remote Password"
                        value={fsPassword}
                        onChange={(e) => setFsPassword(e.target.value)}
                      />
                    </Grid>
                  </>
                )}
              </>
            )}

            {/* Messaging App Specific Inputs */}
            {type === 'MESSAGING_APP' && (
              <>
                <Grid size={6}>
                  <FormControl fullWidth>
                    <InputLabel>Messaging Platform</InputLabel>
                    <Select
                      label="Messaging Platform"
                      value={msgAppProvider}
                      onChange={(e) => setMsgAppProvider(e.target.value)}
                    >
                      <MenuItem value="WHATSAPP">WhatsApp Business Cloud API</MenuItem>
                      <MenuItem value="TELEGRAM">Telegram Bot API</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={6}>
                  <TextField
                    fullWidth
                    label={msgAppProvider === 'WHATSAPP' ? 'Phone Number ID' : 'Telegram Chat ID'}
                    placeholder={msgAppProvider === 'WHATSAPP' ? 'e.g. 10843219432' : 'e.g. -100432943284'}
                    value={msgAppPhoneId}
                    onChange={(e) => setMsgAppPhoneId(e.target.value)}
                  />
                </Grid>
                <Grid size={12}>
                  <TextField
                    fullWidth
                    type="password"
                    label={msgAppProvider === 'WHATSAPP' ? 'Access Token / System Token' : 'Bot Authentication Token'}
                    placeholder="Enter confidential token"
                    value={msgAppToken}
                    onChange={(e) => setMsgAppToken(e.target.value)}
                  />
                </Grid>
                <Grid size={12}>
                  <TextField
                    fullWidth
                    label="Media Storage Cloud Bucket Path"
                    placeholder="e.g. s3://whatsapp-telegram-media/shared/"
                    value={msgAppBucketPath}
                    onChange={(e) => setMsgAppBucketPath(e.target.value)}
                  />
                </Grid>
                <Grid size={12} sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <FormControlLabel
                    control={<Checkbox checked={msgAppAllowImages} onChange={(e) => setMsgAppAllowImages(e.target.checked)} />}
                    label="Allow Image Storage"
                  />
                  <FormControlLabel
                    control={<Checkbox checked={msgAppAllowDocs} onChange={(e) => setMsgAppAllowDocs(e.target.checked)} />}
                    label="Allow Document Storage"
                  />
                </Grid>
              </>
            )}

            {/* OAuth 2.0 Conditionally Rendered Sub-inputs */}
            {(type === 'REST_API' || type === 'ENTERPRISE_APP') && authMethod === 'OAUTH2' && (
              <>
                <Grid size={6}>
                  <TextField
                    fullWidth
                    label="Client ID"
                    placeholder="Enter Client ID"
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                  />
                </Grid>
                <Grid size={6}>
                  <TextField
                    fullWidth
                    type="password"
                    label="Client Secret"
                    placeholder="Enter Client Secret"
                    value={clientSecret}
                    onChange={(e) => setClientSecret(e.target.value)}
                  />
                </Grid>
                <Grid size={6}>
                  <TextField
                    fullWidth
                    label="Authorization Endpoint URL"
                    placeholder="https://auth.example.com/oauth/authorize"
                    value={authUrl}
                    onChange={(e) => setAuthUrl(e.target.value)}
                  />
                </Grid>
                <Grid size={6}>
                  <TextField
                    fullWidth
                    label="Token Endpoint URL"
                    placeholder="https://auth.example.com/oauth/token"
                    value={tokenUrl}
                    onChange={(e) => setTokenUrl(e.target.value)}
                  />
                </Grid>
                <Grid size={6}>
                  <TextField
                    fullWidth
                    label="Redirect / Callback URL"
                    placeholder="http://localhost:5180/oauth/callback"
                    value={redirectUrl}
                    onChange={(e) => setRedirectUrl(e.target.value)}
                  />
                </Grid>
                <Grid size={6}>
                  <TextField
                    fullWidth
                    label="Scopes"
                    placeholder="read write email offline_access"
                    value={scopes}
                    onChange={(e) => setScopes(e.target.value)}
                  />
                </Grid>
              </>
            )}

            {/* API Key Conditionally Rendered Sub-inputs */}
            {(type === 'REST_API' || type === 'ENTERPRISE_APP') && authMethod === 'API_KEY' && (
              <Grid size={12}>
                <TextField
                  fullWidth
                  type="password"
                  label="API Key"
                  placeholder="Enter your confidential API Key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
              </Grid>
            )}

            {/* Basic Auth Conditionally Rendered Sub-inputs */}
            {(type === 'REST_API' || type === 'ENTERPRISE_APP') && authMethod === 'BASIC' && (
              <>
                <Grid size={6}>
                  <TextField
                    fullWidth
                    label="Username"
                    placeholder="Enter Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </Grid>
                <Grid size={6}>
                  <TextField
                    fullWidth
                    type="password"
                    label="Password"
                    placeholder="Enter Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Grid>
              </>
            )}

            {/* JWT Token Conditionally Rendered Sub-inputs */}
            {(type === 'REST_API' || type === 'ENTERPRISE_APP') && authMethod === 'JWT' && (
              <Grid size={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  label="JWT Token"
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  value={jwtToken}
                  onChange={(e) => setJwtToken(e.target.value)}
                />
              </Grid>
            )}
            <Grid size={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => { setEditOpen(false); setEditingConnector(null); }}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveEdit}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={toastOpen}
        autoHideDuration={4000}
        onClose={() => setToastOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setToastOpen(false)} severity={toastSeverity} sx={{ width: '100%' }}>
          {toastMsg}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ConnectorsPage;
