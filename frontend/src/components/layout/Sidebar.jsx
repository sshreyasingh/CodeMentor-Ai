import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, Box, Typography, Avatar, IconButton, useMediaQuery, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import AnalyticsIcon from '@mui/icons-material/Insights';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';
import PersonIcon from '@mui/icons-material/Person';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../../hooks/useAuth';

const DRAWER_WIDTH = 272;

const NAV_ITEMS = [
  { label: 'Dashboard', path: '/dashboard', icon: <DashboardIcon /> },
  { label: 'Rooms', path: '/rooms', icon: <MeetingRoomIcon /> },
  { label: 'Analytics', path: '/analytics', icon: <AnalyticsIcon /> },
  { label: 'Insights', path: '/insights', icon: <EmojiObjectsIcon /> },
  { label: 'Profile', path: '/profile', icon: <PersonIcon /> },
];

const Sidebar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleNav = (path) => { navigate(path); if (isMobile) setMobileOpen(false); };

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#060a14' }}>
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 1.5, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        {isMobile && <IconButton onClick={() => setMobileOpen(false)} edge="start"><CloseIcon sx={{ color: '#94A3B8' }} /></IconButton>}
        <Box sx={{ width: 32, height: 32, borderRadius: 1.5, background: 'linear-gradient(135deg, #818cf8 0%, #22d3ee 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 800, color: '#fff' }}>C</Box>
        <Typography variant="h6" fontWeight={700} color="#FFFFFF" letterSpacing="-0.02em">CodeMentor</Typography>
      </Box>
      <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar src={user?.avatar} alt={user?.name} sx={{ width: 40, height: 40, border: '2px solid rgba(129,140,248,0.3)' }} />
        <Box sx={{ overflow: 'hidden', flex: 1 }}>
          <Typography variant="body2" fontWeight={600} noWrap sx={{ color: '#FFFFFF' }}>{user?.name || 'User'}</Typography>
          <Typography variant="caption" noWrap sx={{ color: '#64748B' }}>{user?.email || ''}</Typography>
        </Box>
      </Box>
      <List sx={{ px: 1.5, flex: 1 }}>
        {NAV_ITEMS.map((item, i) => {
          const active = location.pathname.startsWith(item.path);
          return (
            <motion.div key={item.path} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03, duration: 0.2 }}>
              <ListItemButton
                onClick={() => handleNav(item.path)}
                sx={{ borderRadius: 10, mb: 0.5, py: 1.25, bgcolor: active ? 'rgba(129,140,248,0.12)' : 'transparent', color: active ? '#818cf8' : '#94A3B8', transition: 'all 0.2s', '&:hover': { bgcolor: active ? 'rgba(129,140,248,0.18)' : 'rgba(255,255,255,0.04)', color: active ? '#a5b4fc' : '#FFFFFF' } }}
              >
                <ListItemIcon sx={{ minWidth: 36, color: active ? '#818cf8' : '#64748B' }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: 14, fontWeight: active ? 600 : 400 }} />
                {active && <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#818cf8', boxShadow: '0 0 8px rgba(129,140,248,0.4)' }} />}
              </ListItemButton>
            </motion.div>
          );
        })}
      </List>
      <Box sx={{ p: 2, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <ListItemButton onClick={logout} sx={{ borderRadius: 10, color: '#64748B', '&:hover': { color: '#ef4444', bgcolor: 'rgba(239,68,68,0.06)' } }}>
          <ListItemIcon sx={{ minWidth: 36, color: 'inherit' }}><LogoutIcon /></ListItemIcon>
          <ListItemText primary="Sign out" primaryTypographyProps={{ fontSize: 14 }} />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <>
      {isMobile && <IconButton onClick={() => setMobileOpen(true)} sx={{ position: 'fixed', top: 12, left: 12, zIndex: 1200, bgcolor: 'rgba(12,18,35,0.9)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 2, '&:hover': { bgcolor: 'rgba(12,18,35,0.95)' } }}><MenuIcon /></IconButton>}
      {isMobile ? (
        <Drawer open={mobileOpen} onClose={() => setMobileOpen(false)} slotProps={{ backdrop: { sx: { backdropFilter: 'blur(4px)', bgcolor: 'rgba(0,0,0,0.6)' } } }} sx={{ '& .MuiDrawer-paper': { width: DRAWER_WIDTH } }}>{drawerContent}</Drawer>
      ) : (
        <Drawer variant="permanent" sx={{ width: DRAWER_WIDTH, flexShrink: 0, '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box', borderRight: '1px solid rgba(255,255,255,0.06)' } }}>{drawerContent}</Drawer>
      )}
    </>
  );
};

export default Sidebar;
