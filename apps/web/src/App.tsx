// ============================================================================
// DataFusion AI — Main Application
// Root component with routing, theme, state provider, and auth guards
// ============================================================================

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Provider } from 'react-redux';
import { theme } from './theme/theme';
import { store } from './store';
import MainLayout from './components/layout/MainLayout';
import HomePage from './pages/HomePage';
import InterfacePage from './pages/InterfacePage';
import DomainsPage from './pages/DomainsPage';
import UsersPage from './pages/UsersPage';
import JobHistoryPage from './pages/JobHistoryPage';
import SettingsPage from './pages/SettingsPage';
import ConnectorsPage from './pages/ConnectorsPage';
import MonitoringPage from './pages/MonitoringPage';
import LoginPage from './pages/LoginPage';
import { Auth0ProviderWithHistory } from './components/auth/Auth0ProviderWithHistory';

// Route protection guard
const ProtectedRoute: React.FC = () => {
  const token = localStorage.getItem('df_token');
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <Auth0ProviderWithHistory>
            <Routes>
            <Route path="/login" element={<LoginPage />} />
            
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<MainLayout />}>
                <Route index element={<HomePage />} />
                <Route path="interfaces" element={<InterfacePage />} />
                <Route path="domains" element={<DomainsPage />} />
                <Route path="users" element={<UsersPage />} />
                <Route path="jobs" element={<JobHistoryPage />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="connectors" element={<ConnectorsPage />} />
                <Route path="monitoring" element={<MonitoringPage />} />
              </Route>
            </Route>

            {/* Fallback redirection */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          </Auth0ProviderWithHistory>
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
