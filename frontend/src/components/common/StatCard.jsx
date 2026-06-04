import { Card, CardContent, Typography, Box } from '@mui/material';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon, color, subtitle }) => (
  <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} style={{ height: '100%' }}>
    <Card sx={{ height: '100%', borderLeft: 3, borderColor: color || '#818cf8', borderRadius: 3 }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography variant="caption" fontWeight={600} sx={{ color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.8, fontSize: 11 }}>{title}</Typography>
          {icon && <Box sx={{ p: 1, borderRadius: 1.5, bgcolor: `${color}12`, color }}>{icon}</Box>}
        </Box>
        <Typography variant="h3" fontWeight={800} sx={{ color: '#FFFFFF', lineHeight: 1, letterSpacing: '-0.03em', mb: 1, fontSize: 36 }}>{value}</Typography>
        {subtitle && <Typography variant="body2" sx={{ color: '#64748B', lineHeight: 1.4, fontSize: 13 }}>{subtitle}</Typography>}
        <Box sx={{ display: 'flex', gap: 0.5, mt: 2.5, height: 32, alignItems: 'flex-end' }}>
          {[0.35, 0.55, 0.45, 0.7, 0.6, 0.85, 0.75, 0.8, 0.65, 0.92].map((h, i) => <Box key={i} sx={{ flex: 1, height: `${h * 100}%`, borderRadius: 1, bgcolor: i === 9 ? color : `${color}20`, transition: 'all 0.3s', '&:hover': { bgcolor: color, height: '100%' } }} />)}
        </Box>
      </CardContent>
    </Card>
  </motion.div>
);

export default StatCard;
