import { AppBar, Toolbar, Typography, Button, Box, Avatar } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LogoutIcon from '@mui/icons-material/Logout';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <AppBar position="sticky" sx={{ bgcolor: 'rgba(5,8,22,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <Toolbar sx={{ justifyContent: 'space-between', maxWidth: 1440, width: '100%', mx: 'auto', px: { xs: 2, md: 4 } }}>
        <Box component={RouterLink} to="/" sx={{ display: 'flex', alignItems: 'center', gap: 1.25, textDecoration: 'none' }}>
          <Box sx={{ width: 32, height: 32, borderRadius: 1.5, background: 'linear-gradient(135deg, #818cf8 0%, #22d3ee 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 800, color: '#fff', boxShadow: '0 2px 12px rgba(129,140,248,0.35)' }}>C</Box>
          <Typography variant="h6" fontWeight={700} color="#FFFFFF" letterSpacing="-0.02em" sx={{ fontSize: 20 }}>CodeMentor</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {isAuthenticated ? (
            <>
              <Button component={RouterLink} to="/dashboard" startIcon={<DashboardIcon />} sx={{ color: '#94A3B8', '&:hover': { color: '#FFFFFF' } }}>Dashboard</Button>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pl: 2, borderLeft: '1px solid rgba(255,255,255,0.08)' }}>
                <Avatar src={user?.avatar} alt={user?.name} sx={{ width: 34, height: 34, border: '2px solid rgba(129,140,248,0.3)' }} />
                <Typography variant="body2" fontWeight={500} sx={{ color: '#FFFFFF', display: { xs: 'none', sm: 'block' } }}>{user?.name}</Typography>
                <Button size="small" onClick={logout} sx={{ color: '#94A3B8', minWidth: 0, p: 1, '&:hover': { color: '#ef4444', bgcolor: 'rgba(239,68,68,0.08)' } }}><LogoutIcon fontSize="small" /></Button>
              </Box>
            </>
          ) : (
            <Button variant="contained" component={RouterLink} to="/login" sx={{ px: 3 }}>Login</Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
