import { Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import HomeIcon from '@mui/icons-material/Home';

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <Box sx={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', px: 2 }}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}>
        <Typography variant="h1" sx={{ fontSize: { xs: 96, md: 140 }, fontWeight: 900, background: 'linear-gradient(135deg, #a5b4fc, #67e8f9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1, mb: 1 }}>404</Typography>
        <Typography variant="h5" sx={{ color: '#94A3B8', mb: 3 }}>Page not found</Typography>
        <Button variant="contained" startIcon={<HomeIcon />} onClick={() => navigate('/')} sx={{ px: 3, borderRadius: 10 }}>Go Home</Button>
      </motion.div>
    </Box>
  );
};

export default NotFound;
