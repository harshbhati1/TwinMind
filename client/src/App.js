import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Transcription from './components/Transcription';
import SharedSummary from './components/SharedSummary';
import CalendarCallback from './components/CalendarCallback';
import './App.css';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { logTokenInfo } from './utils/tokenUtils';

// Create a theme based on TwinMind color palette (matching screenshots)
const theme = createTheme({
  palette: {
    primary: {
      main: '#1E62EB', // Bright blue from screenshots
      light: '#4a7ef0',
      dark: '#0e4abf',
      contrastText: '#FFFFFF'
    },
    secondary: {
      main: '#FF9800', // Orange/Amber from screenshots
      light: '#ffb547',
      dark: '#c77700',
    },
    highlight: {
      main: '#FFD54F', // Yellow highlight color seen in screenshots
      light: '#ffecb3',
      dark: '#ffb300',
    },
    text: {
      primary: '#333333',
      secondary: '#666666',
    },
    background: {
      default: '#F9F9F9', // Very light gray as seen in screenshots
      paper: '#FFFFFF',
      card: '#F5F7FA', // Slightly blue-tinted background for cards
    },
    divider: '#E0E0E0',
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif', // Using Inter font which looks closer to the design
    h1: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.75rem',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 12, // Slightly more rounded corners as seen in the design
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '24px', // More pronounced rounding on buttons
          padding: '8px 24px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
        },
        containedPrimary: {
          background: 'linear-gradient(45deg, #1E62EB 30%, #3a7ff0 90%)', // Subtle gradient for buttons
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: '16px',
        },
      },
    },
  },
});

function App() {
  // Add token debugging to window for developer access via console
  useEffect(() => {
    // Add a global token debug utility for console use
    window.tokenDebug = {
      checkToken: () => {
        const token = localStorage.getItem('authToken');
        logTokenInfo(token);
        return token ? 'Token info logged to console' : 'No token found in localStorage';
      },      refreshToken: async () => {
        try {
          // Import auth directly
          const { auth } = await import('./services/firebase');
          
          if (auth.currentUser) {
            try {
              // Directly call getIdToken on the current user
              const newToken = await auth.currentUser.getIdToken(true);
              localStorage.setItem('authToken', newToken);
              console.log('Token refresh triggered manually via console');
              return newToken ? 'Token refreshed successfully' : 'Token refresh failed';
            } catch (e) {
              console.error('Error refreshing token:', e);
              return 'Token refresh failed: ' + e.message;
            }
          } else {
            return 'No user logged in';
          }
        } catch (e) {
          console.error('Error importing firebase auth:', e);
          return 'Failed to access firebase auth';
        }
      }
    };
    
    console.log(
      '%c🔑 Token Debug Tools Available: %c\n' +
      '- window.tokenDebug.checkToken() - Check current token status\n' +
      '- window.tokenDebug.refreshToken() - Force token refresh',
      'color: #1E62EB; font-weight: bold; font-size: 14px;',
      'color: #333; font-size: 12px;'
    );
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
              {/* Protected routes */}
            <Route path="/dashboard" element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } />
              <Route path="/transcription/:meetingId?" element={
              <PrivateRoute>
                <Transcription />
              </PrivateRoute>
            } />
            
            <Route path="/calendar/callback" element={
              <PrivateRoute>
                <CalendarCallback />              </PrivateRoute>
            } />
            
            {/* Public shared summary route - no authentication required */}
            <Route path="/summary/shared/:shareId" element={<SharedSummary />} />
            
            {/* Default route */}
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Routes>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
