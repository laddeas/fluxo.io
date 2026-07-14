// ============================================================================
// DataFusion AI — Sidebar Navigation
// Collapsible sidebar with animated icons and active state tracking
// ============================================================================

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  IconButton,
  Tooltip,
  alpha,
} from '@mui/material';
import {
  HomeOutlined,
  SwapHorizOutlined,
  PeopleOutlined,
  SettingsOutlined,
  HistoryOutlined,
  SmartToyOutlined,
  MonitorHeartOutlined,
  ExtensionOutlined,
  ChevronLeft,
  ChevronRight,
  HubOutlined,
  DomainOutlined,
} from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '../../store';
import { toggleSidebarCollapsed } from '../../store/slices/uiSlice';
import { brand } from '../../theme/theme';

const DRAWER_WIDTH = 260;
const COLLAPSED_WIDTH = 72;

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactElement;
  path: string;
  badge?: number;
}

const navItems: NavItem[] = [
  { id: 'home', label: 'Home', icon: <HomeOutlined />, path: '/' },
  { id: 'interfaces', label: 'Interfaces', icon: <SwapHorizOutlined />, path: '/interfaces' },
  { id: 'domains', label: 'Domains', icon: <DomainOutlined />, path: '/domains' },
  { id: 'users', label: 'Users', icon: <PeopleOutlined />, path: '/users' },
  { id: 'jobs', label: 'Job History', icon: <HistoryOutlined />, path: '/jobs' },
  { id: 'connectors', label: 'Connectors', icon: <ExtensionOutlined />, path: '/connectors' },
  { id: 'monitoring', label: 'Monitoring', icon: <MonitorHeartOutlined />, path: '/monitoring' },
  { id: 'settings', label: 'Settings', icon: <SettingsOutlined />, path: '/settings' },
];

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const collapsed = useAppSelector((s) => s.ui.sidebarCollapsed);

  const width = collapsed ? COLLAPSED_WIDTH : DRAWER_WIDTH;

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width,
          boxSizing: 'border-box',
          transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          overflow: 'hidden',
          borderRight: '1px solid',
          borderColor: 'divider',
          background: (theme) =>
            `linear-gradient(180deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${theme.palette.background.paper} 100%)`,
        },
      }}
    >
      {/* Logo Area */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          px: collapsed ? 1.5 : 2.5,
          py: 2,
          minHeight: 64,
          justifyContent: collapsed ? 'center' : 'flex-start',
        }}
      >
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: '10px',
            background: `linear-gradient(135deg, ${brand.primary} 0%, ${brand.secondary} 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 4px 16px ${alpha(brand.primary, 0.35)}`,
            flexShrink: 0,
          }}
        >
          <HubOutlined sx={{ color: '#fff', fontSize: 22 }} />
        </Box>
        {!collapsed && (
          <Box sx={{ overflow: 'hidden' }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                fontSize: '1.05rem',
                background: `linear-gradient(135deg, ${brand.primary} 0%, ${brand.accent} 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                whiteSpace: 'nowrap',
              }}
            >
              DataFusion AI
            </Typography>
            <Typography
              variant="caption"
              sx={{ fontSize: '0.65rem', color: 'text.secondary', letterSpacing: '0.05em' }}
            >
              INTEGRATION PLATFORM
            </Typography>
          </Box>
        )}
      </Box>

      <Divider sx={{ mx: collapsed ? 1 : 2, opacity: 0.5 }} />

      {/* Navigation Items */}
      <List sx={{ flex: 1, py: 1.5 }}>
        {navItems.map((item) => {
          const active = isActive(item.path);
          return (
            <Tooltip
              key={item.id}
              title={collapsed ? item.label : ''}
              placement="right"
              arrow
            >
              <ListItemButton
                selected={active}
                onClick={() => navigate(item.path)}
                sx={{
                  minHeight: 44,
                  px: collapsed ? 2 : 2.5,
                  mx: collapsed ? 0.5 : 1,
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  ...(active && {
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      left: 0,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: 3,
                      height: '60%',
                      borderRadius: '0 4px 4px 0',
                      background: `linear-gradient(180deg, ${brand.primary}, ${brand.secondary})`,
                    },
                  }),
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: collapsed ? 0 : 40,
                    justifyContent: 'center',
                    color: active ? brand.primary : 'text.secondary',
                    transition: 'color 0.2s',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {!collapsed && (
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontSize: '0.875rem',
                      fontWeight: active ? 600 : 400,
                    }}
                  />
                )}
              </ListItemButton>
            </Tooltip>
          );
        })}
      </List>

      <Divider sx={{ mx: collapsed ? 1 : 2, opacity: 0.5 }} />

      {/* AI Assistant Quick Access */}
      <Box sx={{ p: collapsed ? 1 : 2 }}>
        <Tooltip title={collapsed ? 'AI Assistant' : ''} placement="right" arrow>
          <ListItemButton
            onClick={() => dispatch({ type: 'ui/toggleAIPanel' })}
            sx={{
              borderRadius: '12px',
              background: (theme) => alpha(brand.accent, 0.08),
              border: `1px solid ${alpha(brand.accent, 0.15)}`,
              justifyContent: collapsed ? 'center' : 'flex-start',
              px: collapsed ? 1.5 : 2,
              '&:hover': {
                background: (theme) => alpha(brand.accent, 0.15),
                borderColor: alpha(brand.accent, 0.3),
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: collapsed ? 0 : 36,
                color: brand.accent,
              }}
            >
              <SmartToyOutlined />
            </ListItemIcon>
            {!collapsed && (
              <ListItemText
                primary="AI Assistant"
                primaryTypographyProps={{
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: brand.accent,
                }}
              />
            )}
          </ListItemButton>
        </Tooltip>
      </Box>

      {/* Collapse Toggle */}
      <Box sx={{ p: 1, display: 'flex', justifyContent: 'center' }}>
        <IconButton
          onClick={() => dispatch(toggleSidebarCollapsed())}
          size="small"
          sx={{
            color: 'text.secondary',
            '&:hover': { color: 'text.primary', bgcolor: 'action.hover' },
          }}
        >
          {collapsed ? <ChevronRight fontSize="small" /> : <ChevronLeft fontSize="small" />}
        </IconButton>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
