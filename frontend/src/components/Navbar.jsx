import React, { useContext, useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar, Toolbar, Typography, Button, Box, Avatar, Container, useScrollTrigger,
} from '@mui/material';
import { AuthContext } from '../context/AuthContext';
import { HomeWork as HomeWorkIcon } from '@mui/icons-material';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  // On the home page the hero is dark so navbar starts transparent/dark.
  // Everywhere else (white pages) it starts solid white immediately.
  const isHome = location.pathname === '/';
  const isDashboard = location.pathname === '/dashboard';

  const trigger = useScrollTrigger({ disableHysteresis: true, threshold: 60 });

  // Transparent over hero, solid white once scrolled (or on non-home pages)
  const elevated = !isHome || trigger;

  if (isDashboard) {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar
      position="fixed"
      elevation={elevated ? 2 : 0}
      sx={{
        transition: 'all 0.35s ease',
        background: elevated
          ? 'rgba(255,255,255,0.96)'
          : 'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, transparent 100%)',
        backdropFilter: elevated ? 'blur(14px)' : 'none',
        borderBottom: elevated ? '1px solid rgba(0,0,0,0.08)' : 'none',
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ minHeight: 72 }}>
          {/* Brand */}
          <HomeWorkIcon
            sx={{ mr: 1, fontSize: 28, color: elevated ? 'primary.main' : '#fff' }}
          />
          <Typography
            variant="h6"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              mr: 4,
              fontWeight: 900,
              letterSpacing: '.12rem',
              textDecoration: 'none',
              ...(elevated
                ? {
                    background: 'linear-gradient(45deg, #7c4dff 30%, #00b8d9 90%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }
                : { color: '#fff' }),
            }}
          >
            PropSpace
          </Typography>

          {/* Nav links */}
          <Box sx={{ flexGrow: 1, display: 'flex', gap: 0.5 }}>
            {[{ label: 'Listings', to: '/' },
              ...(user
                ? [
                    { label: 'My Listings', to: '/my-listings' },
                    { label: 'Dashboard', to: '/dashboard' },
                  ]
                : []),
            ].map(({ label, to }) => (
              <Button
                key={to}
                component={RouterLink}
                to={to}
                sx={{
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  borderRadius: 2,
                  px: 2,
                  color: elevated ? 'text.primary' : '#fff',
                  '&:hover': {
                    background: elevated ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.15)',
                  },
                }}
              >
                {label}
              </Button>
            ))}
          </Box>

          {/* Auth section */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {user ? (
              <>
                <Box sx={{ display: { xs: 'none', md: 'block' }, textAlign: 'right' }}>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 700, color: elevated ? 'text.primary' : '#fff' }}
                  >
                    {user.name || user.username}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: elevated ? 'text.secondary' : 'rgba(255,255,255,0.75)', display: 'block' }}
                  >
                    {user.email}
                  </Typography>
                </Box>
                <Avatar
                  component={RouterLink}
                  to="/profile"
                  src={user.avatar || ''}
                  alt={user.username}
                  sx={{
                    width: 38, height: 38,
                    border: '2px solid',
                    borderColor: elevated ? 'primary.main' : 'rgba(255,255,255,0.7)',
                    background: 'linear-gradient(135deg,#7c4dff,#00b8d9)',
                    fontSize: '1rem',
                    fontWeight: 700,
                    textDecoration: 'none',
                    cursor: 'pointer',
                  }}
                >
                  {user.username.charAt(0).toUpperCase()}
                </Avatar>
                <Button
                  onClick={handleLogout}
                  variant={elevated ? 'outlined' : 'contained'}
                  size="small"
                  sx={{
                    fontWeight: 700,
                    borderRadius: 3,
                    borderColor: elevated ? undefined : 'rgba(255,255,255,0.5)',
                    color: elevated ? 'primary.main' : '#fff',
                    background: elevated ? 'transparent' : 'rgba(255,255,255,0.15)',
                    '&:hover': {
                      background: elevated ? undefined : 'rgba(255,255,255,0.25)',
                    },
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <Button
                component={RouterLink}
                to="/login"
                variant="contained"
                color="primary"
                size="small"
                sx={{
                  fontWeight: 700,
                  borderRadius: 3,
                  px: 3,
                  py: 1,
                  boxShadow: '0 4px 14px rgba(124,77,255,0.4)',
                }}
              >
                Sign In
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
