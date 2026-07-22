import { Box, Typography, Button } from '@mui/material';
import { motion } from 'framer-motion';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import RefreshIcon from '@mui/icons-material/Refresh';

const ErrorDisplay = ({ message, onRetry, fullPage }) => {
  const content = (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Box
        sx={{
          textAlign: 'center',
          p: 4,
          borderRadius: 3,
          bgcolor: 'rgba(12,18,35,0.85)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.06)',
          maxWidth: 480,
          mx: 'auto',
        }}
      >
        <ErrorOutlineIcon
          sx={{
            fontSize: 64,
            color: '#fca5a5',
            mb: 2,
            filter: 'drop-shadow(0 0 12px rgba(239,68,68,0.2))',
          }}
        />
        <Typography variant="h6" fontWeight={700} sx={{ color: '#fca5a5', mb: 1 }}>
          Something went wrong
        </Typography>
        <Typography variant="body1" sx={{ color: '#94A3B8', mb: 3, lineHeight: 1.6 }}>
          {message || 'An unexpected error occurred. Please try again.'}
        </Typography>
        {onRetry && (
          <Button
            variant="outlined"
            size="large"
            startIcon={<RefreshIcon />}
            onClick={onRetry}
            sx={{ borderRadius: 10, px: 4 }}
          >
            Retry
          </Button>
        )}
      </Box>
    </motion.div>
  );

  if (fullPage) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
          px: 2,
        }}
      >
        {content}
      </Box>
    );
  }

  return content;
};

export default ErrorDisplay;
