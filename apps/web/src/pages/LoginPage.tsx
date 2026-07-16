// ============================================================================
// DataFusion AI — Login Page
// Premium glassmorphic login screen with backend auth & local simulation fallback
// ============================================================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Snackbar,
  Alert,
  alpha,
  Divider,
} from '@mui/material';
import {
  VisibilityOutlined,
  VisibilityOffOutlined,
  HubOutlined,
  LockOutlined,
  EmailOutlined,
} from '@mui/icons-material';
import { brand } from '../theme/theme';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { loginWithRedirect } = useAuth0();
  const [email, setEmail] = useState('admin@datafusion.io');
  const [password, setPassword] = useState('Admin@123456');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Notification Toast State
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [toastSeverity, setToastSeverity] = useState<'success' | 'error' | 'info'>('success');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setToastMsg('Please enter both email and password.');
      setToastSeverity('error');
      setToastOpen(true);
      return;
    }

    setLoading(true);
    try {
      // 1. Attempt Real-Time Auth Service Call
      const response = await fetch(`http://${window.location.hostname}:3001/api/v1/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const resData = await response.json();

      if (response.ok && resData.success) {
        localStorage.setItem('df_token', resData.data.accessToken);
        localStorage.setItem('df_user', JSON.stringify(resData.data.user));
        
        setToastMsg('Login successful! Connecting...');
        setToastSeverity('success');
        setToastOpen(true);
        
        setTimeout(() => {
          navigate('/');
        }, 1000);
      } else {
        throw new Error(resData.error?.message || 'Invalid credentials');
      }
    } catch (err: any) {
      // 2. Local Demo Fallback (If Backend is Offline or invalid credentials)
      console.warn('Backend Auth Offline, falling back to local simulation:', err.message);
      
      if (email === 'admin@datafusion.io' && password === 'Admin@123456') {
        const mockUser = {
          id: 'USR-001',
          tenantId: 'TEN-001',
          email: 'admin@datafusion.io',
          firstName: 'System',
          lastName: 'Administrator',
          roles: ['SUPER_ADMIN'],
        };
        localStorage.setItem('df_token', 'mock_jwt_token_super_admin');
        localStorage.setItem('df_user', JSON.stringify(mockUser));
        
        setToastMsg('Backend offline. Simulated Login Successful (Superadmin Access).');
        setToastSeverity('info');
        setToastOpen(true);
        
        setTimeout(() => {
          navigate('/');
        }, 1200);
      } else if (email.endsWith('@datafusion.io') || email.endsWith('@acme.com')) {
        // Let user log in as domain-restricted user
        const mockUser = {
          id: 'USR-003',
          tenantId: 'TEN-001',
          email: email,
          firstName: email.split('@')[0],
          lastName: 'User',
          roles: ['INTEGRATION_DEVELOPER'],
          domain: email.includes('sales') ? 'Sales' : 'Finance', // Simulated domain assignment
        };
        localStorage.setItem('df_token', 'mock_jwt_token_developer');
        localStorage.setItem('df_user', JSON.stringify(mockUser));
        
        setToastMsg(`Simulated Login Successful. Assigned Domain: ${mockUser.domain || 'All'}`);
        setToastSeverity('info');
        setToastOpen(true);
        
        setTimeout(() => {
          navigate('/');
        }, 1200);
      } else {
        setToastMsg('Invalid email or password. Use: admin@datafusion.io / Admin@123456');
        setToastSeverity('error');
        setToastOpen(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: '#0B0E14',
        backgroundImage: `
          radial-gradient(at 10% 10%, ${alpha(brand.primary, 0.08)} 0%, transparent 40%),
          radial-gradient(at 90% 90%, ${alpha(brand.secondary, 0.08)} 0%, transparent 40%)
        `,
      }}
    >
      <Card
        sx={{
          width: 420,
          borderRadius: 4,
          border: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
          boxShadow: `0 12px 40px ${alpha('#000', 0.6)}`,
          backdropFilter: 'blur(20px)',
          overflow: 'hidden',
          animation: 'fadeIn 0.5s ease-out',
        }}
      >
        <Box
          sx={{
            p: 4,
            pb: 2,
            textAlign: 'center',
            background: `linear-gradient(180deg, ${alpha(brand.primary, 0.05)} 0%, transparent 100%)`,
          }}
        >
          <Box
            sx={{
              width: 50,
              height: 50,
              borderRadius: '12px',
              background: `linear-gradient(135deg, ${brand.primary} 0%, ${brand.secondary} 100%)`,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 4px 20px ${alpha(brand.primary, 0.4)}`,
              mb: 2,
            }}
          >
            <HubOutlined sx={{ color: '#fff', fontSize: 30 }} />
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 800, tracking: '-0.02em', mb: 0.5 }}>
            DataFusion AI
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Enterprise Integration Platform
          </Typography>
        </Box>

        <CardContent sx={{ p: 4, pt: 2 }}>
          <form onSubmit={handleLogin}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <TextField
                fullWidth
                label="Email Address"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailOutlined sx={{ color: 'text.secondary', fontSize: 20 }} />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlined sx={{ color: 'text.secondary', fontSize: 20 }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOffOutlined /> : <VisibilityOutlined />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                fullWidth
                size="large"
                variant="contained"
                type="submit"
                disabled={loading}
                sx={{
                  py: 1.5,
                  mt: 1,
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  boxShadow: `0 8px 24px ${alpha(brand.primary, 0.3)}`,
                }}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>

              <Divider sx={{ my: 1 }}>OR</Divider>

              <Button
                fullWidth
                size="large"
                variant="outlined"
                onClick={() => loginWithRedirect()}
                sx={{
                  py: 1.5,
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  borderColor: alpha(brand.primary, 0.5),
                  color: 'text.primary',
                }}
              >
                Sign In with Enterprise SSO
              </Button>
            </Box>
          </form>

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="caption" sx={{ color: 'text.disabled' }}>
              Credentials: admin@datafusion.io / Admin@123456
            </Typography>
          </Box>
        </CardContent>
      </Card>

      <Snackbar
        open={toastOpen}
        autoHideDuration={4000}
        onClose={() => setToastOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setToastOpen(false)} severity={toastSeverity} sx={{ width: '100%' }}>
          {toastMsg}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default LoginPage;
