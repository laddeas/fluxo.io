// ============================================================================
// DataFusion AI — Material UI Theme Configuration
// Premium dark theme with glassmorphism and vibrant gradients
// ============================================================================

import { createTheme, alpha } from '@mui/material/styles';

// Brand Colors
const brand = {
  primary: '#6366F1',     // Indigo
  secondary: '#8B5CF6',   // Violet
  accent: '#06B6D4',      // Cyan
  success: '#10B981',     // Emerald
  warning: '#F59E0B',     // Amber
  error: '#EF4444',       // Red
  info: '#3B82F6',        // Blue
};

// Dark palette
const darkPalette = {
  bg: {
    default: '#0B0E14',
    paper: '#111827',
    elevated: '#1A1F2E',
    surface: '#1E2536',
    hover: '#252D3D',
  },
  text: {
    primary: '#F1F5F9',
    secondary: '#94A3B8',
    disabled: '#475569',
  },
  border: {
    default: '#1E293B',
    hover: '#334155',
  },
};

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: brand.primary,
      light: '#818CF8',
      dark: '#4F46E5',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: brand.secondary,
      light: '#A78BFA',
      dark: '#7C3AED',
      contrastText: '#FFFFFF',
    },
    success: {
      main: brand.success,
      light: '#34D399',
      dark: '#059669',
    },
    warning: {
      main: brand.warning,
      light: '#FBBF24',
      dark: '#D97706',
    },
    error: {
      main: brand.error,
      light: '#F87171',
      dark: '#DC2626',
    },
    info: {
      main: brand.info,
      light: '#60A5FA',
      dark: '#2563EB',
    },
    background: {
      default: darkPalette.bg.default,
      paper: darkPalette.bg.paper,
    },
    text: {
      primary: darkPalette.text.primary,
      secondary: darkPalette.text.secondary,
      disabled: darkPalette.text.disabled,
    },
    divider: darkPalette.border.default,
  },

  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica Neue", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.25rem',
      letterSpacing: '-0.025em',
      lineHeight: 1.2,
    },
    h2: {
      fontWeight: 700,
      fontSize: '1.875rem',
      letterSpacing: '-0.025em',
      lineHeight: 1.3,
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.5rem',
      letterSpacing: '-0.015em',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.25rem',
      letterSpacing: '-0.01em',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.125rem',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
    },
    subtitle1: {
      fontWeight: 500,
      fontSize: '0.95rem',
      color: darkPalette.text.secondary,
    },
    subtitle2: {
      fontWeight: 500,
      fontSize: '0.85rem',
      color: darkPalette.text.secondary,
    },
    body1: {
      fontSize: '0.9375rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    button: {
      fontWeight: 600,
      textTransform: 'none' as const,
      letterSpacing: '0.01em',
    },
    caption: {
      fontSize: '0.75rem',
      color: darkPalette.text.secondary,
    },
    overline: {
      fontSize: '0.6875rem',
      fontWeight: 700,
      letterSpacing: '0.08em',
      textTransform: 'uppercase' as const,
      color: darkPalette.text.secondary,
    },
  },

  shape: {
    borderRadius: 12,
  },

  shadows: [
    'none',
    `0 1px 3px ${alpha('#000', 0.3)}`,
    `0 2px 6px ${alpha('#000', 0.35)}`,
    `0 4px 12px ${alpha('#000', 0.4)}`,
    `0 8px 24px ${alpha('#000', 0.45)}`,
    `0 12px 32px ${alpha('#000', 0.5)}`,
    `0 16px 40px ${alpha('#000', 0.55)}`,
    `0 20px 48px ${alpha('#000', 0.6)}`,
    `0 1px 3px ${alpha('#000', 0.3)}`,
    `0 2px 6px ${alpha('#000', 0.35)}`,
    `0 4px 12px ${alpha('#000', 0.4)}`,
    `0 8px 24px ${alpha('#000', 0.45)}`,
    `0 12px 32px ${alpha('#000', 0.5)}`,
    `0 16px 40px ${alpha('#000', 0.55)}`,
    `0 20px 48px ${alpha('#000', 0.6)}`,
    `0 24px 56px ${alpha('#000', 0.65)}`,
    `0 1px 3px ${alpha('#000', 0.3)}`,
    `0 2px 6px ${alpha('#000', 0.35)}`,
    `0 4px 12px ${alpha('#000', 0.4)}`,
    `0 8px 24px ${alpha('#000', 0.45)}`,
    `0 12px 32px ${alpha('#000', 0.5)}`,
    `0 16px 40px ${alpha('#000', 0.55)}`,
    `0 20px 48px ${alpha('#000', 0.6)}`,
    `0 24px 56px ${alpha('#000', 0.65)}`,
    `0 28px 64px ${alpha('#000', 0.7)}`,
  ],

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: darkPalette.bg.default,
          backgroundImage: `
            radial-gradient(at 20% 20%, ${alpha(brand.primary, 0.04)} 0%, transparent 50%),
            radial-gradient(at 80% 80%, ${alpha(brand.secondary, 0.03)} 0%, transparent 50%)
          `,
          scrollbarWidth: 'thin',
          scrollbarColor: `${darkPalette.border.hover} transparent`,
          '&::-webkit-scrollbar': {
            width: 6,
            height: 6,
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            background: darkPalette.border.hover,
            borderRadius: 3,
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: '8px 20px',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: `0 4px 16px ${alpha(brand.primary, 0.25)}`,
          },
        },
        contained: {
          background: `linear-gradient(135deg, ${brand.primary} 0%, ${brand.secondary} 100%)`,
          '&:hover': {
            background: `linear-gradient(135deg, ${brand.primary} 20%, ${brand.secondary} 120%)`,
          },
        },
        outlined: {
          borderColor: darkPalette.border.hover,
          '&:hover': {
            borderColor: brand.primary,
            backgroundColor: alpha(brand.primary, 0.08),
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: alpha(darkPalette.bg.paper, 0.7),
          backdropFilter: 'blur(20px)',
          border: `1px solid ${darkPalette.border.default}`,
          borderRadius: 16,
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            borderColor: alpha(brand.primary, 0.3),
            boxShadow: `0 8px 32px ${alpha(brand.primary, 0.1)}`,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: darkPalette.bg.paper,
          backgroundImage: 'none',
          border: `1px solid ${darkPalette.border.default}`,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: darkPalette.bg.paper,
          borderRight: `1px solid ${darkPalette.border.default}`,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: alpha(darkPalette.bg.paper, 0.85),
          backdropFilter: 'blur(20px)',
          borderBottom: `1px solid ${darkPalette.border.default}`,
          boxShadow: 'none',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
            '& fieldset': {
              borderColor: darkPalette.border.default,
            },
            '&:hover fieldset': {
              borderColor: darkPalette.border.hover,
            },
            '&.Mui-focused fieldset': {
              borderColor: brand.primary,
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 600,
          fontSize: '0.75rem',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '0.9rem',
          minHeight: 48,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: darkPalette.border.default,
        },
        head: {
          fontWeight: 700,
          fontSize: '0.75rem',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          color: darkPalette.text.secondary,
          backgroundColor: darkPalette.bg.elevated,
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          margin: '2px 8px',
          '&.Mui-selected': {
            backgroundColor: alpha(brand.primary, 0.12),
            '&:hover': {
              backgroundColor: alpha(brand.primary, 0.18),
            },
            '& .MuiListItemIcon-root': {
              color: brand.primary,
            },
            '& .MuiListItemText-primary': {
              color: brand.primary,
              fontWeight: 600,
            },
          },
          '&:hover': {
            backgroundColor: darkPalette.bg.hover,
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: darkPalette.bg.elevated,
          backgroundImage: 'none',
          borderRadius: 20,
          border: `1px solid ${darkPalette.border.default}`,
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: darkPalette.bg.elevated,
          border: `1px solid ${darkPalette.border.default}`,
          borderRadius: 8,
          fontSize: '0.8rem',
          fontWeight: 500,
        },
      },
    },
  },
});

// Export brand colors for use in custom components
export { brand, darkPalette };
