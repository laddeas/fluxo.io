// ============================================================================
// DataFusion AI — Home Page
// Executive dashboard with KPI cards and onboarding guide
// ============================================================================

import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  LinearProgress,
  alpha,
  Divider,
} from '@mui/material';
import {
  TrendingUpOutlined,
  CheckCircleOutlined,
  ErrorOutlined,
  ScheduleOutlined,
  PlayArrowOutlined,
  SwapHorizOutlined,
  StorageOutlined,
  SpeedOutlined,
  AddOutlined,
  ArrowForwardOutlined,
  AutoAwesomeOutlined,
  IntegrationInstructionsOutlined,
  PeopleOutlined,
  ExtensionOutlined,
} from '@mui/icons-material';
import { brand, darkPalette } from '../theme/theme';

interface KPICardProps {
  title: string;
  value: string;
  change: string;
  changeType: 'up' | 'down' | 'neutral';
  icon: React.ReactElement;
  color: string;
  subtitle?: string;
}

const KPICard: React.FC<KPICardProps> = ({ title, value, change, changeType, icon, color, subtitle }) => (
  <Card
    sx={{
      position: 'relative',
      overflow: 'hidden',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 3,
        background: `linear-gradient(90deg, ${color}, ${alpha(color, 0.3)})`,
      },
    }}
  >
    <CardContent sx={{ p: 2.5 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Box>
          <Typography variant="overline" sx={{ fontSize: '0.68rem', color: 'text.secondary' }}>
            {title}
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: 800, mt: 0.5 }}>
            {value}
          </Typography>
        </Box>
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: alpha(color, 0.1),
            color: color,
          }}
        >
          {icon}
        </Box>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Chip
          label={change}
          size="small"
          sx={{
            height: 22,
            fontSize: '0.7rem',
            fontWeight: 700,
            bgcolor: alpha(changeType === 'up' ? brand.success : changeType === 'down' ? brand.error : brand.info, 0.1),
            color: changeType === 'up' ? brand.success : changeType === 'down' ? brand.error : brand.info,
          }}
        />
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          {subtitle || 'vs last 7 days'}
        </Typography>
      </Box>
    </CardContent>
  </Card>
);

const quickActions = [
  {
    icon: <SwapHorizOutlined />,
    title: 'Create Integration',
    description: 'Set up a new data flow between systems',
    path: '/interfaces',
    color: brand.primary,
  },
  {
    icon: <ExtensionOutlined />,
    title: 'Add Connector',
    description: 'Connect a new data source or destination',
    path: '/connectors',
    color: brand.secondary,
  },
  {
    icon: <PeopleOutlined />,
    title: 'Manage Users',
    description: 'Add team members and assign roles',
    path: '/users',
    color: brand.accent,
  },
  {
    icon: <AutoAwesomeOutlined />,
    title: 'AI Assistant',
    description: 'Get intelligent help with your integrations',
    path: '#ai',
    color: brand.warning,
  },
];

const recentJobs = [
  { id: 'JOB-1284', name: 'Salesforce → PostgreSQL Sync', status: 'COMPLETED', records: '12,450', duration: '2m 34s', time: '5 min ago' },
  { id: 'JOB-1283', name: 'SAP Invoice Import', status: 'RUNNING', records: '8,231', duration: '1m 12s', time: '8 min ago' },
  { id: 'JOB-1282', name: 'CSV Upload Processing', status: 'COMPLETED', records: '5,678', duration: '45s', time: '15 min ago' },
  { id: 'JOB-1281', name: 'API Data Extraction', status: 'FAILED', records: '0', duration: '12s', time: '22 min ago' },
  { id: 'JOB-1280', name: 'ServiceNow Ticket Export', status: 'COMPLETED', records: '3,421', duration: '1m 5s', time: '30 min ago' },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'COMPLETED': return brand.success;
    case 'RUNNING': return brand.info;
    case 'FAILED': return brand.error;
    case 'PENDING': return brand.warning;
    default: return 'text.secondary';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'COMPLETED': return <CheckCircleOutlined sx={{ fontSize: 16 }} />;
    case 'RUNNING': return <PlayArrowOutlined sx={{ fontSize: 16 }} />;
    case 'FAILED': return <ErrorOutlined sx={{ fontSize: 16 }} />;
    default: return <ScheduleOutlined sx={{ fontSize: 16 }} />;
  }
};

const HomePage: React.FC = () => {
  return (
    <Box>
      {/* Welcome Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
          Welcome back, Administrator 👋
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          Here's an overview of your integration platform. All systems are operational.
        </Typography>
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KPICard
            title="Total Integrations"
            value="48"
            change="↑ 12%"
            changeType="up"
            icon={<IntegrationInstructionsOutlined />}
            color={brand.primary}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KPICard
            title="Successful Jobs"
            value="1,284"
            change="↑ 8%"
            changeType="up"
            icon={<CheckCircleOutlined />}
            color={brand.success}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KPICard
            title="Records Processed"
            value="2.4M"
            change="↑ 24%"
            changeType="up"
            icon={<StorageOutlined />}
            color={brand.accent}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KPICard
            title="Avg. Throughput"
            value="15.2K"
            change="↑ 5%"
            changeType="up"
            icon={<SpeedOutlined />}
            color={brand.warning}
            subtitle="records/min"
          />
        </Grid>
      </Grid>

      <Grid container spacing={2.5}>
        {/* Recent Jobs */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card>
            <CardContent sx={{ p: 0 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  p: 2.5,
                  pb: 2,
                }}
              >
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Recent Jobs
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Latest integration executions
                  </Typography>
                </Box>
                <Button
                  size="small"
                  endIcon={<ArrowForwardOutlined />}
                  sx={{ fontSize: '0.8rem' }}
                >
                  View All
                </Button>
              </Box>
              <Divider />
              {recentJobs.map((job, index) => (
                <Box key={job.id}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      px: 2.5,
                      py: 1.5,
                      '&:hover': { bgcolor: 'action.hover' },
                      cursor: 'pointer',
                    }}
                  >
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: alpha(getStatusColor(job.status), 0.1),
                        color: getStatusColor(job.status),
                      }}
                    >
                      {getStatusIcon(job.status)}
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                        {job.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {job.id} • {job.records} records • {job.duration}
                      </Typography>
                    </Box>
                    <Chip
                      label={job.status}
                      size="small"
                      sx={{
                        height: 24,
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        bgcolor: alpha(getStatusColor(job.status), 0.1),
                        color: getStatusColor(job.status),
                      }}
                    />
                    <Typography variant="caption" sx={{ color: 'text.disabled', whiteSpace: 'nowrap' }}>
                      {job.time}
                    </Typography>
                  </Box>
                  {index < recentJobs.length - 1 && <Divider sx={{ mx: 2.5 }} />}
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent sx={{ p: 2.5 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                Quick Actions
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', mb: 2, display: 'block' }}>
                Get started with common tasks
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {quickActions.map((action, i) => (
                  <Box
                    key={i}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      p: 1.5,
                      borderRadius: '12px',
                      border: '1px solid',
                      borderColor: 'divider',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      '&:hover': {
                        borderColor: alpha(action.color, 0.4),
                        bgcolor: alpha(action.color, 0.04),
                        transform: 'translateX(4px)',
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 38,
                        height: 38,
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: alpha(action.color, 0.1),
                        color: action.color,
                        flexShrink: 0,
                      }}
                    >
                      {action.icon}
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                        {action.title}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {action.description}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>

          {/* System Health */}
          <Card sx={{ mt: 2.5 }}>
            <CardContent sx={{ p: 2.5 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                System Health
              </Typography>
              {[
                { name: 'API Gateway', status: 99.9, color: brand.success },
                { name: 'Database', status: 99.8, color: brand.success },
                { name: 'Message Broker', status: 100, color: brand.success },
                { name: 'AI Services', status: 98.5, color: brand.warning },
              ].map((service) => (
                <Box key={service.name} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="caption" sx={{ fontWeight: 600 }}>
                      {service.name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: service.color, fontWeight: 700 }}>
                      {service.status}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={service.status}
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      bgcolor: alpha(service.color, 0.1),
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 3,
                        background: `linear-gradient(90deg, ${service.color}, ${alpha(service.color, 0.7)})`,
                      },
                    }}
                  />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default HomePage;
