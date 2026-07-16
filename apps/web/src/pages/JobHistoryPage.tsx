// ============================================================================
// DataFusion AI — Job History Page
// Filterable job execution history with detail view
// ============================================================================

import React, { useState } from 'react';
import {
  Box,
  Typography,
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  LinearProgress,
  Grid,
  Divider,
  alpha,
  Drawer,
} from '@mui/material';
import {
  SearchOutlined,
  FilterListOutlined,
  RefreshOutlined,
  DownloadOutlined,
  ReplayOutlined,
  VisibilityOutlined,
  CancelOutlined,
  CloseOutlined,
  CheckCircleOutlined,
  ErrorOutlined,
  PlayArrowOutlined,
  ScheduleOutlined,
  PendingOutlined,
  AutoAwesomeOutlined,
} from '@mui/icons-material';
import { brand } from '../theme/theme';

const jobs = [
  {
    id: 'JOB-1284',
    interface: 'Salesforce Contact Sync',
    workflow: 'CRM Pipeline',
    status: 'COMPLETED',
    trigger: 'SCHEDULED',
    recordsProcessed: 12450,
    recordsFailed: 0,
    duration: '2m 34s',
    startedAt: '2024-01-15 14:30:00',
    completedAt: '2024-01-15 14:32:34',
  },
  {
    id: 'JOB-1283',
    interface: 'SAP Invoice Import',
    workflow: 'Finance Pipeline',
    status: 'RUNNING',
    trigger: 'EVENT_BASED',
    recordsProcessed: 8231,
    recordsFailed: 0,
    duration: '1m 12s',
    startedAt: '2024-01-15 14:28:00',
    completedAt: null,
  },
  {
    id: 'JOB-1282',
    interface: 'CSV Upload Processing',
    workflow: 'Ad-hoc Import',
    status: 'COMPLETED',
    trigger: 'MANUAL',
    recordsProcessed: 5678,
    recordsFailed: 12,
    duration: '45s',
    startedAt: '2024-01-15 14:15:00',
    completedAt: '2024-01-15 14:15:45',
  },
  {
    id: 'JOB-1281',
    interface: 'API Data Extraction',
    workflow: 'REST Pipeline',
    status: 'FAILED',
    trigger: 'SCHEDULED',
    recordsProcessed: 0,
    recordsFailed: 0,
    duration: '12s',
    startedAt: '2024-01-15 14:08:00',
    completedAt: '2024-01-15 14:08:12',
  },
  {
    id: 'JOB-1280',
    interface: 'ServiceNow Ticket Export',
    workflow: 'ITSM Pipeline',
    status: 'COMPLETED',
    trigger: 'SCHEDULED',
    recordsProcessed: 3421,
    recordsFailed: 0,
    duration: '1m 5s',
    startedAt: '2024-01-15 14:00:00',
    completedAt: '2024-01-15 14:01:05',
  },
  {
    id: 'JOB-1279',
    interface: 'SharePoint Document Sync',
    workflow: 'Document Pipeline',
    status: 'CANCELLED',
    trigger: 'MANUAL',
    recordsProcessed: 230,
    recordsFailed: 0,
    duration: '18s',
    startedAt: '2024-01-15 13:45:00',
    completedAt: '2024-01-15 13:45:18',
  },
  {
    id: 'JOB-1278',
    interface: 'MongoDB Collection Mirror',
    workflow: 'NoSQL Pipeline',
    status: 'PENDING',
    trigger: 'SCHEDULED',
    recordsProcessed: 0,
    recordsFailed: 0,
    duration: '-',
    startedAt: null,
    completedAt: null,
  },
  {
    id: 'JOB-1277',
    interface: 'Azure Blob Data Ingest',
    workflow: 'Cloud Pipeline',
    status: 'COMPLETED',
    trigger: 'REAL_TIME',
    recordsProcessed: 89432,
    recordsFailed: 3,
    duration: '4m 22s',
    startedAt: '2024-01-15 13:30:00',
    completedAt: '2024-01-15 13:34:22',
  },
];

const statusConfig: Record<string, { color: string; icon: React.ReactElement }> = {
  COMPLETED: { color: brand.success, icon: <CheckCircleOutlined sx={{ fontSize: 16 }} /> },
  RUNNING: { color: brand.info, icon: <PlayArrowOutlined sx={{ fontSize: 16 }} /> },
  FAILED: { color: brand.error, icon: <ErrorOutlined sx={{ fontSize: 16 }} /> },
  CANCELLED: { color: '#64748B', icon: <CancelOutlined sx={{ fontSize: 16 }} /> },
  PENDING: { color: brand.warning, icon: <PendingOutlined sx={{ fontSize: 16 }} /> },
  SCHEDULED: { color: brand.secondary, icon: <ScheduleOutlined sx={{ fontSize: 16 }} /> },
};

const JobHistoryPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [detailDrawer, setDetailDrawer] = useState<string | null>(null);

  const getNextScheduledTime = (job: any) => {
    if (job.trigger !== 'SCHEDULED') return '-';
    
    // Attempt to lookup interface schedule
    const localInterfaces = JSON.parse(localStorage.getItem('df_interfaces') || '[]');
    // Match by interface name
    const match = localInterfaces.find((i: any) => i.name === job.interface);
    const schedule = match?.schedule || 'Hourly'; // default to Hourly

    const now = new Date();
    if (schedule === 'Hourly') {
      now.setHours(now.getHours() + 1);
      now.setMinutes(0);
    } else if (schedule === 'Daily') {
      now.setDate(now.getDate() + 1);
      now.setHours(9);
      now.setMinutes(0);
    } else if (schedule === 'Weekly') {
      now.setDate(now.getDate() + 7);
      now.setHours(9);
      now.setMinutes(0);
    } else if (schedule === 'Monthly') {
      now.setMonth(now.getMonth() + 1);
      now.setDate(1);
      now.setHours(9);
      now.setMinutes(0);
    } else {
      now.setHours(now.getHours() + 1);
    }
    
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const hh = String(now.getHours()).padStart(2, '0');
    const MM = String(now.getMinutes()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd} ${hh}:${MM}`;
  };

  // Dynamic state hooks for live executions logs
  const [historyList, setHistoryList] = useState<any[]>([]);
  const [isLive, setIsLive] = useState(false);

  const fetchJobs = async () => {
    try {
      const response = await fetch(`http://${window.location.hostname}:3006/api/v1/jobs`, {
        headers: {
          'x-tenant-id': 'TEN-001',
        },
      });
      const resData = await response.json();
      if (response.ok && resData.success) {
        const rawJobs = resData.data || [];
        setHistoryList(rawJobs.map((j: any) => ({
          id: j.id,
          interface: j.interfaceId ? `Interface ${j.interfaceId.slice(0, 8)}` : 'API Pipeline Ingest',
          workflow: j.workflowId ? `Workflow ${j.workflowId.slice(0, 8)}` : 'Ad-hoc Execution',
          status: j.status || 'PENDING',
          trigger: 'MANUAL',
          recordsProcessed: j.recordsProcessed || 0,
          recordsFailed: j.recordsFailed || 0,
          duration: j.durationMs ? `${(j.durationMs / 1000).toFixed(1)}s` : '-',
          startedAt: j.startedAt ? new Date(j.startedAt).toLocaleString() : '-',
          completedAt: j.completedAt ? new Date(j.completedAt).toLocaleString() : null,
        })));
        setIsLive(true);
      } else {
        throw new Error('API failed');
      }
    } catch (err) {
      console.warn('Job Service API offline. Falling back to local storage session list.');
      const localJobs = JSON.parse(localStorage.getItem('df_jobs') || '[]');
      setHistoryList(localJobs);
      setIsLive(false);
    }
  };

  React.useEffect(() => {
    fetchJobs();
  }, []);

  const filtered = historyList.filter((j) => {
    const matchSearch =
      j.interface.toLowerCase().includes(search.toLowerCase()) ||
      j.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || j.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const selectedJob = historyList.find((j) => j.id === detailDrawer);

  return (
    <Box>
      {/* Page Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            Job History
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Monitor and manage integration job executions
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button variant="outlined" startIcon={<DownloadOutlined />}>Export Report</Button>
          <Button variant="outlined" startIcon={<RefreshOutlined />}>Refresh</Button>
        </Box>
      </Box>

      {/* Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Total Jobs', value: String(historyList.length), color: brand.primary },
          { label: 'Completed', value: String(historyList.filter(j => j.status === 'COMPLETED').length), color: brand.success },
          { label: 'Failed', value: String(historyList.filter(j => j.status === 'FAILED').length), color: brand.error },
          { label: 'Running', value: String(historyList.filter(j => j.status === 'RUNNING').length), color: brand.info },
          { 
            label: 'Success Rate', 
            value: historyList.length 
              ? `${((historyList.filter(j => j.status === 'COMPLETED').length / historyList.length) * 100).toFixed(1)}%` 
              : '100%', 
            color: brand.accent 
          },
          { label: 'Avg Duration', value: historyList.length ? '12s' : '-', color: brand.warning },
        ].map((stat) => (
          <Grid size={{ xs: 6, md: 2 }} key={stat.label}>
            <Card>
              <CardContent sx={{ p: 2, textAlign: 'center', '&:last-child': { pb: 2 } }}>
                <Typography variant="h5" sx={{ fontWeight: 800, color: stat.color }}>
                  {stat.value}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {stat.label}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Jobs Table */}
      <Card>
        <CardContent sx={{ p: 2.5 }}>
          <Box sx={{ display: 'flex', gap: 2, mb: 2.5 }}>
            <TextField
              size="small"
              placeholder="Search by job ID or interface name..."
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
            <FormControl size="small" sx={{ minWidth: 140 }}>
              <InputLabel>Status</InputLabel>
              <Select
                label="Status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="COMPLETED">Completed</MenuItem>
                <MenuItem value="RUNNING">Running</MenuItem>
                <MenuItem value="FAILED">Failed</MenuItem>
                <MenuItem value="PENDING">Pending</MenuItem>
                <MenuItem value="CANCELLED">Cancelled</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Job ID</TableCell>
                  <TableCell>Interface</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Trigger</TableCell>
                  <TableCell align="right">Processed</TableCell>
                  <TableCell align="right">Failed</TableCell>
                  <TableCell>Duration</TableCell>
                  <TableCell>Started</TableCell>
                  <TableCell>Next Scheduled Job</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.map((job) => {
                  const sc = statusConfig[job.status];
                  return (
                    <TableRow key={job.id} hover sx={{ cursor: 'pointer', '&:last-child td': { borderBottom: 0 } }}>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.82rem', fontFamily: 'monospace' }}>
                          {job.id}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                            {job.interface}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            {job.workflow}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={sc?.icon}
                          label={job.status}
                          size="small"
                          sx={{
                            fontWeight: 700,
                            fontSize: '0.68rem',
                            bgcolor: alpha(sc?.color || '#64748B', 0.1),
                            color: sc?.color || '#64748B',
                            '& .MuiChip-icon': { color: 'inherit' },
                          }}
                        />
                        {job.status === 'RUNNING' && (
                          <LinearProgress
                            sx={{
                              mt: 0.5,
                              height: 3,
                              borderRadius: 2,
                              bgcolor: alpha(brand.info, 0.1),
                              '& .MuiLinearProgress-bar': { bgcolor: brand.info },
                            }}
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption" sx={{ fontSize: '0.78rem' }}>
                          {job.trigger.replace(/_/g, ' ')}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                          {job.recordsProcessed.toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 600,
                            fontSize: '0.85rem',
                            color: job.recordsFailed > 0 ? brand.error : 'text.secondary',
                          }}
                        >
                          {job.recordsFailed.toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontSize: '0.85rem', fontFamily: 'monospace' }}>
                          {job.duration}
                        </Typography>
                      </TableCell>
                       <TableCell>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          {job.startedAt || '-'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontSize: '0.85rem', fontWeight: 500 }}>
                          {getNextScheduledTime(job)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
                          <Tooltip title="View Details">
                            <IconButton size="small" onClick={() => setDetailDrawer(job.id)}>
                              <VisibilityOutlined fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          {job.status === 'FAILED' && (
                            <>
                              <Tooltip title="Retry">
                                <IconButton size="small" sx={{ color: brand.warning }}>
                                  <ReplayOutlined fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="AI Troubleshoot">
                                <IconButton size="small" sx={{ color: brand.accent }}>
                                  <AutoAwesomeOutlined fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </>
                          )}
                          {job.status === 'RUNNING' && (
                            <Tooltip title="Cancel">
                              <IconButton size="small" sx={{ color: brand.error }}>
                                <CancelOutlined fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Job Detail Drawer */}
      <Drawer
        anchor="right"
        open={Boolean(detailDrawer)}
        onClose={() => setDetailDrawer(null)}
        sx={{
          '& .MuiDrawer-paper': {
            width: 480,
            borderLeft: '1px solid',
            borderColor: 'divider',
          },
        }}
      >
        {selectedJob && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2.5, borderBottom: '1px solid', borderColor: 'divider' }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>{selectedJob.id}</Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>{selectedJob.interface}</Typography>
              </Box>
              <IconButton onClick={() => setDetailDrawer(null)}>
                <CloseOutlined />
              </IconButton>
            </Box>
            <Box sx={{ p: 2.5 }}>
              <Grid container spacing={2}>
                {[
                  { label: 'Status', value: selectedJob.status },
                  { label: 'Trigger', value: selectedJob.trigger },
                  { label: 'Duration', value: selectedJob.duration },
                  { label: 'Processed', value: selectedJob.recordsProcessed.toLocaleString() },
                  { label: 'Failed', value: selectedJob.recordsFailed.toLocaleString() },
                  { label: 'Workflow', value: selectedJob.workflow },
                  { label: 'Started', value: selectedJob.startedAt || '-' },
                  { label: 'Completed', value: selectedJob.completedAt || '-' },
                ].map((field) => (
                  <Grid size={6} key={field.label}>
                    <Typography variant="overline" sx={{ fontSize: '0.65rem' }}>{field.label}</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{field.value}</Typography>
                  </Grid>
                ))}
              </Grid>

              <Divider sx={{ my: 2.5 }} />

              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>Execution Logs</Typography>
              <Box sx={{ bgcolor: 'background.default', borderRadius: '12px', p: 2, fontFamily: 'monospace', fontSize: '0.75rem', color: 'text.secondary', maxHeight: 300, overflow: 'auto' }}>
                <Box sx={{ color: brand.info }}>[INFO] Job {selectedJob.id} started</Box>
                <Box sx={{ color: brand.success }}>[INFO] Connected to source: {selectedJob.interface}</Box>
                <Box sx={{ color: 'text.secondary' }}>[INFO] Schema validated successfully</Box>
                <Box sx={{ color: 'text.secondary' }}>[INFO] Processing records...</Box>
                <Box sx={{ color: brand.success }}>[INFO] Processed {selectedJob.recordsProcessed} records</Box>
                {selectedJob.recordsFailed > 0 && (
                  <Box sx={{ color: brand.warning }}>[WARN] {selectedJob.recordsFailed} records failed validation</Box>
                )}
                {selectedJob.status === 'COMPLETED' && (
                  <Box sx={{ color: brand.success }}>[INFO] Job completed successfully in {selectedJob.duration}</Box>
                )}
                {selectedJob.status === 'FAILED' && (
                  <Box sx={{ color: brand.error }}>[ERROR] Connection timeout - target system unreachable</Box>
                )}
              </Box>
            </Box>
          </Box>
        )}
      </Drawer>
    </Box>
  );
};

export default JobHistoryPage;
