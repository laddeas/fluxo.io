// ============================================================================
// DataFusion AI — Main Layout
// Shell layout with sidebar, header, and content area
// ============================================================================

import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Toolbar } from '@mui/material';
import Sidebar from './Sidebar';
import Header from './Header';
import AIAssistantPanel from '../ai/AIAssistantPanel';

const MainLayout: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Header />
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          overflow: 'auto',
          position: 'relative',
        }}
      >
        <Toolbar /> {/* Spacer for fixed AppBar */}
        <Outlet />
      </Box>
      <AIAssistantPanel />
    </Box>
  );
};

export default MainLayout;
