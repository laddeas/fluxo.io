// ============================================================================
// DataFusion AI — Users Page
// Complete user management with CRUD, role assignment, and RBAC
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
  Grid,
  Switch,
  FormControlLabel,
  Divider,
  Tab,
  Tabs,
} from '@mui/material';
import {
  AddOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  BlockOutlined,
  CheckCircleOutlined,
  MoreVertOutlined,
  PersonOutlined,
  AdminPanelSettingsOutlined,
  KeyOutlined,
  SecurityOutlined,
  HistoryOutlined,
  FilterListOutlined,
  DownloadOutlined,
} from '@mui/icons-material';
import { brand } from '../theme/theme';

const users = [
  {
    id: 'USR-001',
    name: 'System Administrator',
    email: 'admin@datafusion.io',
    role: 'SUPER_ADMIN',
    status: 'ACTIVE',
    mfa: true,
    lastLogin: '2 min ago',
    avatar: 'SA',
  },
  {
    id: 'USR-002',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@acme.com',
    role: 'TENANT_ADMIN',
    status: 'ACTIVE',
    mfa: true,
    lastLogin: '1 hour ago',
    avatar: 'SJ',
  },
  {
    id: 'USR-003',
    name: 'Michael Chen',
    email: 'michael.chen@acme.com',
    role: 'INTEGRATION_DEVELOPER',
    status: 'ACTIVE',
    mfa: false,
    lastLogin: '3 hours ago',
    avatar: 'MC',
  },
  {
    id: 'USR-004',
    name: 'Emily Davis',
    email: 'emily.davis@acme.com',
    role: 'BUSINESS_USER',
    status: 'ACTIVE',
    mfa: true,
    lastLogin: '1 day ago',
    avatar: 'ED',
  },
  {
    id: 'USR-005',
    name: 'Robert Wilson',
    email: 'robert.wilson@acme.com',
    role: 'OPERATOR',
    status: 'INACTIVE',
    mfa: false,
    lastLogin: '5 days ago',
    avatar: 'RW',
  },
  {
    id: 'USR-006',
    name: 'Lisa Anderson',
    email: 'lisa.anderson@acme.com',
    role: 'AUDITOR',
    status: 'ACTIVE',
    mfa: true,
    lastLogin: '12 hours ago',
    avatar: 'LA',
  },
  {
    id: 'USR-007',
    name: 'James Brown',
    email: 'james.brown@acme.com',
    role: 'READ_ONLY',
    status: 'SUSPENDED',
    mfa: false,
    lastLogin: '2 weeks ago',
    avatar: 'JB',
  },
];

const roleColors: Record<string, string> = {
  SUPER_ADMIN: brand.error,
  TENANT_ADMIN: brand.warning,
  ADMINISTRATOR: brand.primary,
  INTEGRATION_DEVELOPER: brand.accent,
  BUSINESS_USER: brand.success,
  OPERATOR: brand.info,
  AUDITOR: '#A78BFA',
  READ_ONLY: '#64748B',
};

const statusConfig: Record<string, { color: string; label: string }> = {
  ACTIVE: { color: brand.success, label: 'Active' },
  INACTIVE: { color: '#64748B', label: 'Inactive' },
  SUSPENDED: { color: brand.error, label: 'Suspended' },
  PENDING_VERIFICATION: { color: brand.warning, label: 'Pending' },
};

const UsersPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box>
      {/* Page Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            Users
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Manage users, roles, and permissions
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button variant="outlined" startIcon={<DownloadOutlined />}>
            Export
          </Button>
          <Button variant="contained" startIcon={<AddOutlined />} onClick={() => setCreateOpen(true)}>
            Create User
          </Button>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Total Users', value: '7', icon: <PersonOutlined />, color: brand.primary },
          { label: 'Active', value: '5', icon: <CheckCircleOutlined />, color: brand.success },
          { label: 'Admins', value: '2', icon: <AdminPanelSettingsOutlined />, color: brand.warning },
          { label: 'MFA Enabled', value: '4', icon: <SecurityOutlined />, color: brand.accent },
        ].map((stat) => (
          <Grid size={{ xs: 6, md: 3 }} key={stat.label}>
            <Card>
              <CardContent sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, '&:last-child': { pb: 2 } }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: alpha(stat.color, 0.1),
                    color: stat.color,
                  }}
                >
                  {stat.icon}
                </Box>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 800 }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {stat.label}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Users Table */}
      <Card>
        <CardContent sx={{ p: 2.5 }}>
          <Box sx={{ display: 'flex', gap: 2, mb: 2.5 }}>
            <TextField
              size="small"
              placeholder="Search users by name, email, or role..."
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
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Role</InputLabel>
              <Select
                label="Role"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
              >
                <MenuItem value="">All Roles</MenuItem>
                <MenuItem value="SUPER_ADMIN">Super Admin</MenuItem>
                <MenuItem value="TENANT_ADMIN">Tenant Admin</MenuItem>
                <MenuItem value="INTEGRATION_DEVELOPER">Developer</MenuItem>
                <MenuItem value="BUSINESS_USER">Business User</MenuItem>
                <MenuItem value="OPERATOR">Operator</MenuItem>
              </Select>
            </FormControl>
            <Button variant="outlined" startIcon={<FilterListOutlined />} size="small">
              More Filters
            </Button>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>MFA</TableCell>
                  <TableCell>Last Login</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.map((user) => (
                  <TableRow key={user.id} hover sx={{ cursor: 'pointer', '&:last-child td': { borderBottom: 0 } }}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar
                          sx={{
                            width: 38,
                            height: 38,
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            background: `linear-gradient(135deg, ${roleColors[user.role] || brand.primary}, ${alpha(roleColors[user.role] || brand.primary, 0.6)})`,
                          }}
                        >
                          {user.avatar}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                            {user.name}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            {user.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={user.role.replace(/_/g, ' ')}
                        size="small"
                        sx={{
                          fontWeight: 700,
                          fontSize: '0.68rem',
                          bgcolor: alpha(roleColors[user.role] || '#64748B', 0.1),
                          color: roleColors[user.role] || '#64748B',
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={statusConfig[user.status]?.label || user.status}
                        size="small"
                        sx={{
                          fontWeight: 700,
                          fontSize: '0.68rem',
                          bgcolor: alpha(statusConfig[user.status]?.color || '#64748B', 0.1),
                          color: statusConfig[user.status]?.color || '#64748B',
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={user.mfa ? <CheckCircleOutlined sx={{ fontSize: '14px !important' }} /> : undefined}
                        label={user.mfa ? 'Enabled' : 'Disabled'}
                        size="small"
                        variant="outlined"
                        sx={{
                          fontSize: '0.7rem',
                          borderColor: user.mfa ? brand.success : 'divider',
                          color: user.mfa ? brand.success : 'text.secondary',
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontSize: '0.85rem', color: 'text.secondary' }}>
                        {user.lastLogin}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
                        <Tooltip title="Edit">
                          <IconButton size="small"><EditOutlined fontSize="small" /></IconButton>
                        </Tooltip>
                        <Tooltip title="Reset Password">
                          <IconButton size="small"><KeyOutlined fontSize="small" /></IconButton>
                        </Tooltip>
                        <Tooltip title={user.status === 'ACTIVE' ? 'Disable' : 'Enable'}>
                          <IconButton size="small" sx={{ color: user.status === 'ACTIVE' ? 'warning.main' : 'success.main' }}>
                            {user.status === 'ACTIVE' ? <BlockOutlined fontSize="small" /> : <CheckCircleOutlined fontSize="small" />}
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton size="small" sx={{ color: 'error.main' }}>
                            <DeleteOutlined fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Create User Dialog */}
      <Dialog open={createOpen} onClose={() => setCreateOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Create New User</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Grid container spacing={2} sx={{ mt: 0 }}>
            <Grid size={6}>
              <TextField fullWidth label="First Name" />
            </Grid>
            <Grid size={6}>
              <TextField fullWidth label="Last Name" />
            </Grid>
            <Grid size={12}>
              <TextField fullWidth label="Email Address" type="email" />
            </Grid>
            <Grid size={12}>
              <TextField fullWidth label="Password" type="password" />
            </Grid>
            <Grid size={6}>
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select label="Role" defaultValue="">
                  <MenuItem value="TENANT_ADMIN">Tenant Admin</MenuItem>
                  <MenuItem value="ADMINISTRATOR">Administrator</MenuItem>
                  <MenuItem value="INTEGRATION_DEVELOPER">Integration Developer</MenuItem>
                  <MenuItem value="BUSINESS_USER">Business User</MenuItem>
                  <MenuItem value="OPERATOR">Operator</MenuItem>
                  <MenuItem value="AUDITOR">Auditor</MenuItem>
                  <MenuItem value="READ_ONLY">Read Only</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select label="Status" defaultValue="ACTIVE">
                  <MenuItem value="ACTIVE">Active</MenuItem>
                  <MenuItem value="PENDING_VERIFICATION">Pending Verification</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={12}>
              <Divider />
            </Grid>
            <Grid size={12}>
              <FormControlLabel
                control={<Switch />}
                label="Enable Multi-Factor Authentication (MFA)"
              />
            </Grid>
            <Grid size={12}>
              <FormControlLabel
                control={<Switch defaultChecked />}
                label="Send welcome email with credentials"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setCreateOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => setCreateOpen(false)}>
            Create User
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UsersPage;
