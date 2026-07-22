import { Box, Typography, Button } from '@mui/material';
import { motion } from 'framer-motion';

const EmptyState = ({ icon, title, description, action }) => (
  <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
    <Box sx={{ textAlign: 'center', py: 12 }}>
      <Box
        sx={{
          width: 72,
          height: 72,
          borderRadius: 2.5,
          bgcolor: 'rgba(129,140,248,0.06)',
          border: '1px solid rgba(129,140,248,0.12)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mx: 'auto',
          mb: 3,
          color: '#818cf8',
        }}
      >
        {icon}
      </Box>
      <Typography variant="h5" fontWeight={700} sx={{ color: '#94A3B8', mb: 1 }}>
        {title}
      </Typography>
      <Typography
        variant="body1"
        sx={{ color: '#64748B', mb: 4, maxWidth: 440, mx: 'auto', lineHeight: 1.6 }}
      >
        {description}
      </Typography>
      {action}
    </Box>
  </motion.div>
);

export default EmptyState;
