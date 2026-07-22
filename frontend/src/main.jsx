import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import App from './App';
import theme from './theme';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import CustomCursor from './components/common/CustomCursor';

// Inject cursor override
const style = document.createElement('style');
style.textContent = `body, a, button, input:not([type="text"]):not(textarea), select, [role="button"], .MuiTab-root, .MuiListItemButton-root, .MuiIconButton-root, .MuiChip-root { cursor: none !important; }`;
document.head.appendChild(style);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ErrorBoundary>
          <AuthProvider>
            <SocketProvider>
              <CustomCursor />
              <App />
            </SocketProvider>
          </AuthProvider>
        </ErrorBoundary>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
