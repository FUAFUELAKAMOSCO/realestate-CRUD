import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import {
  ExitToApp as ExitToAppIcon,
  ListAlt as ListAltIcon,
  TrendingUp as TrendingUpIcon,
  Timeline as TimelineIcon,
  ReceiptLong as ReceiptLongIcon,
  HomeWork as HomeWorkIcon,
} from '@mui/icons-material';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import GlassContainer from '../components/GlassContainer';
import InputField from '../components/InputField';
import PropertyCard from '../components/PropertyCard';
import { LoadingState, ErrorState } from '../components/States';
import { colors, gradients, shadows } from '../themeTokens';

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

const DashboardBarChart = ({ title, subtitle, data, formatValue, accent = colors.primary }) => {
  const maxValue = Math.max(...data.map((item) => item.value), 1);

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2.5, md: 3 },
        borderRadius: 4,
        border: `1px solid ${colors.border}`,
        background: colors.surface,
        boxShadow: shadows.card,
      }}
    >
      <Stack spacing={0.5} sx={{ mb: 2.5 }}>
        <Typography variant="h6" sx={{ fontWeight: 800, color: colors.text }}>
          {title}
        </Typography>
        <Typography variant="body2" sx={{ color: colors.textMuted }}>
          {subtitle}
        </Typography>
      </Stack>

      <Stack spacing={1.8}>
        {data.map((item) => {
          const width = `${Math.max((item.value / maxValue) * 100, 8)}%`;

          return (
            <Box key={item.label}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, mb: 0.75 }}>
                <Typography variant="body2" sx={{ fontWeight: 700, color: colors.text }}>
                  {item.label}
                </Typography>
                <Typography variant="body2" sx={{ color: colors.textMuted, fontWeight: 600 }}>
                  {formatValue ? formatValue(item.value) : item.value}
                </Typography>
              </Box>
              <Box
                sx={{
                  height: 12,
                  borderRadius: 999,
                  background: colors.surfaceMuted,
                  overflow: 'hidden',
                }}
              >
                <Box
                  sx={{
                    width,
                    height: '100%',
                    borderRadius: 999,
                    background: accent,
                  }}
                />
              </Box>
            </Box>
          );
        })}
      </Stack>
    </Paper>
  );
};

const Dashboard = () => {
  const { user, updatePassword, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [allProperties, setAllProperties] = useState([]);
  const [myListings, setMyListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    let active = true;

    const loadDashboard = async () => {
      setLoading(true);
      setError('');

      try {
        const [allResponse, myResponse] = await Promise.all([
          api.get('/properties'),
          api.get('/properties/my-listings'),
        ]);

        if (!active) return;

        setAllProperties(allResponse.data || []);
        setMyListings(myResponse.data || []);
      } catch (fetchError) {
        if (!active) return;
        setError(fetchError.response?.data?.message || 'Unable to load dashboard analytics.');
      } finally {
        if (active) setLoading(false);
      }
    };

    loadDashboard();

    return () => {
      active = false;
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const summary = useMemo(() => {
    const totalListings = allProperties.length;
    const myCount = myListings.length;
    const averagePrice = totalListings
      ? allProperties.reduce((sum, property) => sum + (property.price || 0), 0) / totalListings
      : 0;
    const estimatedVolume = myListings.reduce((sum, property) => sum + (property.price || 0), 0);

    return [
      { label: 'Total Listings', value: totalListings },
      { label: 'My Listings', value: myCount },
      { label: 'Average Price', value: Math.round(averagePrice) },
      { label: 'Estimated Value', value: estimatedVolume },
    ];
  }, [allProperties, myListings]);

  const typeChart = useMemo(() => {
    const categories = ['Apartment', 'House', 'Studio'];

    return categories.map((type) => ({
      label: type,
      value: allProperties.filter((property) => property.propertyType === type).length,
    }));
  }, [allProperties]);

  const transactionChart = useMemo(() => {
    const source = myListings.length > 0 ? myListings : allProperties;
    const totals = new Map();

    source.forEach((property) => {
      const city = property.location?.city || 'Unknown';
      totals.set(city, (totals.get(city) || 0) + (property.price || 0));
    });

    return Array.from(totals.entries())
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [allProperties, myListings]);

  const recentActivities = useMemo(() => {
    return [...allProperties]
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      .slice(0, 5)
      .map((property) => ({
        title: `New ${property.propertyType} in ${property.location?.city || 'Unknown city'}`,
        description: `${currencyFormatter.format(property.price || 0)} / month · ${property.owner?.name || property.owner?.username || 'PropSpace'}`,
        time: property.createdAt ? new Date(property.createdAt).toLocaleDateString() : '',
      }));
  }, [allProperties]);

  const recentListings = useMemo(() => {
    return [...allProperties]
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      .slice(0, 3);
  }, [allProperties]);

  if (loading) {
    return (
      <Box sx={{ py: { xs: 5, md: 7 }, background: gradients.page }}>
        <Box sx={{ maxWidth: 1440, mx: 'auto', px: { xs: 2, md: 4 } }}>
          <LoadingState message="Loading dashboard analytics..." />
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ py: { xs: 5, md: 7 }, background: gradients.page }}>
        <Box sx={{ maxWidth: 1440, mx: 'auto', px: { xs: 2, md: 4 } }}>
          <ErrorState message={error} onRetry={() => window.location.reload()} />
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ py: { xs: 5, md: 7 }, background: gradients.page }}>
      <Box sx={{ maxWidth: 1440, mx: 'auto', px: { xs: 2, md: 4 } }}>
        <Box sx={{ mb: 6, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 3, flexWrap: 'wrap' }}>
          <Box>
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontWeight: 900,
                background: gradients.accent,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Dashboard
            </Typography>
            <Typography variant="body1" sx={{ color: colors.textMuted }}>
              Welcome back, <strong>{user?.name || user?.username}</strong> ({user?.email})
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar
              component={RouterLink}
              to="/profile"
              src={user?.avatar || ''}
              alt={user?.username}
              sx={{
                width: 44,
                height: 44,
                background: gradients.accent,
                fontSize: '1rem',
                fontWeight: 700,
                textDecoration: 'none',
                cursor: 'pointer',
                border: `2px solid ${colors.surface}`,
                boxShadow: '0 12px 28px rgba(124, 77, 255, 0.22)',
              }}
            >
              {user?.username?.charAt(0).toUpperCase()}
            </Avatar>

            <Button
              onClick={handleLogout}
              variant="outlined"
              size="small"
              startIcon={<ExitToAppIcon />}
              sx={{
                fontWeight: 700,
                borderRadius: 3,
                color: colors.primaryDark,
                borderColor: colors.primaryDark,
                background: colors.surface,
                '&:hover': {
                  borderColor: colors.primary,
                  background: colors.surfaceMuted,
                },
              }}
            >
              Logout
            </Button>
          </Box>
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'stretch',
            gap: 4,
            flexDirection: { xs: 'column', md: 'row' },
            minHeight: { md: 'calc(100vh - 260px)' },
          }}
        >
          <Paper
            elevation={0}
            sx={{
              width: { xs: '100%', md: '20%' },
              minWidth: { md: 240 },
              borderRadius: 4,
              p: 2,
              border: `1px solid ${colors.primaryDark}`,
              background: colors.primaryDark,
              color: '#ffffff',
              boxShadow: '0 20px 60px rgba(63, 29, 203, 0.28)',
              alignSelf: 'stretch',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <Box>
              <Typography variant="overline" sx={{ color: 'rgba(255,255,255,0.78)', fontWeight: 800, letterSpacing: '0.12em' }}>
                Menu
              </Typography>
              <Stack spacing={1.25} sx={{ mt: 2 }}>
                <Button
                  component={RouterLink}
                  to="/my-listings"
                  fullWidth
                  variant="outlined"
                  startIcon={<ListAltIcon />}
                  sx={{
                    justifyContent: 'flex-start',
                    px: 2,
                    py: 1.2,
                    color: '#ffffff',
                    borderColor: 'rgba(255,255,255,0.35)',
                    '&:hover': { borderColor: '#ffffff', background: 'rgba(255,255,255,0.08)' },
                  }}
                >
                  Listings
                </Button>
                <Button
                  fullWidth
                  variant="contained"
                  color="secondary"
                  startIcon={<ExitToAppIcon />}
                  onClick={handleLogout}
                  sx={{
                    justifyContent: 'flex-start',
                    px: 2,
                    py: 1.2,
                    background: '#ffffff',
                    color: colors.primaryDark,
                    '&:hover': { background: 'rgba(255,255,255,0.9)' },
                  }}
                >
                  Exit
                </Button>
              </Stack>
            </Box>

            <Box sx={{ mt: 4, p: 2, borderRadius: 3, background: 'rgba(255,255,255,0.08)' }}>
              <Typography variant="overline" sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 800, letterSpacing: '0.12em' }}>
                Snapshot
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 800, mt: 0.5 }}>
                {myListings.length} active listings
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.78)' }}>
                Quick access to your inventory and account exit.
              </Typography>
            </Box>
          </Paper>

          <Box sx={{ width: { xs: '100%', md: '80%' }, flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, minmax(0, 1fr))',
                  lg: 'repeat(4, minmax(0, 1fr))',
                },
                gap: 2.5,
              }}
            >
              {summary.map((item) => (
                <Paper
                  key={item.label}
                  elevation={0}
                  sx={{
                    p: 2.5,
                    borderRadius: 4,
                    border: `1px solid ${colors.border}`,
                    background: colors.surface,
                    boxShadow: shadows.card,
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={1.5}>
                    <Box
                      sx={{
                        width: 46,
                        height: 46,
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: gradients.panel,
                        color: colors.primary,
                      }}
                    >
                      {item.label === 'Total Listings' && <HomeWorkIcon />}
                      {item.label === 'My Listings' && <ListAltIcon />}
                      {item.label === 'Average Price' && <TrendingUpIcon />}
                      {item.label === 'Estimated Value' && <ReceiptLongIcon />}
                    </Box>
                    <Box>
                      <Typography variant="body2" sx={{ color: colors.textMuted, fontWeight: 700 }}>
                        {item.label}
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 900, color: colors.text }}>
                        {item.label.includes('Price') || item.label.includes('Value')
                          ? currencyFormatter.format(item.value)
                          : item.value}
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>
              ))}
            </Box>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', lg: '1.2fr 0.8fr' },
                gap: 3,
              }}
            >
              <DashboardBarChart
                title="Properties by Type"
                subtitle="Live distribution across the current listings catalog."
                data={typeChart}
                formatValue={(value) => `${value} listings`}
                accent={gradients.accent}
              />

              <DashboardBarChart
                title="Transaction Value by City"
                subtitle="Estimated value from your listing portfolio, grouped by city."
                data={transactionChart}
                formatValue={(value) => currencyFormatter.format(value)}
                accent="linear-gradient(45deg, #00b8d9 30%, #7c4dff 90%)"
              />
            </Box>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
                gap: 3,
              }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 2.5, md: 3 },
                  borderRadius: 4,
                  border: `1px solid ${colors.border}`,
                  background: colors.surface,
                  boxShadow: shadows.card,
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2.5 }}>
                  <TimelineIcon sx={{ color: colors.primary }} />
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: colors.text }}>
                      Recent Activity
                    </Typography>
                    <Typography variant="body2" sx={{ color: colors.textMuted }}>
                      Latest listing events and updates.
                    </Typography>
                  </Box>
                </Stack>

                <Stack spacing={2}>
                  {recentActivities.map((activity) => (
                    <Box
                      key={`${activity.title}-${activity.time}`}
                      sx={{
                        p: 2,
                        borderRadius: 3,
                        background: colors.surfaceMuted,
                        border: `1px solid ${colors.border}`,
                      }}
                    >
                      <Typography variant="subtitle2" sx={{ fontWeight: 800, color: colors.text }}>
                        {activity.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: colors.textMuted, mt: 0.5 }}>
                        {activity.description}
                      </Typography>
                      <Typography variant="caption" sx={{ color: colors.textSubtle, display: 'block', mt: 0.75 }}>
                        {activity.time}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Paper>

              <Paper
                elevation={0}
                sx={{
                  p: { xs: 2.5, md: 3 },
                  borderRadius: 4,
                  border: `1px solid ${colors.border}`,
                  background: colors.surface,
                  boxShadow: shadows.card,
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2.5 }}>
                  <ListAltIcon sx={{ color: colors.primary }} />
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: colors.text }}>
                      Latest Listings
                    </Typography>
                    <Typography variant="body2" sx={{ color: colors.textMuted }}>
                      Recent properties from the live catalog.
                    </Typography>
                  </Box>
                </Stack>

                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                      xs: '1fr',
                      sm: 'repeat(2, minmax(0, 1fr))',
                      xl: 'repeat(4, minmax(0, 1fr))',
                    },
                    gap: 2,
                  }}
                >
                  {recentListings.map((property) => (
                    <PropertyCard
                      key={property._id}
                      property={property}
                      currentUserId={null}
                      lightMode
                    />
                  ))}
                </Box>
              </Paper>
            </Box>

          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;