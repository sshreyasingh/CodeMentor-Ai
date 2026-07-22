import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Box, Typography, Button, Alert, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';
import GitHubIcon from '@mui/icons-material/GitHub';
import { GITHUB_AUTH_URL } from '../config';

const Login = () => {
  const [searchParams] = useSearchParams();
  const [loggingIn, setLoggingIn] = useState(false);
  const errorParam = searchParams.get('error');

  const handleLogin = () => {
    setLoggingIn(true);
    const redirect = searchParams.get('redirect');
    if (redirect) sessionStorage.setItem('loginRedirect', redirect);
    window.location.href = GITHUB_AUTH_URL;
  };

  useEffect(() => {
    const redirect = searchParams.get('redirect');
    if (redirect) sessionStorage.setItem('loginRedirect', redirect);
  }, [searchParams]);

  return (
    <Box sx={{ minHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center', px: 2, background: 'radial-gradient(ellipse 60% 60% at center, rgba(129,140,248,0.06) 0%, transparent 60%)' }}>
      <motion.div initial={{ opacity: 0, y: 24, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }}>
        <Box sx={{ px: { xs: 4, sm: 6 }, py: 6, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 3, textAlign: 'center', maxWidth: 420, width: '100%', bgcolor: 'rgba(12,18,35,0.85)', backdropFilter: 'blur(24px)' }}>
          <Box sx={{ width: 52, height: 52, borderRadius: 2, background: 'linear-gradient(135deg, #818cf8, #22d3ee)', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 3 }}>
            <GitHubIcon sx={{ fontSize: 28, color: '#fff' }} />
          </Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>Welcome back</Typography>
          <Typography variant="body1" sx={{ color: '#94A3B8', mb: 5, lineHeight: 1.6 }}>Sign in with your GitHub account to access collaborative rooms, AI reviews, and your dashboard.</Typography>

          {errorParam && (
            <Alert severity="error" sx={{ mb: 2.5 }}>
              Authentication failed. Please try again.
            </Alert>
          )}

          <Button
            fullWidth
            size="large"
            startIcon={loggingIn ? <CircularProgress size={20} sx={{ color: '#94A3B8' }} /> : <GitHubIcon />}
            onClick={handleLogin}
            disabled={loggingIn}
            sx={{
              bgcolor: '#24292e',
              '&:hover': { bgcolor: '#1b1f23' },
              py: 1.75,
              fontSize: 16,
              borderRadius: 12,
              fontWeight: 600,
            }}
          >
            {loggingIn ? 'Redirecting to GitHub...' : 'Login with GitHub'}
          </Button>
          <Typography variant="caption" sx={{ color: '#64748B', display: 'block', mt: 2.5 }}>No password needed. We'll never post without your permission.</Typography>
        </Box>
      </motion.div>
    </Box>
  );
};

export default Login;
