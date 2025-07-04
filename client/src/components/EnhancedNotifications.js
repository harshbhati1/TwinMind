import React from 'react';
import { 
  Snackbar, 
  Alert as MuiAlert,
  Typography,
  Box,
  CircularProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';

// Custom styled Alert component with SyncScribe theme
const Alert = styled(MuiAlert)(({ theme, severity }) => ({
  borderRadius: '12px',
  boxShadow: severity === 'error' 
    ? '0 4px 12px rgba(244, 67, 54, 0.15)'
    : severity === 'info'
      ? '0 4px 12px rgba(11, 79, 117, 0.12)'
      : '0 4px 12px rgba(16, 185, 129, 0.12)',
  padding: '12px 16px',
  borderLeft: severity === 'error'
    ? '4px solid #f44336'
    : severity === 'info'
      ? '4px solid #0b4f75'
      : '4px solid #10b981',
  backgroundColor: severity === 'error'
    ? 'rgba(244, 67, 54, 0.05)'
    : severity === 'info'
      ? 'rgba(11, 79, 117, 0.05)'
      : 'rgba(16, 185, 129, 0.05)',
  '& .MuiAlert-icon': {
    color: severity === 'error'
      ? '#f44336'
      : severity === 'info'
        ? '#0b4f75'
        : '#10b981'
  },
  '& .MuiAlert-message': {
    fontWeight: 500,
    padding: 0
  },
  animation: 'fadeIn 0.3s ease-in-out',
  '@keyframes fadeIn': {
    '0%': { opacity: 0, transform: 'translateY(-10px)' },
    '100%': { opacity: 1, transform: 'translateY(0)' }
  }
}));

/**
 * Enhanced notification component for SyncScribe
 * Handles error, info, and success messages with consistent styling
 */
const EnhancedNotifications = ({ 
  error, 
  setError, 
  isProcessing, 
  snackbarOpen, 
  snackbarMessage, 
  handleSnackbarClose 
}) => {
  // Check if the message is a share link notification
  const isShareNotification = snackbarMessage && 
    (snackbarMessage.includes('Link copied:') || 
     snackbarMessage.includes('Link created:'));
  return (
    <>      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            position: 'fixed', 
            top: isProcessing ? '140px' : '80px', // Position below processing alert if it's showing
            left: '50%', 
            transform: 'translateX(-50%)', 
            zIndex: 9998, // Just below the processing alert
            minWidth: '350px',
            maxWidth: '90%',
            boxShadow: '0 8px 24px rgba(244, 67, 54, 0.15)'
          }} 
          onClose={() => setError('')}
        >
          {error}
        </Alert>
      )}
        {isProcessing && (
        <Alert 
          severity="info" 
          sx={{ 
            position: 'fixed', 
            top: '80px', 
            left: '50%', 
            transform: 'translateX(-50%)', 
            zIndex: 9999,
            minWidth: '350px',
            maxWidth: '90%',
            boxShadow: '0 8px 24px rgba(11, 79, 117, 0.15)'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CircularProgress 
              size={20} 
              sx={{ 
                mr: 1.5, 
                color: '#0b4f75',
                animation: 'spin 1.2s linear infinite, pulse 1s ease-in-out infinite alternate',
                '@keyframes spin': {
                  '0%': { transform: 'rotate(0deg)' },
                  '100%': { transform: 'rotate(360deg)' }
                },
                '@keyframes pulse': {
                  '0%': { opacity: 0.7 },
                  '100%': { opacity: 1 }
                }
              }} 
            />
            <Typography variant="body2">
              Generating meeting summary... This may take a few moments.            </Typography>
          </Box>
        </Alert>
      )}
      
      {/* Share link notification with custom styling */}
      {isShareNotification && (
        <Alert 
          severity="success" 
          sx={{ 
            position: 'fixed', 
            top: '80px', 
            left: '50%', 
            transform: 'translateX(-50%)', 
            zIndex: 9999,
            minWidth: '350px',
            maxWidth: '90%',
            boxShadow: '0 8px 24px rgba(11, 79, 117, 0.15)',
            backgroundColor: '#ff7300', // Match the orange color theme
            color: '#ffffff',
            borderLeft: '4px solid #e56800',
            display: snackbarOpen ? 'flex' : 'none',
            alignItems: 'center',
            '& .MuiAlert-icon': {
              color: '#ffffff'
            }
          }}
          onClose={handleSnackbarClose}
        >
          <Box>
            <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 0.5 }}>
              Summary Link Created
            </Typography>
            <Typography variant="body2" sx={{ 
              fontFamily: 'monospace', 
              p: 1, 
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '4px',
              wordBreak: 'break-all'
            }}>
              {snackbarMessage.includes('Link copied:') ? 
                snackbarMessage.replace('Link copied:', '').split(' - ')[0] : 
                snackbarMessage.replace('Link created:', '').split(' - ')[0]}
            </Typography>
          </Box>
        </Alert>
      )}
      
      {/* Regular notifications for non-share messages */}
      {!isShareNotification && (
        <Snackbar
          open={snackbarOpen} 
          autoHideDuration={5000}
          onClose={handleSnackbarClose}
          message={snackbarMessage}        
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          sx={{
            '& .MuiSnackbarContent-root': {
              bgcolor: '#10b981', // Success green
              minWidth: '350px',
              maxWidth: '80%',
              fontWeight: 600,
              borderRadius: '16px',
              boxShadow: '0 10px 25px rgba(16, 185, 129, 0.25)',
              py: 1.2,
              px: 2,
              border: '1px solid rgba(16, 185, 129, 0.3)',
              wordBreak: 'break-all',
              animation: 'slideDown 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '@keyframes slideDown': {
                '0%': { transform: 'translateY(-20px)', opacity: 0 },
                '100%': { transform: 'translateY(0)', opacity: 1 }
              }            }
          }}
        />
      )}
    </>
  );
};

export default EnhancedNotifications;
