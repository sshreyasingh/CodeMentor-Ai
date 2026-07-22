import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#818cf8', light: '#a5b4fc', dark: '#6366f1' },
    secondary: { main: '#22d3ee', light: '#67e8f9', dark: '#06b6d4' },
    background: {
      default: '#050816',
      paper: '#0B1120',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#94A3B8',
    },
    divider: 'rgba(255,255,255,0.08)',
    error: { main: '#ef4444' },
    warning: { main: '#f59e0b' },
    success: { main: '#22c55e' },
    info: { main: '#22d3ee' },
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    h1: { fontWeight: 800, letterSpacing: '-0.04em' },
    h2: { fontWeight: 800, letterSpacing: '-0.04em' },
    h3: { fontWeight: 700, letterSpacing: '-0.03em' },
    h4: { fontWeight: 700, letterSpacing: '-0.02em' },
    h5: { fontWeight: 600, letterSpacing: '-0.01em' },
    h6: { fontWeight: 600 },
    body1: { fontWeight: 400, letterSpacing: '-0.01em' },
    body2: { fontWeight: 400 },
    button: { fontWeight: 600, letterSpacing: '-0.01em' },
    caption: { fontWeight: 400 },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#050816',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
        },
        '::-webkit-scrollbar': { width: 6, height: 6 },
        '::-webkit-scrollbar-track': { background: 'transparent' },
        '::-webkit-scrollbar-thumb': { background: 'rgba(255,255,255,0.08)', borderRadius: 3, '&:hover': { background: 'rgba(255,255,255,0.14)' } },
        '*:focus-visible': { outline: '2px solid #818cf8', outlineOffset: 2, borderRadius: 4 },
        html: { scrollbarGutter: 'stable' },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: 'rgba(12,18,35,0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 14,
          boxShadow: '0 4px 24px rgba(0,0,0,0.3), 0 1px 2px rgba(0,0,0,0.2)',
          transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            borderColor: 'rgba(129,140,248,0.25)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.35), 0 1px 3px rgba(0,0,0,0.2), 0 0 0 1px rgba(129,140,248,0.08)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 600, borderRadius: 10, fontSize: 14, padding: '8px 18px', transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)' },
        contained: { boxShadow: '0 2px 8px rgba(99,102,241,0.3)', '&:hover': { boxShadow: '0 4px 16px rgba(99,102,241,0.4)', transform: 'translateY(-1px)' } },
        outlined: { borderColor: 'rgba(255,255,255,0.12)', '&:hover': { borderColor: 'rgba(129,140,248,0.4)', backgroundColor: 'rgba(129,140,248,0.06)' } },
      },
    },
    MuiChip: { styleOverrides: { root: { borderRadius: 8, fontWeight: 500 } } },
    MuiDialog: {
      styleOverrides: {
        paper: { backgroundImage: 'none', backgroundColor: 'rgba(12,18,35,0.98)', backdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, boxShadow: '0 24px 80px rgba(0,0,0,0.5)' },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': { borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.03)', '& fieldset': { borderColor: 'rgba(255,255,255,0.08)' }, '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.15)' }, '&.Mui-focused fieldset': { borderColor: '#818cf8', borderWidth: 1 } },
        },
      },
    },
    MuiAppBar: { styleOverrides: { root: { boxShadow: 'none' } } },
    MuiDrawer: { styleOverrides: { paper: { backgroundImage: 'none', backgroundColor: '#080c17', border: 'none' } } },
    MuiTab: { styleOverrides: { root: { textTransform: 'none', fontWeight: 500, fontSize: 13, minHeight: 44, '&.Mui-selected': { fontWeight: 600 } } } },
    MuiLinearProgress: { styleOverrides: { root: { backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 4 } } },
    MuiSkeleton: {
      styleOverrides: {
        root: { backgroundColor: 'rgba(255,255,255,0.04)' },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: { borderRadius: 12 },
        filledError: {
          backgroundColor: 'rgba(239,68,68,0.15)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          border: '1px solid rgba(239,68,68,0.25)',
          color: '#fca5a5',
        },
        filledSuccess: {
          backgroundColor: 'rgba(34,197,94,0.15)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          border: '1px solid rgba(34,197,94,0.25)',
          color: '#86efac',
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: 'rgba(12,18,35,0.95)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 8,
          fontSize: 12,
          padding: '6px 12px',
        },
      },
    },
  },
});

export default theme;
