import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',        // White sections are the dominant mode
    primary: {
      main: '#7c4dff',
      light: '#b47cff',
      dark: '#3f1dcb',
      contrastText: '#fff',
    },
    secondary: {
      main: '#00b8d9',
      light: '#67e8f9',
      dark: '#0097b2',
      contrastText: '#fff',
    },
    background: {
      default: '#f8f9fa',
      paper: '#ffffff',
    },
    text: {
      primary: '#111827',
      secondary: '#6b7280',
    },
    error: { main: '#ef4444' },
  },
  typography: {
    fontFamily: '"Outfit", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 900 },
    h4: { fontWeight: 800 },
    h6: { fontWeight: 700 },
    subtitle1: { fontWeight: 600 },
    body1: { lineHeight: 1.7 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 700,
          transition: 'all 0.25s ease',
          '&:hover': { transform: 'translateY(-1px)' },
        },
        containedPrimary: {
          boxShadow: '0 4px 14px rgba(124,77,255,0.35)',
          '&:hover': { boxShadow: '0 8px 24px rgba(124,77,255,0.45)' },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 20,
          boxShadow: '0 24px 60px rgba(0,0,0,0.18)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
            '&:hover fieldset': { borderColor: '#7c4dff' },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 700 },
      },
    },
  },
  shape: { borderRadius: 12 },
});

export default theme;
