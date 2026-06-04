import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import RateReviewIcon from '@mui/icons-material/RateReview';

const Reviews = () => (
  <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1440, mx: 'auto', width: '100%' }}>
    <Typography variant="h4" fontWeight={700} sx={{ color: '#FFFFFF', mb: 3, letterSpacing: '-0.02em' }}><RateReviewIcon sx={{ mr: 1, verticalAlign: 'middle' }} /> Reviews</Typography>
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Box sx={{ textAlign: 'center', py: 16 }}>
        <Box sx={{ width: 64, height: 64, borderRadius: 2, bgcolor: 'rgba(129,140,248,0.08)', border: '1px solid rgba(129,140,248,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 3 }}><RateReviewIcon sx={{ color: '#818cf8', fontSize: 32 }} /></Box>
        <Typography variant="h5" sx={{ color: '#94A3B8', mb: 1 }}>No reviews yet</Typography>
        <Typography variant="body1" sx={{ color: '#64748B', maxWidth: 420, mx: 'auto', lineHeight: 1.6 }}>Your AI-powered code reviews and feedback will appear here. Open a session and run a review to get started.</Typography>
      </Box>
    </motion.div>
  </Box>
);

export default Reviews;
