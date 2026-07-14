// ============================================================================
// DataFusion AI — Settings Page
// Section-based configuration management
// ============================================================================

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  TextField,
  Switch,
  FormControlLabel,
  Button,
  Grid,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  alpha,
  Slider,
} from '@mui/material';
import {
  BusinessOutlined,
  DescriptionOutlined,
  ExtensionOutlined,
  SecurityOutlined,
  SmartToyOutlined,
  NotificationsOutlined,
  MonitorHeartOutlined,
  BackupOutlined,
  SaveOutlined,
  PaletteOutlined,
  LanguageOutlined,
} from '@mui/icons-material';
import { brand } from '../theme/theme';

const sections = [
  { id: 'general', label: 'General', icon: <BusinessOutlined /> },
  { id: 'file', label: 'File Settings', icon: <DescriptionOutlined /> },
  { id: 'connector', label: 'Connectors', icon: <ExtensionOutlined /> },
  { id: 'security', label: 'Security', icon: <SecurityOutlined /> },
  { id: 'ai', label: 'AI Settings', icon: <SmartToyOutlined /> },
  { id: 'notifications', label: 'Notifications', icon: <NotificationsOutlined /> },
  { id: 'monitoring', label: 'Monitoring', icon: <MonitorHeartOutlined /> },
  { id: 'backup', label: 'Backup', icon: <BackupOutlined /> },
];

const SettingsPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState('general');

  const renderSection = () => {
    switch (activeSection) {
      case 'general':
        return (
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>General Settings</Typography>
            <Grid container spacing={3}>
              <Grid size={6}>
                <TextField fullWidth label="Company Name" defaultValue="Acme Corporation" />
              </Grid>
              <Grid size={6}>
                <TextField fullWidth label="Application Name" defaultValue="DataFusion AI" />
              </Grid>
              <Grid size={6}>
                <FormControl fullWidth>
                  <InputLabel>Theme</InputLabel>
                  <Select label="Theme" defaultValue="dark">
                    <MenuItem value="dark">Dark Mode</MenuItem>
                    <MenuItem value="light">Light Mode</MenuItem>
                    <MenuItem value="system">System Default</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={6}>
                <FormControl fullWidth>
                  <InputLabel>Language</InputLabel>
                  <Select label="Language" defaultValue="en">
                    <MenuItem value="en">English</MenuItem>
                    <MenuItem value="es">Español</MenuItem>
                    <MenuItem value="fr">Français</MenuItem>
                    <MenuItem value="de">Deutsch</MenuItem>
                    <MenuItem value="ja">日本語</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={6}>
                <TextField fullWidth label="Primary Brand Color" defaultValue="#6366F1" />
              </Grid>
              <Grid size={6}>
                <TextField fullWidth label="Logo URL" defaultValue="" placeholder="https://..." />
              </Grid>
              <Grid size={12}>
                <FormControl fullWidth>
                  <InputLabel>Timezone</InputLabel>
                  <Select label="Timezone" defaultValue="UTC">
                    <MenuItem value="UTC">UTC</MenuItem>
                    <MenuItem value="US/Eastern">US/Eastern</MenuItem>
                    <MenuItem value="US/Pacific">US/Pacific</MenuItem>
                    <MenuItem value="Europe/London">Europe/London</MenuItem>
                    <MenuItem value="Asia/Kolkata">Asia/Kolkata</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        );

      case 'file':
        return (
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>File Settings</Typography>
            <Grid container spacing={3}>
              <Grid size={12}>
                <FormControlLabel control={<Switch defaultChecked />} label="Enable File Upload" />
              </Grid>
              <Grid size={12}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                  Maximum File Size: <Chip label="100 MB" size="small" sx={{ ml: 1 }} />
                </Typography>
                <Slider defaultValue={100} min={1} max={500} valueLabelDisplay="auto" valueLabelFormat={(v) => `${v} MB`} />
              </Grid>
              <Grid size={12}>
                <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600 }}>
                  Allowed File Extensions
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {['CSV', 'XLS', 'XLSX', 'JSON', 'XML', 'TXT', 'PDF'].map((ext) => (
                    <Chip
                      key={ext}
                      label={ext}
                      color="primary"
                      variant="outlined"
                      onDelete={() => {}}
                      sx={{ fontWeight: 600 }}
                    />
                  ))}
                </Box>
              </Grid>
              <Grid size={12}>
                <FormControlLabel control={<Switch defaultChecked />} label="Auto-detect file encoding" />
              </Grid>
              <Grid size={12}>
                <FormControlLabel control={<Switch defaultChecked />} label="Enable duplicate detection" />
              </Grid>
            </Grid>
          </Box>
        );

      case 'security':
        return (
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>Security Settings</Typography>
            <Grid container spacing={3}>
              <Grid size={12}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>Authentication</Typography>
                <FormControlLabel control={<Switch />} label="Enforce MFA for all users" />
                <FormControlLabel control={<Switch defaultChecked />} label="Enable SSO (Single Sign-On)" />
                <FormControlLabel control={<Switch />} label="Enable LDAP/Active Directory integration" />
              </Grid>
              <Grid size={12}><Divider /></Grid>
              <Grid size={12}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>Session Management</Typography>
              </Grid>
              <Grid size={6}>
                <TextField fullWidth label="Session Timeout (minutes)" type="number" defaultValue="60" />
              </Grid>
              <Grid size={6}>
                <TextField fullWidth label="Max Concurrent Sessions" type="number" defaultValue="5" />
              </Grid>
              <Grid size={12}><Divider /></Grid>
              <Grid size={12}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>Password Policy</Typography>
              </Grid>
              <Grid size={6}>
                <TextField fullWidth label="Minimum Password Length" type="number" defaultValue="12" />
              </Grid>
              <Grid size={6}>
                <TextField fullWidth label="Password Expiry (days)" type="number" defaultValue="90" />
              </Grid>
              <Grid size={12}>
                <FormControlLabel control={<Switch defaultChecked />} label="Require uppercase, lowercase, number, and special character" />
              </Grid>
            </Grid>
          </Box>
        );

      case 'ai':
        return (
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>AI Settings</Typography>
            <Grid container spacing={3}>
              <Grid size={12}>
                <FormControlLabel control={<Switch defaultChecked />} label="Enable AI Features" />
              </Grid>
              <Grid size={6}>
                <FormControl fullWidth>
                  <InputLabel>AI Provider</InputLabel>
                  <Select label="AI Provider" defaultValue="OPENAI">
                    <MenuItem value="OPENAI">OpenAI</MenuItem>
                    <MenuItem value="AZURE_OPENAI">Azure OpenAI</MenuItem>
                    <MenuItem value="ANTHROPIC">Anthropic (Claude)</MenuItem>
                    <MenuItem value="GOOGLE">Google (Gemini)</MenuItem>
                    <MenuItem value="LOCAL">Local LLM (Ollama)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={6}>
                <FormControl fullWidth>
                  <InputLabel>Model</InputLabel>
                  <Select label="Model" defaultValue="gpt-4">
                    <MenuItem value="gpt-4">GPT-4</MenuItem>
                    <MenuItem value="gpt-4-turbo">GPT-4 Turbo</MenuItem>
                    <MenuItem value="gpt-3.5-turbo">GPT-3.5 Turbo</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={12}>
                <TextField fullWidth label="API Key" type="password" defaultValue="sk-***" />
              </Grid>
              <Grid size={6}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                  Temperature: <Chip label="0.7" size="small" sx={{ ml: 1 }} />
                </Typography>
                <Slider defaultValue={0.7} min={0} max={2} step={0.1} valueLabelDisplay="auto" />
              </Grid>
              <Grid size={6}>
                <TextField fullWidth label="Max Tokens" type="number" defaultValue="4096" />
              </Grid>
              <Grid size={12}><Divider /></Grid>
              <Grid size={12}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>AI Features Toggle</Typography>
                <FormControlLabel control={<Switch defaultChecked />} label="AI Schema Mapping" />
                <FormControlLabel control={<Switch defaultChecked />} label="AI Data Quality Scoring" />
                <FormControlLabel control={<Switch defaultChecked />} label="AI Troubleshooting" />
                <FormControlLabel control={<Switch />} label="AI Auto-Documentation" />
                <FormControlLabel control={<Switch />} label="AI Anomaly Detection" />
              </Grid>
            </Grid>
          </Box>
        );

      case 'notifications':
        return (
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>Notification Settings</Typography>
            <Grid container spacing={3}>
              <Grid size={12}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>Email Notifications</Typography>
                <FormControlLabel control={<Switch defaultChecked />} label="Job completion notifications" />
                <FormControlLabel control={<Switch defaultChecked />} label="Job failure alerts" />
                <FormControlLabel control={<Switch />} label="Daily summary reports" />
              </Grid>
              <Grid size={12}>
                <TextField fullWidth label="SMTP Server" defaultValue="" placeholder="smtp.example.com" />
              </Grid>
              <Grid size={12}><Divider /></Grid>
              <Grid size={12}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>Slack Integration</Typography>
                <FormControlLabel control={<Switch />} label="Enable Slack notifications" />
                <TextField fullWidth label="Webhook URL" placeholder="https://hooks.slack.com/..." sx={{ mt: 1 }} />
              </Grid>
              <Grid size={12}><Divider /></Grid>
              <Grid size={12}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>Microsoft Teams</Typography>
                <FormControlLabel control={<Switch />} label="Enable Teams notifications" />
                <TextField fullWidth label="Webhook URL" placeholder="https://outlook.office.com/..." sx={{ mt: 1 }} />
              </Grid>
            </Grid>
          </Box>
        );

      case 'monitoring':
        return (
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>Monitoring Settings</Typography>
            <Grid container spacing={3}>
              <Grid size={12}>
                <FormControlLabel control={<Switch defaultChecked />} label="Enable metrics collection" />
                <FormControlLabel control={<Switch defaultChecked />} label="Enable distributed tracing" />
              </Grid>
              <Grid size={6}>
                <TextField fullWidth label="Log Retention (days)" type="number" defaultValue="90" />
              </Grid>
              <Grid size={6}>
                <TextField fullWidth label="Metrics Retention (days)" type="number" defaultValue="30" />
              </Grid>
              <Grid size={6}>
                <FormControl fullWidth>
                  <InputLabel>Log Level</InputLabel>
                  <Select label="Log Level" defaultValue="INFO">
                    <MenuItem value="DEBUG">Debug</MenuItem>
                    <MenuItem value="INFO">Info</MenuItem>
                    <MenuItem value="WARN">Warning</MenuItem>
                    <MenuItem value="ERROR">Error</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={6}>
                <FormControl fullWidth>
                  <InputLabel>Alert Severity Threshold</InputLabel>
                  <Select label="Alert Severity Threshold" defaultValue="WARN">
                    <MenuItem value="INFO">Info & above</MenuItem>
                    <MenuItem value="WARN">Warning & above</MenuItem>
                    <MenuItem value="ERROR">Error only</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        );

      case 'backup':
        return (
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>Backup & Recovery</Typography>
            <Grid container spacing={3}>
              <Grid size={12}>
                <FormControlLabel control={<Switch defaultChecked />} label="Enable automatic backups" />
              </Grid>
              <Grid size={6}>
                <FormControl fullWidth>
                  <InputLabel>Backup Frequency</InputLabel>
                  <Select label="Backup Frequency" defaultValue="daily">
                    <MenuItem value="hourly">Hourly</MenuItem>
                    <MenuItem value="daily">Daily</MenuItem>
                    <MenuItem value="weekly">Weekly</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={6}>
                <TextField fullWidth label="Retention Period (days)" type="number" defaultValue="30" />
              </Grid>
              <Grid size={12}>
                <FormControlLabel control={<Switch defaultChecked />} label="Enable point-in-time recovery" />
              </Grid>
              <Grid size={12}><Divider /></Grid>
              <Grid size={12}>
                <Button variant="outlined">Trigger Manual Backup</Button>
              </Grid>
            </Grid>
          </Box>
        );

      default:
        return <Typography>Select a section from the left menu.</Typography>;
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>Settings</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Configure platform settings and preferences
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<SaveOutlined />}>
          Save Changes
        </Button>
      </Box>

      <Grid container spacing={2.5}>
        {/* Left Navigation */}
        <Grid size={{ xs: 12, md: 3 }}>
          <Card>
            <List sx={{ py: 1 }}>
              {sections.map((section) => (
                <ListItemButton
                  key={section.id}
                  selected={activeSection === section.id}
                  onClick={() => setActiveSection(section.id)}
                  sx={{ borderRadius: '10px', mx: 1, my: 0.25 }}
                >
                  <ListItemIcon sx={{ minWidth: 36, color: activeSection === section.id ? brand.primary : 'text.secondary' }}>
                    {section.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={section.label}
                    primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: activeSection === section.id ? 600 : 400 }}
                  />
                </ListItemButton>
              ))}
            </List>
          </Card>
        </Grid>

        {/* Right Content */}
        <Grid size={{ xs: 12, md: 9 }}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              {renderSection()}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SettingsPage;
