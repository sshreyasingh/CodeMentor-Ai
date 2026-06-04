import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, Typography, Box, Button, LinearProgress, Chip } from '@mui/material';
import { motion } from 'framer-motion';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import LanguageIcon from '@mui/icons-material/Language';
import PeopleIcon from '@mui/icons-material/People';
import AddIcon from '@mui/icons-material/Add';

const LC = { typescript: '#3178c6', python: '#3776ab', go: '#00add8', javascript: '#f7df1e', java: '#007396', cpp: '#00599c' };

const RecentRooms = ({ rooms = [] }) => {
  const navigate = useNavigate();
  if (!rooms?.length) return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box><Typography variant="h6" fontWeight={700} sx={{ color: '#FFFFFF' }}>Recent Rooms</Typography><Typography variant="body2" sx={{ color: '#64748B' }}>Your collaborative spaces</Typography></Box>
        <Button size="small" startIcon={<AddIcon />} onClick={() => navigate('/rooms')} sx={{ color: '#818cf8' }}>Create room</Button>
      </Box>
      <Card sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
        <Box sx={{ width: 52, height: 52, borderRadius: 2, bgcolor: 'rgba(129,140,248,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2 }}><PeopleIcon sx={{ color: '#818cf8', fontSize: 24 }} /></Box>
        <Typography variant="h6" fontWeight={600} sx={{ color: '#94A3B8', mb: 0.5 }}>No rooms joined yet</Typography>
        <Typography variant="body2" sx={{ color: '#64748B', mb: 2.5 }}>Create or join a room to start collaborating</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/rooms')}>Create a room</Button>
      </Card>
    </Box>
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box><Typography variant="h6" fontWeight={700} sx={{ color: '#FFFFFF' }}>Recent Rooms</Typography><Typography variant="body2" sx={{ color: '#64748B' }}>Your collaborative spaces</Typography></Box>
        <Button size="small" endIcon={<ArrowForwardIcon />} onClick={() => navigate('/rooms')} sx={{ color: '#818cf8' }}>View all</Button>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {rooms.map((room, i) => {
          const langColor = LC[room.language?.toLowerCase()] || '#6366f1';
          const days = Math.floor((Date.now() - new Date(room.createdAt).getTime()) / 86400000);
          return (
            <motion.div key={room.id || room._id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05, duration: 0.2 }}>
              <Card onClick={() => navigate(`/session/${room.roomId}`)} sx={{ cursor: 'pointer', transition: 'all 0.2s', '&:hover': { transform: 'translateX(4px)', bgcolor: 'rgba(20,28,50,0.9)', borderColor: 'rgba(129,140,248,0.3)' } }}>
                <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2.5, py: 2, px: 2.5, '&:last-child': { pb: 2 } }}>
                  <Box sx={{ width: 44, height: 44, borderRadius: 1.5, bgcolor: `${langColor}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 800, color: langColor, flexShrink: 0 }}>{room.language?.[0]?.toUpperCase() || '?'}</Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.25 }}><Typography variant="body2" fontWeight={600} noWrap sx={{ color: '#FFFFFF', fontSize: 15 }}>{room.name}</Typography>{room.isOwner && <Chip label="Owner" size="small" color="primary" sx={{ height: 18, fontSize: 9 }} />}</Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}><Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><LanguageIcon sx={{ fontSize: 12, color: '#64748B' }} /><Typography variant="caption" sx={{ color: '#64748B' }}>{room.language || 'js'}</Typography></Box><Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><PeopleIcon sx={{ fontSize: 12, color: '#64748B' }} /><Typography variant="caption" sx={{ color: '#64748B' }}>{room.participants}</Typography></Box></Box>
                  </Box>
                  <Box sx={{ width: 90, flexShrink: 0 }}><Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}><Typography variant="caption" sx={{ color: '#475569', fontSize: 10 }}>Progress</Typography><Typography variant="caption" fontWeight={700} sx={{ color: langColor, fontSize: 10 }}>{Math.min(100, Math.max(5, days * 8))}%</Typography></Box><LinearProgress variant="determinate" value={Math.min(100, Math.max(5, days * 8))} sx={{ height: 4, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.04)' }} /></Box>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </Box>
    </Box>
  );
};

export default RecentRooms;
