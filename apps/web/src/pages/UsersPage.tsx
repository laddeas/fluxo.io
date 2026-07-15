// ============================================================================
// DataFusion AI — Users Page
// User management with local storage persistence and dynamic CRUD
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
  Snackbar,
  Alert,
} from '@mui/material';
import {
  AddOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  BlockOutlined,
  CheckCircleOutlined,
  PersonOutlined,
  AdminPanelSettingsOutlined,
  SecurityOutlined,
  KeyOutlined,
} from '@mui/icons-material';
import { brand } from '../theme/theme';

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

  // Form Fields States
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('INTEGRATION_DEVELOPER');
  const [status, setStatus] = useState('ACTIVE');
  const [mfa, setMfa] = useState(false);

  // Load from localStorage
  const [usersList, setUsersList] = useState<any[]>(() => {
    return JSON.parse(localStorage.getItem('df_users') || '[]');
  });

  // Feedback State
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [toastSeverity, setToastSeverity] = useState<'success' | 'error' | 'info'>('success');

  // Deletion modal state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<{ id: string; name: string } | null>(null);

  const handleCreate = () => {
    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      showToast('First Name, Last Name and Email are required.', 'error');
      return;
    }

    const newUser = {
      id: `USR-${String(Math.floor(100 + Math.random() * 900))}`,
      name: `${firstName} ${lastName}`,
      email,
      role,
      status,
      mfa,
      lastLogin: 'Never',
      avatar: `${firstName[0] || 'U'}${lastName[0] || 'R'}`.toUpperCase(),
    };

    const updated = [newUser, ...usersList];
    setUsersList(updated);
    localStorage.setItem('df_users', JSON.stringify(updated));
    setCreateOpen(false);

    // Reset Form
    setFirstName('');
    setLastName('');
    setEmail('');
    setPassword('');
    setRole('INTEGRATION_DEVELOPER');
    setStatus('ACTIVE');
    setMfa(false);

    showToast(`User "${newUser.name}" added successfully.`, 'success');
  };

  const handleToggleStatus = (id: string, name: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    const updated = usersList.map((u) => (u.id === id ? { ...u, status: nextStatus } : u));
    setUsersList(updated);
    localStorage.setItem('df_users', JSON.stringify(updated));
    showToast(`User "${name}" status changed to ${nextStatus}.`, 'info');
  };

  const handleDelete = (id: string, name: string) => {
    setUserToDelete({ id, name });
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (userToDelete) {
      const updated = usersList.filter((u) => u.id !== userToDelete.id);
      setUsersList(updated);
      localStorage.setItem('df_users', JSON.stringify(updated));
      showToast(`User "${userToDelete.name}" deleted.`, 'info');
    }
    setDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  const handleResetPassword = (name: string) => {
    showToast(`Password reset link sent to ${name}.`, 'success');
  };

  const showToast = (msg: string, severity: 'success' | 'error' | 'info') => {
    setToastMsg(msg);
    setToastSeverity(severity);
    setToastOpen(true);
  };

  const filtered = usersList.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase())
  );

  // Dynamic Statistics
  const totalUsers = usersList.length;
  const activeUsers = usersList.filter((u) => u.status === 'ACTIVE').length;
  const adminUsers = usersList.filter((u) => ['SUPER_ADMIN', 'TENANT_ADMIN', 'ADMINISTRATOR'].includes(u.role)).length;
  const mfaEnabled = usersList.filter((u) => u.mfa).length;

  return (
    <Box>
      {/* Page Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>Users</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Manage users, roles, and permissions
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button variant="contained" startIcon={<AddOutlined />} onClick={() => setCreateOpen(true)}>
            Create User
          </Button>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Total Users', value: String(totalUsers), icon: <PersonOutlined />, color: brand.primary },
          { label: 'Active', value: String(activeUsers), icon: <CheckCircleOutlined />, color: brand.success },
          { label: 'Admins', value: String(adminUsers), icon: <AdminPanelSettingsOutlined />, color: brand.warning },
          { label: 'MFA Enabled', value: String(mfaEnabled), icon: <SecurityOutlined />, color: brand.accent },
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
                  <Typography variant="h5" sx={{ fontWeight: 800 }}>{stat.value}</Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>{stat.label}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Table Card */}
      <Card>
        <CardContent sx={{ p: 2.5 }}>
          <Box sx={{ display: 'flex', gap: 2, mb: 2.5 }}>
            <TextField
              size="small"
              placeholder="Search by name, email, or role..."
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
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                      No users found. Create your first team member using the "Create User" button.
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((user) => (
                    <TableRow key={user.id} hover sx={{ '&:last-child td': { borderBottom: 0 } }}>
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
                          <Tooltip title="Reset Password">
                            <IconButton size="small" onClick={() => handleResetPassword(user.name)}>
                              <KeyOutlined fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title={user.status === 'ACTIVE' ? 'Disable' : 'Enable'}>
                            <IconButton
                              size="small"
                              sx={{ color: user.status === 'ACTIVE' ? 'warning.main' : 'success.main' }}
                              onClick={() => handleToggleStatus(user.id, user.name, user.status)}
                            >
                              {user.status === 'ACTIVE' ? <BlockOutlined fontSize="small" /> : <CheckCircleOutlined fontSize="small" />}
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton size="small" sx={{ color: 'error.main' }} onClick={() => handleDelete(user.id, user.name)}>
                              <DeleteOutlined fontSize="small" />
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

      {/* Create User Dialog */}
      <Dialog open={createOpen} onClose={() => setCreateOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Create New User</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Grid container spacing={2} sx={{ mt: 0 }}>
            <Grid size={6}>
              <TextField
                fullWidth
                label="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </Grid>
            <Grid size={6}>
              <TextField
                fullWidth
                label="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </Grid>
            <Grid size={12}>
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Grid>
            <Grid size={12}>
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Grid>
            <Grid size={6}>
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  label="Role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
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
                <Select
                  label="Status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
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
                control={<Switch checked={mfa} onChange={(e) => setMfa(e.target.checked)} />}
                label="Enable Multi-Factor Authentication (MFA)"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setCreateOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreate}>
            Create User
          </Button>
        </DialogActions>
      </Dialog>
      {/* User Deletion Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setUserToDelete(null);
        }}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700 }}>
          Confirm Delete User
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
            Are you sure you want to delete user <strong>{userToDelete?.name}</strong>? This action will remove the user's account and partition access boundaries.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button variant="outlined" onClick={() => {
            setDeleteDialogOpen(false);
            setUserToDelete(null);
          }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleConfirmDelete}
            sx={{ bgcolor: brand.error }}
          >
            Delete User
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

export default UsersPage;
