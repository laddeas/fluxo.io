// ============================================================================
// DataFusion AI — Domains Page
// Domain-based access control, partition settings, and user assignments
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
  Checkbox,
  FormControlLabel,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  AddOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  DomainOutlined,
  PeopleOutlined,
  LockOutlined,
  SecurityOutlined,
  PersonAddOutlined,
} from '@mui/icons-material';
import { brand } from '../theme/theme';

const initialDomains = [
  {
    id: 'DOM-001',
    name: 'Sales',
    code: 'SALES_DEPT',
    description: 'CRM pipelines, Salesforce connectors, and customer ingestion flows',
    status: 'ACTIVE',
    membersCount: 2,
    resourcesCount: 6,
    restricted: true,
    memberEmails: ['sales@datafusion.io', 'jane@datafusion.io'],
  },
  {
    id: 'DOM-002',
    name: 'Finance',
    code: 'FINANCE_DEPT',
    description: 'Billing syncs, SAP invoice pipelines, and secure auditing paths',
    status: 'ACTIVE',
    membersCount: 1,
    resourcesCount: 12,
    restricted: true,
    memberEmails: ['finance@datafusion.io'],
  },
  {
    id: 'DOM-003',
    name: 'Human Resources',
    code: 'HR_DEPT',
    description: 'Employee onboarding syncs, payroll logs, and directory mirrors',
    status: 'ACTIVE',
    membersCount: 1,
    resourcesCount: 4,
    restricted: true,
    memberEmails: ['hr@datafusion.io'],
  },
  {
    id: 'DOM-004',
    name: 'IT Operations',
    code: 'IT_OPS',
    description: 'ServiceNow ticket automations, server checks, and infrastructure logs',
    status: 'ACTIVE',
    membersCount: 3,
    resourcesCount: 24,
    restricted: false,
    memberEmails: ['support@datafusion.io', 'admin@datafusion.io', 'it@datafusion.io'],
  },
];

// Mock Users available for domain assignment
const availableUsers = [
  { email: 'admin@datafusion.io', name: 'System Administrator' },
  { email: 'dev@datafusion.io', name: 'Integration Developer' },
  { email: 'sales@datafusion.io', name: 'Sales Account Lead' },
  { email: 'finance@datafusion.io', name: 'Financial Auditor' },
  { email: 'hr@datafusion.io', name: 'HR Recruiter' },
  { email: 'support@datafusion.io', name: 'Support Engineer' },
  { email: 'jane@datafusion.io', name: 'Jane Doe' },
];

const DomainsPage: React.FC = () => {
  const [domains, setDomains] = useState<any[]>(() => {
    const saved = localStorage.getItem('df_domains');
    return saved ? JSON.parse(saved) : initialDomains;
  });
  const [search, setSearch] = useState('');
  
  // Dialog Open States
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [membersOpen, setMembersOpen] = useState(false);

  // Form Fields States
  const [selectedDomainId, setSelectedDomainId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [restricted, setRestricted] = useState(true);

  // Member Assignment States
  const [tempMemberEmails, setTempMemberEmails] = useState<string[]>([]);

  // Toast feedback state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info'>('success');

  // Read currently logged in user info
  const userStr = localStorage.getItem('df_user');
  const user = userStr ? JSON.parse(userStr) : { roles: ['SUPER_ADMIN'] };
  const isSuperAdmin = user.roles?.includes('SUPER_ADMIN');
  const userDomain = user.domain;

  const filtered = domains.filter((dom) => {
    const matchSearch =
      dom.name.toLowerCase().includes(search.toLowerCase()) ||
      dom.code.toLowerCase().includes(search.toLowerCase());

    if (isSuperAdmin) return matchSearch;
    return matchSearch && (!dom.restricted || dom.name === userDomain);
  });

  const saveDomains = (updatedDoms: any[]) => {
    setDomains(updatedDoms);
    localStorage.setItem('df_domains', JSON.stringify(updatedDoms));
  };

  const handleCreate = () => {
    if (!name.trim() || !code.trim()) {
      showToast('Name and Code are required', 'error');
      return;
    }

    const newDom = {
      id: `DOM-${String(Math.floor(100 + Math.random() * 900))}`,
      name,
      code: code.toUpperCase().replace(/\s+/g, '_'),
      description,
      status: 'ACTIVE',
      membersCount: 0,
      resourcesCount: 0,
      restricted,
      memberEmails: [],
    };

    saveDomains([...domains, newDom]);
    setCreateOpen(false);
    resetForm();
    showToast(`Domain "${newDom.name}" created successfully.`, 'success');
  };

  const handleEditClick = (dom: any) => {
    setSelectedDomainId(dom.id);
    setName(dom.name);
    setCode(dom.code);
    setDescription(dom.description);
    setRestricted(dom.restricted);
    setEditOpen(true);
  };

  const handleUpdate = () => {
    if (!name.trim() || !code.trim()) {
      showToast('Name and Code are required', 'error');
      return;
    }

    const updated = domains.map((dom) =>
      dom.id === selectedDomainId
        ? {
            ...dom,
            name,
            code: code.toUpperCase().replace(/\s+/g, '_'),
            description,
            restricted,
          }
        : dom
    );
    saveDomains(updated);
    setEditOpen(false);
    resetForm();
    showToast(`Domain was updated successfully.`, 'success');
  };

  const handleMembersClick = (dom: any) => {
    setSelectedDomainId(dom.id);
    setTempMemberEmails([...dom.memberEmails]);
    setMembersOpen(true);
  };

  const handleToggleMember = (email: string) => {
    if (tempMemberEmails.includes(email)) {
      setTempMemberEmails(tempMemberEmails.filter((e) => e !== email));
    } else {
      setTempMemberEmails([...tempMemberEmails, email]);
    }
  };

  const handleSaveMembers = () => {
    const updated = domains.map((dom) =>
      dom.id === selectedDomainId
        ? {
            ...dom,
            memberEmails: tempMemberEmails,
            membersCount: tempMemberEmails.length,
          }
        : dom
    );
    saveDomains(updated);
    setMembersOpen(false);
    showToast('Domain membership updated successfully.', 'success');
  };

  const handleDeleteDomain = (id: string, domName: string) => {
    const updated = domains.filter((dom) => dom.id !== id);
    saveDomains(updated);
    showToast(`Domain "${domName}" deleted successfully.`, 'info');
  };

  const resetForm = () => {
    setSelectedDomainId(null);
    setName('');
    setCode('');
    setDescription('');
    setRestricted(true);
  };

  const showToast = (msg: string, severity: 'success' | 'error' | 'info') => {
    setSnackbarMessage(msg);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  return (
    <Box>
      {/* Access Banner */}
      <Card
        sx={{
          mb: 3,
          background: `linear-gradient(90deg, ${alpha(brand.primary, 0.1)} 0%, ${alpha(brand.accent, 0.05)} 100%)`,
          borderColor: alpha(brand.primary, 0.25),
        }}
      >
        <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, py: '16px !important' }}>
          <SecurityOutlined sx={{ color: brand.primary, fontSize: 28 }} />
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'text.primary' }}>
              {isSuperAdmin ? 'Elevated Access Control (Superadmin Mode)' : `Domain-Restricted Access: ${userDomain || 'None'}`}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {isSuperAdmin
                ? 'You have complete visibility across all security domains and partitions. You can configure user boundaries.'
                : `You are currently restricted to resources belonging to the "${userDomain}" domain. All other partitioned files are hidden.`}
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Page Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            Security Domains
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Partition resources and user access controls domain-wise
          </Typography>
        </Box>
        {isSuperAdmin && (
          <Button
            variant="contained"
            startIcon={<AddOutlined />}
            onClick={() => {
              resetForm();
              setCreateOpen(true);
            }}
          >
            Create Domain
          </Button>
        )}
      </Box>

      {/* Domains Table */}
      <Card>
        <CardContent sx={{ p: 2.5 }}>
          <Box sx={{ display: 'flex', gap: 2, mb: 2.5 }}>
            <TextField
              size="small"
              placeholder="Search domains by name or code..."
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
                  <TableCell>Domain</TableCell>
                  <TableCell>Code</TableCell>
                  <TableCell>Visibility</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Members</TableCell>
                  <TableCell align="right">Resources Linked</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                      No domains available or visible to your account.
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((dom) => (
                    <TableRow key={dom.id} hover sx={{ '&:last-child td': { borderBottom: 0 } }}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Avatar
                            sx={{
                              width: 36,
                              height: 36,
                              borderRadius: '10px',
                              bgcolor: alpha(brand.primary, 0.1),
                              color: brand.primary,
                            }}
                          >
                            <DomainOutlined fontSize="small" />
                          </Avatar>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                              {dom.name}
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                              {dom.description}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                          {dom.code}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={dom.restricted ? <LockOutlined sx={{ fontSize: '12px !important' }} /> : undefined}
                          label={dom.restricted ? 'Restricted' : 'Global'}
                          size="small"
                          variant="outlined"
                          sx={{
                            fontSize: '0.7rem',
                            borderColor: dom.restricted ? brand.warning : 'divider',
                            color: dom.restricted ? brand.warning : 'text.secondary',
                            '& .MuiChip-icon': { color: 'inherit' },
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={dom.status}
                          size="small"
                          sx={{
                            fontWeight: 700,
                            fontSize: '0.7rem',
                            bgcolor: alpha(brand.success, 0.1),
                            color: brand.success,
                          }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, justifyContent: 'flex-end' }}>
                          <PeopleOutlined sx={{ fontSize: 16, color: 'text.secondary' }} />
                          <Typography variant="body2" sx={{ fontWeight: 600, mr: 1 }}>
                            {dom.membersCount}
                          </Typography>
                          {isSuperAdmin && (
                            <Tooltip title="Manage Domain Users">
                              <IconButton size="small" onClick={() => handleMembersClick(dom)}>
                                <PersonAddOutlined sx={{ fontSize: 16 }} />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {dom.resourcesCount}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
                          <Tooltip title="Edit">
                            <IconButton size="small" disabled={!isSuperAdmin} onClick={() => handleEditClick(dom)}>
                              <EditOutlined fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              size="small"
                              sx={{ color: 'error.main' }}
                              disabled={!isSuperAdmin}
                              onClick={() => handleDeleteDomain(dom.id, dom.name)}
                            >
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

      {/* Create Dialog (Superadmin only) */}
      <Dialog open={createOpen} onClose={() => setCreateOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Create New Security Domain</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Grid container spacing={2} sx={{ mt: 0 }}>
            <Grid size={12}>
              <TextField
                fullWidth
                label="Domain Name"
                placeholder="e.g. Sales"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Grid>
            <Grid size={12}>
              <TextField
                fullWidth
                label="Domain Code"
                placeholder="e.g. SALES_DEPT"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </Grid>
            <Grid size={12}>
              <TextField
                fullWidth
                label="Description"
                placeholder="Details of resources inside this partition..."
                multiline
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Grid>
            <Grid size={12}>
              <FormControl fullWidth>
                <InputLabel>Visibility Control</InputLabel>
                <Select
                  label="Visibility Control"
                  value={restricted ? 'restricted' : 'global'}
                  onChange={(e) => setRestricted(e.target.value === 'restricted')}
                >
                  <MenuItem value="restricted">Restricted (Assigned Members Only)</MenuItem>
                  <MenuItem value="global">Global (Visible to All Users)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setCreateOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreate}>
            Create Domain
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog (Superadmin only) */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Edit Security Domain</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Grid container spacing={2} sx={{ mt: 0 }}>
            <Grid size={12}>
              <TextField
                fullWidth
                label="Domain Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Grid>
            <Grid size={12}>
              <TextField
                fullWidth
                label="Domain Code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </Grid>
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
            <Grid size={12}>
              <FormControl fullWidth>
                <InputLabel>Visibility Control</InputLabel>
                <Select
                  label="Visibility Control"
                  value={restricted ? 'restricted' : 'global'}
                  onChange={(e) => setRestricted(e.target.value === 'restricted')}
                >
                  <MenuItem value="restricted">Restricted (Assigned Members Only)</MenuItem>
                  <MenuItem value="global">Global (Visible to All Users)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleUpdate}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Manage Members Dialog */}
      <Dialog open={membersOpen} onClose={() => setMembersOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Manage Domain Members</DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
            Select users to assign to this security domain boundary.
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {availableUsers.map((usr) => (
              <FormControlLabel
                key={usr.email}
                control={
                  <Checkbox
                    checked={tempMemberEmails.includes(usr.email)}
                    onChange={() => handleToggleMember(usr.email)}
                  />
                }
                label={
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {usr.name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      {usr.email}
                    </Typography>
                  </Box>
                }
              />
            ))}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setMembersOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveMembers}>
            Save Assignments
          </Button>
        </DialogActions>
      </Dialog>

      {/* Toast Alert Feedback */}
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

export default DomainsPage;
