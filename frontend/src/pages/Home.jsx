import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import GitHubIcon from '@mui/icons-material/GitHub';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CodeIcon from '@mui/icons-material/Code';
import BoltIcon from '@mui/icons-material/Bolt';
import GroupIcon from '@mui/icons-material/Group';
import { useAuth } from '../hooks/useAuth';

const FEATURES = [
  { icon: <CodeIcon sx={{ fontSize: 22 }} />, label: 'Real-Time Editor', desc: 'Multi-cursor editing with instant sync and live presence' },
  { icon: <BoltIcon sx={{ fontSize: 22 }} />, label: 'AI Code Reviews', desc: 'Get instant feedback with DeepSeek-powered code analysis' },
  { icon: <GroupIcon sx={{ fontSize: 22 }} />, label: 'Team Rooms', desc: 'Create shared spaces, invite teammates, and pair program' },
];

const Home = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: '90vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', px: 3, background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(129,140,248,0.08) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 80% 80%, rgba(34,211,238,0.05) 0%, transparent 50%)', maxWidth: 1000, mx: 'auto' }}>
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.25, 0.4, 0.25, 1] }}>
        <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, px: 2, py: 0.75, borderRadius: 10, bgcolor: 'rgba(129,140,248,0.08)', border: '1px solid rgba(129,140,248,0.15)', mb: 4 }}>
          <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: '#22c55e', boxShadow: '0 0 8px rgba(34,197,94,0.4)' }} />
          <Typography variant="caption" fontWeight={600} sx={{ color: '#a5b4fc', letterSpacing: 1.5, fontSize: 11 }}>COLLABORATIVE CODING REDEFINED</Typography>
        </Box>
        <Typography variant="h1" sx={{ fontSize: { xs: 40, sm: 56, md: 72 }, lineHeight: 1.05, mb: 3, maxWidth: 800 }}>
          Build together,{' '}
          <Box component="span" sx={{ background: 'linear-gradient(135deg, #a5b4fc 0%, #67e8f9 50%, #818cf8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            ship faster
          </Box>
        </Typography>
        <Typography variant="h6" sx={{ color: '#94A3B8', maxWidth: 560, mx: 'auto', mb: 5, lineHeight: 1.7, fontWeight: 400 }}>
          A collaborative code editor with live cursors, AI-powered reviews, and real-time chat. Built for teams that move fast.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap', mb: 12 }}>
          {isAuthenticated ? (
            <Button variant="contained" size="large" endIcon={<ArrowForwardIcon />} onClick={() => navigate('/dashboard')} sx={{ px: 5, py: 1.75, fontSize: 16, borderRadius: 12 }}>Open Dashboard</Button>
          ) : (
            <>
              <Button variant="contained" size="large" startIcon={<GitHubIcon />} onClick={() => window.location.href = '/api/v1/auth/github'} sx={{ px: 5, py: 1.75, fontSize: 16, bgcolor: '#24292e', borderRadius: 12, '&:hover': { bgcolor: '#1b1f23', transform: 'translateY(-2px)' } }}>Login with GitHub</Button>
            </>
          )}
        </Box>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.6 }}>
        <Box sx={{ display: 'flex', gap: { xs: 3, md: 8 }, flexWrap: 'wrap', justifyContent: 'center' }}>
          {FEATURES.map((f, i) => (
            <Box key={f.label} sx={{ textAlign: 'center', maxWidth: 220 }}>
              <Box sx={{ width: 52, height: 52, borderRadius: 2, bgcolor: 'rgba(129,140,248,0.08)', border: '1px solid rgba(129,140,248,0.12)', color: '#818cf8', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2 }}>{f.icon}</Box>
              <Typography variant="body1" fontWeight={600} sx={{ color: '#FFFFFF', mb: 0.5 }}>{f.label}</Typography>
              <Typography variant="body2" sx={{ color: '#64748B', lineHeight: 1.5, fontSize: 13 }}>{f.desc}</Typography>
            </Box>
          ))}
        </Box>
      </motion.div>
    </Box>
  );
};

export default Home;
