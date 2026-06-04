import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, CircularProgress, Button } from '@mui/material';
import { motion } from 'framer-motion';
import HomeIcon from '@mui/icons-material/Home';
import LoginIcon from '@mui/icons-material/Login';
import api from '../api/axios';
import { useAuth } from '../hooks/useAuth';

const JoinRoom = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [status, setStatus] = useState('joining');
  const [error, setError] = useState('');

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) { navigate(`/login?redirect=/join/${roomId}`, { replace: true }); return; }
    (async () => {
      try { await api.post(`/rooms/${roomId}/join`); navigate(`/session/${roomId}`, { replace: true }); }
      catch (err) { if (err.response?.status === 404) { setStatus('error'); setError('This room does not exist. Check if the invite link is correct.'); } else navigate(`/session/${roomId}`, { replace: true }); }
    })();
  }, [roomId, navigate, isAuthenticated, authLoading]);

  if (authLoading || status === 'joining') return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 3 }}>
      <CircularProgress size={44} thickness={4} />
      <Typography variant="h6" sx={{ color: '#94A3B8' }}>Joining room #{roomId}...</Typography>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', px: 2 }}>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <Box sx={{ px: 5, py: 5, textAlign: 'center', maxWidth: 400, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 3, bgcolor: 'rgba(12,18,35,0.85)', backdropFilter: 'blur(24px)' }}>
          <Typography variant="h5" sx={{ color: '#ef4444', mb: 1 }}>Could not join room</Typography>
          <Typography variant="body2" sx={{ fontFamily: 'monospace', color: '#475569', mb: 2 }}>#{roomId}</Typography>
          <Typography variant="body2" sx={{ color: '#94A3B8', mb: 4 }}>{error}</Typography>
          <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center' }}>
            <Button variant="outlined" startIcon={<HomeIcon />} onClick={() => navigate('/')}>Go Home</Button>
            <Button variant="contained" startIcon={<LoginIcon />} component="a" href="/api/v1/auth/github">Login with GitHub</Button>
          </Box>
        </Box>
      </motion.div>
    </Box>
  );
};

export default JoinRoom;
