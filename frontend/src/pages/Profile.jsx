import { Box, Typography, Card, CardContent, Avatar, Grid, Divider } from '@mui/material';
import { motion } from 'framer-motion';
import PersonIcon from '@mui/icons-material/Person';
import GitHubIcon from '@mui/icons-material/GitHub';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { useAuth } from '../hooks/useAuth';

const Profile = () => {
  const { user } = useAuth();
  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 700, mx: 'auto', width: '100%' }}>
      <Typography variant="h4" fontWeight={700} sx={{ color: '#FFFFFF', mb: 3, letterSpacing: '-0.02em' }}><PersonIcon sx={{ mr: 1, verticalAlign: 'middle' }} /> Profile</Typography>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <Card sx={{ borderRadius: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
              <Avatar src={user?.avatar} alt={user?.name} sx={{ width: 80, height: 80, border: '3px solid rgba(129,140,248,0.3)' }} />
              <Box><Typography variant="h5" fontWeight={700} sx={{ color: '#FFFFFF' }}>{user?.name || 'User'}</Typography><Typography variant="body2" sx={{ color: '#64748B' }}>{user?.email || 'No email'}</Typography></Box>
            </Box>
            <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)', mb: 2 }} />
            <Grid container spacing={2}>
              <Grid size={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#64748B', mb: 0.5 }}><GitHubIcon sx={{ fontSize: 16 }} /><Typography variant="caption">GitHub ID</Typography></Box>
                <Typography sx={{ color: '#FFFFFF' }}>{user?.githubId || '—'}</Typography>
              </Grid>
              <Grid size={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#64748B', mb: 0.5 }}><CalendarTodayIcon sx={{ fontSize: 16 }} /><Typography variant="caption">Joined</Typography></Box>
                <Typography sx={{ color: '#FFFFFF' }}>{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}</Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </motion.div>
    </Box>
  );
};

export default Profile;
