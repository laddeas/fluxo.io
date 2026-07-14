// ============================================================================
// DataFusion AI — UI State Slice
// Manages sidebar, theme, notifications, and AI panel state
// ============================================================================

import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  read: boolean;
  timestamp: string;
}

interface UIState {
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  aiPanelOpen: boolean;
  themeMode: 'dark' | 'light';
  notifications: Notification[];
  unreadCount: number;
  currentPage: string;
  breadcrumbs: { label: string; path?: string }[];
  isLoading: boolean;
  globalSearch: string;
}

const initialState: UIState = {
  sidebarOpen: true,
  sidebarCollapsed: false,
  aiPanelOpen: false,
  themeMode: 'dark',
  notifications: [
    {
      id: '1',
      title: 'Welcome to DataFusion AI',
      message: 'Your enterprise integration platform is ready. Start by creating your first connector.',
      type: 'info',
      read: false,
      timestamp: new Date().toISOString(),
    },
    {
      id: '2',
      title: 'System Health: All Systems Operational',
      message: 'All services are running optimally. Database latency: 2ms, API response: 45ms.',
      type: 'success',
      read: false,
      timestamp: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: '3',
      title: 'New Connector Available',
      message: 'Salesforce Connector v2.1 is now available in the marketplace.',
      type: 'info',
      read: false,
      timestamp: new Date(Date.now() - 7200000).toISOString(),
    },
  ],
  unreadCount: 3,
  currentPage: 'home',
  breadcrumbs: [],
  isLoading: false,
  globalSearch: '',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    toggleSidebarCollapsed: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    toggleAIPanel: (state) => {
      state.aiPanelOpen = !state.aiPanelOpen;
    },
    setAIPanelOpen: (state, action: PayloadAction<boolean>) => {
      state.aiPanelOpen = action.payload;
    },
    setThemeMode: (state, action: PayloadAction<'dark' | 'light'>) => {
      state.themeMode = action.payload;
    },
    setCurrentPage: (state, action: PayloadAction<string>) => {
      state.currentPage = action.payload;
    },
    setBreadcrumbs: (state, action: PayloadAction<{ label: string; path?: string }[]>) => {
      state.breadcrumbs = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setGlobalSearch: (state, action: PayloadAction<string>) => {
      state.globalSearch = action.payload;
    },
    addNotification: (state, action: PayloadAction<Omit<Notification, 'id' | 'timestamp' | 'read'>>) => {
      const notification: Notification = {
        ...action.payload,
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        read: false,
      };
      state.notifications.unshift(notification);
      state.unreadCount += 1;
    },
    markNotificationRead: (state, action: PayloadAction<string>) => {
      const notif = state.notifications.find((n) => n.id === action.payload);
      if (notif && !notif.read) {
        notif.read = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    markAllNotificationsRead: (state) => {
      state.notifications.forEach((n) => (n.read = true));
      state.unreadCount = 0;
    },
    clearNotifications: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
    },
  },
});

export const {
  toggleSidebar,
  toggleSidebarCollapsed,
  toggleAIPanel,
  setAIPanelOpen,
  setThemeMode,
  setCurrentPage,
  setBreadcrumbs,
  setLoading,
  setGlobalSearch,
  addNotification,
  markNotificationRead,
  markAllNotificationsRead,
  clearNotifications,
} = uiSlice.actions;

export default uiSlice.reducer;
