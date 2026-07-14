// ============================================================================
// DataFusion AI — Monitoring Page
// System health, metrics, and observability dashboard
// ============================================================================

import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  LinearProgress,
  Divider,
  alpha,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  CheckCircleOutlined,
  WarningAmberOutlined,
  ErrorOutlined,
  SpeedOutlined,
  MemoryOutlined,
  StorageOutlined,
  NetworkCheckOutlined,
  FiberManualRecordOutlined,
} from '@mui/icons-material';
import { brand } from '../theme/theme';

const services = [
  { name: 'API Gateway', status: 'healthy', latency: '12ms', uptime: '99.99%', cpu: 23, memory: 45 },
  { name: 'Auth Service', status: 'healthy', latency: '8ms', uptime: '99.99%', cpu: 15, memory: 38 },
  { name: 'User Service', status: 'healthy', latency: '15ms', uptime: '99.98%', cpu: 12, memory: 32 },
  { name: 'Interface Service', status: 'healthy', latency: '22ms', uptime: '99.95%', cpu: 45, memory: 62 },
  { name: 'Connector Service', status: 'healthy', latency: '18ms', uptime: '99.97%', cpu: 28, memory: 44 },
  { name: 'Job Service', status: 'healthy', latency: '35ms', uptime: '99.93%', cpu: 52, memory: 71 },
  { name: 'Workflow Service', status: 'warning', latency: '125ms', uptime: '99.90%', cpu: 68, memory: 78 },
  { name: 'Notification Service', status: 'healthy', latency: '10ms', uptime: '99.99%', cpu: 8, memory: 25 },
  { name: 'Audit Service', status: 'healthy', latency: '14ms', uptime: '99.99%', cpu: 10, memory: 30 },
  { name: 'AI Assistant', status: 'healthy', latency: '450ms', uptime: '98.50%', cpu: 72, memory: 85 },
  { name: 'AI Mapping Engine', status: 'healthy', latency: '320ms', uptime: '99.20%', cpu: 55, memory: 70 },
  { name: 'PostgreSQL', status: 'healthy', latency: '2ms', uptime: '99.99%', cpu: 35, memory: 60 },
  { name: 'Redis', status: 'healthy', latency: '0.5ms', uptime: '99.99%', cpu: 5, memory: 42 },
  { name: 'RabbitMQ', status: 'healthy', latency: '3ms', uptime: '99.99%', cpu: 18, memory: 48 },
];

const recentAlerts = [
  { time: '14:32', severity: 'warning', service: 'Workflow Service', message: 'Response time exceeds 100ms threshold' },
  { time: '13:45', severity: 'info', service: 'Job Service', message: 'Auto-scaled to 4 replicas due to queue depth' },
  { time: '12:20', severity: 'error', service: 'Azure Blob Connector', message: 'Connection timeout - retrying...' },
  { time: '11:15', severity: 'info', service: 'AI Mapping Engine', message: 'Model cache refreshed successfully' },
  { time: '10:00', severity: 'info', service: 'PostgreSQL', message: 'Automated backup completed' },
];

const statusIcon = (status: string) => {
  switch (status) {
    case 'healthy': return <FiberManualRecordOutlined sx={{ fontSize: 12, color: brand.success }} />;
    case 'warning': return <FiberManualRecordOutlined sx={{ fontSize: 12, color: brand.warning }} />;
    case 'error': return <FiberManualRecordOutlined sx={{ fontSize: 12, color: brand.error }} />;
    default: return <FiberManualRecordOutlined sx={{ fontSize: 12, color: '#64748B' }} />;
  }
};

const getBarColor = (value: number) => {
  if (value > 80) return brand.error;
  if (value > 60) return brand.warning;
  return brand.success;
};

const MonitoringPage: React.FC = () => {
  const healthyCount = services.filter(s => s.status === 'healthy').length;
  const warningCount = services.filter(s => s.status === 'warning').length;
  const errorCount = services.filter(s => s.status === 'error').length;

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>Monitoring</Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
          System health, performance metrics, and alerts
        </Typography>
      </Box>

      {/* Overall Health */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 3 }}>
          <Card>
            <CardContent sx={{ p: 2.5, textAlign: 'center' }}>
              <CheckCircleOutlined sx={{ fontSize: 40, color: brand.success, mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 800, color: brand.success }}>
                {healthyCount}/{services.length}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>Services Healthy</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <Card>
            <CardContent sx={{ p: 2.5, textAlign: 'center' }}>
              <SpeedOutlined sx={{ fontSize: 40, color: brand.accent, mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 800, color: brand.accent }}>
                45ms
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>Avg API Latency</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <Card>
            <CardContent sx={{ p: 2.5, textAlign: 'center' }}>
              <MemoryOutlined sx={{ fontSize: 40, color: brand.primary, mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 800, color: brand.primary }}>
                32%
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>Avg CPU Usage</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <Card>
            <CardContent sx={{ p: 2.5, textAlign: 'center' }}>
              <NetworkCheckOutlined sx={{ fontSize: 40, color: brand.success, mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 800, color: brand.success }}>
                99.95%
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>Platform Uptime</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={2.5}>
        {/* Service Health Table */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card>
            <CardContent sx={{ p: 0 }}>
              <Box sx={{ p: 2.5, pb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>Service Health</Typography>
              </Box>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Service</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Latency</TableCell>
                      <TableCell>Uptime</TableCell>
                      <TableCell>CPU</TableCell>
                      <TableCell>Memory</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {services.map((service) => (
                      <TableRow key={service.name} hover sx={{ '&:last-child td': { borderBottom: 0 } }}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {statusIcon(service.status)}
                            <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.82rem' }}>
                              {service.name}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={service.status.toUpperCase()}
                            size="small"
                            sx={{
                              height: 20,
                              fontSize: '0.65rem',
                              fontWeight: 700,
                              bgcolor: alpha(
                                service.status === 'healthy' ? brand.success :
                                service.status === 'warning' ? brand.warning : brand.error,
                                0.1
                              ),
                              color: service.status === 'healthy' ? brand.success :
                                service.status === 'warning' ? brand.warning : brand.error,
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
                            {service.latency}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="caption" sx={{ fontWeight: 600 }}>
                            {service.uptime}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ width: 100 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <LinearProgress
                              variant="determinate"
                              value={service.cpu}
                              sx={{
                                flex: 1,
                                height: 5,
                                borderRadius: 3,
                                bgcolor: alpha(getBarColor(service.cpu), 0.1),
                                '& .MuiLinearProgress-bar': {
                                  borderRadius: 3,
                                  bgcolor: getBarColor(service.cpu),
                                },
                              }}
                            />
                            <Typography variant="caption" sx={{ fontSize: '0.68rem', width: 28, textAlign: 'right' }}>
                              {service.cpu}%
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ width: 100 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <LinearProgress
                              variant="determinate"
                              value={service.memory}
                              sx={{
                                flex: 1,
                                height: 5,
                                borderRadius: 3,
                                bgcolor: alpha(getBarColor(service.memory), 0.1),
                                '& .MuiLinearProgress-bar': {
                                  borderRadius: 3,
                                  bgcolor: getBarColor(service.memory),
                                },
                              }}
                            />
                            <Typography variant="caption" sx={{ fontSize: '0.68rem', width: 28, textAlign: 'right' }}>
                              {service.memory}%
                            </Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Alerts */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent sx={{ p: 2.5 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Recent Alerts
              </Typography>
              {recentAlerts.map((alert, i) => (
                <Box key={i}>
                  <Box sx={{ display: 'flex', gap: 1.5, py: 1.5 }}>
                    {alert.severity === 'error' ? (
                      <ErrorOutlined sx={{ fontSize: 18, color: brand.error, mt: 0.2 }} />
                    ) : alert.severity === 'warning' ? (
                      <WarningAmberOutlined sx={{ fontSize: 18, color: brand.warning, mt: 0.2 }} />
                    ) : (
                      <CheckCircleOutlined sx={{ fontSize: 18, color: brand.info, mt: 0.2 }} />
                    )}
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.82rem' }}>
                        {alert.service}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {alert.message}
                      </Typography>
                    </Box>
                    <Typography variant="caption" sx={{ color: 'text.disabled', whiteSpace: 'nowrap' }}>
                      {alert.time}
                    </Typography>
                  </Box>
                  {i < recentAlerts.length - 1 && <Divider />}
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MonitoringPage;
