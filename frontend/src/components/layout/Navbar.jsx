import { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Avatar } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LogoutIcon from '@mui/icons-material/Logout';
import GitHubIcon from '@mui/icons-material/GitHub';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: scrolled ? 'rgba(5,8,22,0.92)' : 'rgba(5,8,22,0.75)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderBottom: `1px solid ${scrolled ? 'rgba(129,140,248,0.12)' : 'rgba(255,255,255,0.06)'}`,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {/* Top accent line */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 1.5,
          background: 'linear-gradient(90deg, transparent 0%, #818cf8 20%, #22d3ee 50%, #a855f7 80%, transparent 100%)',
          opacity: scrolled ? 0.6 : 0.25,
          transition: 'opacity 0.3s ease',
        }}
      />

      <Toolbar
        sx={{
          justifyContent: 'space-between',
          maxWidth: 1440,
          width: '100%',
          mx: 'auto',
          px: { xs: 2, md: 4 },
          minHeight: { xs: 56, md: 64 },
        }}
      >
        {/* Logo */}
        <Box
          component={RouterLink}
          to="/"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.25,
            textDecoration: 'none',
            position: 'relative',
          }}
        >
          <Box
            sx={{
              width: 34,
              height: 34,
              borderRadius: 1.5,
              background: 'linear-gradient(135deg, #818cf8 0%, #22d3ee 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 17,
              fontWeight: 800,
              color: '#fff',
              boxShadow: hovered
                ? '0 0 20px rgba(129,140,248,0.5), 0 0 40px rgba(34,211,238,0.2)'
                : '0 2px 12px rgba(129,140,248,0.35)',
              transform: hovered ? 'scale(1.08) rotate(-5deg)' : 'scale(1) rotate(0deg)',
              transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            C
          </Box>
          <Typography
            variant="h6"
            fontWeight={700}
            color="#FFFFFF"
            letterSpacing="-0.02em"
            sx={{
              fontSize: 20,
              transition: 'color 0.2s',
            }}
          >
            CodeMentor
          </Typography>
        </Box>

        {/* Right side */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <AnimatePresence mode="wait">
            {isAuthenticated ? (
              <motion.div
                key="authenticated"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                style={{ display: 'flex', alignItems: 'center', gap: 12 }}
              >
                <Button
                  component={RouterLink}
                  to="/dashboard"
                  startIcon={<DashboardIcon />}
                  sx={{
                    color: '#94A3B8',
                    fontSize: 14,
                    '&:hover': { color: '#FFFFFF', bgcolor: 'rgba(255,255,255,0.04)' },
                    borderRadius: 10,
                    px: 2,
                  }}
                >
                  Dashboard
                </Button>

                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    pl: 2,
                    borderLeft: '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  <Avatar
                    src={user?.avatar}
                    alt={user?.name}
                    sx={{
                      width: 34,
                      height: 34,
                      border: '2px solid rgba(129,140,248,0.3)',
                      transition: 'border-color 0.2s',
                      '&:hover': { borderColor: 'rgba(129,140,248,0.6)' },
                    }}
                  />
                  <Typography
                    variant="body2"
                    fontWeight={500}
                    sx={{ color: '#FFFFFF', display: { xs: 'none', sm: 'block' }, fontSize: 14 }}
                  >
                    {user?.name}
                  </Typography>
                  <Button
                    size="small"
                    onClick={logout}
                    sx={{
                      color: '#64748B',
                      minWidth: 0,
                      p: 1,
                      borderRadius: 10,
                      '&:hover': { color: '#ef4444', bgcolor: 'rgba(239,68,68,0.08)' },
                    }}
                  >
                    <LogoutIcon fontSize="small" />
                  </Button>
                </Box>
              </motion.div>
            ) : (
              <motion.div
                key="unauth"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                style={{ display: 'flex', alignItems: 'center', gap: 10 }}
              >
                <Button
                  variant="contained"
                  component={RouterLink}
                  to="/login"
                  startIcon={<GitHubIcon />}
                  sx={{
                    px: 3,
                    py: 1,
                    fontSize: 14,
                    borderRadius: 10,
                    background: 'linear-gradient(135deg, #24292e 0%, #1b1f23 100%)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #2d333b 0%, #24292e 100%)',
                      borderColor: 'rgba(129,140,248,0.3)',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.4), 0 0 0 1px rgba(129,140,248,0.1)',
                      transform: 'translateY(-1px)',
                    },
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                >
                  Sign in
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
