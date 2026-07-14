// ============================================================================
// DataFusion AI — Top Header Bar
// Search, notifications, user profile
// ============================================================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  InputBase,
  Badge,
  Avatar,
  Box,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  ListItemText,
  Popover,
  List,
  ListItem,
  ListItemButton,
  Button,
  Chip,
  alpha,
} from '@mui/material';
import {
  SearchOutlined,
  NotificationsOutlined,
  PersonOutlined,
  LogoutOutlined,
  SettingsOutlined,
  DarkModeOutlined,
  LightModeOutlined,
  CheckCircleOutlined,
  ErrorOutlined,
  WarningAmberOutlined,
  InfoOutlined,
  DoneAllOutlined,
} from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '../../store';
import {
  setGlobalSearch,
  markNotificationRead,
  markAllNotificationsRead,
} from '../../store/slices/uiSlice';
import { brand } from '../../theme/theme';

const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { globalSearch, notifications, unreadCount } = useAppSelector((s) => s.ui);
  const [profileAnchor, setProfileAnchor] = useState<null | HTMLElement>(null);
  const [notifAnchor, setNotifAnchor] = useState<null | HTMLElement>(null);

  const userStr = localStorage.getItem('df_user');
  const user = userStr ? JSON.parse(userStr) : { firstName: 'System', lastName: 'Administrator', email: 'admin@datafusion.io' };
  const userInitials = `${user.firstName?.[0] || 'S'}${user.lastName?.[0] || 'A'}`.toUpperCase();

  const handleLogout = () => {
    localStorage.removeItem('df_token');
    localStorage.removeItem('df_user');
    setProfileAnchor(null);
    navigate('/login');
  };

  const notifIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircleOutlined sx={{ color: brand.success, fontSize: 20 }} />;
      case 'error': return <ErrorOutlined sx={{ color: brand.error, fontSize: 20 }} />;
      case 'warning': return <WarningAmberOutlined sx={{ color: brand.warning, fontSize: 20 }} />;
      default: return <InfoOutlined sx={{ color: brand.info, fontSize: 20 }} />;
    }
  };

  const formatTime = (ts: string) => {
    const diff = Date.now() - new Date(ts).getTime();
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return `${Math.floor(diff / 86400000)}d ago`;
  };

  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar sx={{ gap: 2 }}>
        {/* Spacer for sidebar */}
        <Box sx={{ flex: 1 }} />

        {/* Search Bar */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            bgcolor: (theme) => alpha(theme.palette.background.default, 0.6),
            borderRadius: '12px',
            border: '1px solid',
            borderColor: 'divider',
            px: 2,
            py: 0.5,
            width: 400,
            transition: 'all 0.2s',
            '&:focus-within': {
              borderColor: brand.primary,
              boxShadow: `0 0 0 2px ${alpha(brand.primary, 0.15)}`,
            },
          }}
        >
          <SearchOutlined sx={{ color: 'text.secondary', fontSize: 20 }} />
          <InputBase
            placeholder="Search integrations, connectors, jobs..."
            value={globalSearch}
            onChange={(e) => dispatch(setGlobalSearch(e.target.value))}
            sx={{
              flex: 1,
              fontSize: '0.875rem',
              '& input::placeholder': {
                color: 'text.disabled',
                opacity: 1,
              },
            }}
          />
          <Chip
            label="⌘K"
            size="small"
            sx={{
              height: 22,
              fontSize: '0.65rem',
              bgcolor: 'action.hover',
              fontWeight: 700,
            }}
          />
        </Box>

        <Box sx={{ flex: 1 }} />

        {/* Notifications */}
        <IconButton
          onClick={(e) => setNotifAnchor(e.currentTarget)}
          sx={{
            color: 'text.secondary',
            '&:hover': { color: 'text.primary' },
          }}
        >
          <Badge
            badgeContent={unreadCount}
            color="error"
            sx={{
              '& .MuiBadge-badge': {
                fontSize: '0.65rem',
                fontWeight: 700,
                minWidth: 18,
                height: 18,
              },
            }}
          >
            <NotificationsOutlined />
          </Badge>
        </IconButton>

        <Popover
          open={Boolean(notifAnchor)}
          anchorEl={notifAnchor}
          onClose={() => setNotifAnchor(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          slotProps={{
            paper: {
              sx: {
                width: 380,
                maxHeight: 480,
                mt: 1,
                borderRadius: '16px',
              },
            },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              p: 2,
              pb: 1,
            }}
          >
            <Typography variant="h6" sx={{ fontSize: '1rem' }}>
              Notifications
            </Typography>
            <Button
              size="small"
              startIcon={<DoneAllOutlined />}
              onClick={() => dispatch(markAllNotificationsRead())}
              sx={{ fontSize: '0.75rem' }}
            >
              Mark all read
            </Button>
          </Box>
          <Divider />
          <List dense sx={{ py: 0 }}>
            {notifications.length === 0 ? (
              <ListItem>
                <ListItemText
                  primary="No notifications"
                  sx={{ textAlign: 'center', color: 'text.secondary' }}
                />
              </ListItem>
            ) : (
              notifications.slice(0, 8).map((n) => (
                <ListItemButton
                  key={n.id}
                  onClick={() => dispatch(markNotificationRead(n.id))}
                  sx={{
                    py: 1.5,
                    px: 2,
                    opacity: n.read ? 0.6 : 1,
                    bgcolor: n.read ? 'transparent' : alpha(brand.primary, 0.04),
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    {notifIcon(n.type)}
                  </ListItemIcon>
                  <ListItemText
                    primary={n.title}
                    secondary={n.message}
                    primaryTypographyProps={{
                      fontSize: '0.825rem',
                      fontWeight: n.read ? 400 : 600,
                    }}
                    secondaryTypographyProps={{
                      fontSize: '0.75rem',
                      noWrap: true,
                    }}
                  />
                  <Typography variant="caption" sx={{ ml: 1, whiteSpace: 'nowrap', fontSize: '0.65rem' }}>
                    {formatTime(n.timestamp)}
                  </Typography>
                </ListItemButton>
              ))
            )}
          </List>
        </Popover>

        {/* User Profile */}
        <IconButton onClick={(e) => setProfileAnchor(e.currentTarget)}>
          <Avatar
            sx={{
              width: 34,
              height: 34,
              fontSize: '0.85rem',
              fontWeight: 700,
              background: `linear-gradient(135deg, ${brand.primary} 0%, ${brand.secondary} 100%)`,
            }}
          >
            {userInitials}
          </Avatar>
        </IconButton>

        <Menu
          anchorEl={profileAnchor}
          open={Boolean(profileAnchor)}
          onClose={() => setProfileAnchor(null)}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          slotProps={{
            paper: {
              sx: { width: 220, mt: 1, borderRadius: '12px' },
            },
          }}
        >
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.primary' }}>
              {user.firstName} {user.lastName}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {user.email}
            </Typography>
          </Box>
          <Divider />
          <MenuItem onClick={() => setProfileAnchor(null)}>
            <ListItemIcon><PersonOutlined fontSize="small" /></ListItemIcon>
            <ListItemText primaryTypographyProps={{ fontSize: '0.85rem' }}>Profile</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => setProfileAnchor(null)}>
            <ListItemIcon><SettingsOutlined fontSize="small" /></ListItemIcon>
            <ListItemText primaryTypographyProps={{ fontSize: '0.85rem' }}>Settings</ListItemText>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
            <ListItemIcon><LogoutOutlined fontSize="small" sx={{ color: 'error.main' }} /></ListItemIcon>
            <ListItemText primaryTypographyProps={{ fontSize: '0.85rem' }}>Sign Out</ListItemText>
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
