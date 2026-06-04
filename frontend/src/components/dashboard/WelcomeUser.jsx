import { Box, Avatar, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import PeopleIcon from '@mui/icons-material/People';
import RateReviewIcon from '@mui/icons-material/RateReview';

const WelcomeUser = ({ user, stats }) => {
  const reviewCount = stats?.totalReviews || 0;
  const collabCount = stats?.totalCollaborations || 0;

  return (
    <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 3, mb: 4, p: 3, borderRadius: 3, bgcolor: 'rgba(12,18,35,0.85)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)', flexWrap: 'wrap' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Avatar src={user?.avatar} alt={user?.name} sx={{ width: 56, height: 56, border: '3px solid rgba(129,140,248,0.4)', boxShadow: '0 0 24px rgba(129,140,248,0.15)' }} />
          <Box>
            <Typography variant="h5" fontWeight={700} sx={{ color: '#FFFFFF', fontSize: { xs: 20, md: 24 }, letterSpacing: '-0.02em' }}>Welcome back, {user?.name?.split(' ')[0] || 'Coder'}</Typography>
            <Typography variant="body2" sx={{ color: '#64748B', mt: 0.25 }}>{user?.email || 'Logged in via GitHub'}</Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Box sx={{ textAlign: 'center', px: 3, py: 1.25, borderRadius: 2, bgcolor: 'rgba(129,140,248,0.06)', border: '1px solid rgba(129,140,248,0.1)', minWidth: 80 }}>
            <RateReviewIcon sx={{ color: '#818cf8', fontSize: 18, mb: 0.5 }} />
            <Typography variant="h6" fontWeight={700} sx={{ color: '#FFFFFF', lineHeight: 1, fontSize: 20 }}>{reviewCount}</Typography>
            <Typography variant="caption" sx={{ color: '#64748B', fontSize: 10 }}>Reviews</Typography>
          </Box>
          <Box sx={{ textAlign: 'center', px: 3, py: 1.25, borderRadius: 2, bgcolor: 'rgba(34,211,238,0.06)', border: '1px solid rgba(34,211,238,0.1)', minWidth: 80 }}>
            <PeopleIcon sx={{ color: '#22d3ee', fontSize: 18, mb: 0.5 }} />
            <Typography variant="h6" fontWeight={700} sx={{ color: '#FFFFFF', lineHeight: 1, fontSize: 20 }}>{collabCount}</Typography>
            <Typography variant="caption" sx={{ color: '#64748B', fontSize: 10 }}>Collabs</Typography>
          </Box>
        </Box>
      </Box>
    </motion.div>
  );
};

export default WelcomeUser;
