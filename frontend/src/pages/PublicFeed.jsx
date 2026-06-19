import React, { useState, useEffect, useContext } from 'react';
import {
  Container, Grid, Box, Typography, Button, Chip, Stack,
  useMediaQuery, useTheme,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import PropertyCard from '../components/PropertyCard';
import FilterSidebar from '../components/FilterSidebar';
import { LoadingState, EmptyState, ErrorState } from '../components/States';
import { Tune as TuneIcon, ArrowDownward as ArrowDownwardIcon } from '@mui/icons-material';

/* ─────────────────────────────────────────────────────────
   HERO SECTION
───────────────────────────────────────────────────────── */
const HeroSection = ({ onExplore }) => (
  <Box
    sx={{
      position: 'relative',
      height: '100vh',
      minHeight: 600,
      display: 'flex',
      alignItems: 'center',
      overflow: 'hidden',
      // Hero background image
      backgroundImage: 'url("/hero.png")',
      backgroundSize: 'cover',
      backgroundPosition: 'center 40%',
      backgroundAttachment: 'fixed',
    }}
  >
    {/* Dark gradient overlay */}
    <Box
      sx={{
        position: 'absolute',
        inset: 0,
        background:
          'linear-gradient(135deg, rgba(5,5,15,0.78) 0%, rgba(20,10,50,0.55) 60%, rgba(0,0,0,0.35) 100%)',
        zIndex: 1,
      }}
    />

    {/* Decorative glowing orbs */}
    <Box sx={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none', overflow: 'hidden' }}>
      <Box sx={{
        position: 'absolute', top: '15%', right: '8%',
        width: 380, height: 380, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(124,77,255,0.25) 0%, transparent 70%)',
        filter: 'blur(40px)',
      }} />
      <Box sx={{
        position: 'absolute', bottom: '20%', left: '5%',
        width: 280, height: 280, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,184,217,0.2) 0%, transparent 70%)',
        filter: 'blur(40px)',
      }} />
    </Box>

    {/* Hero content */}
    <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2, pt: 8 }}>
      <Stack spacing={3} sx={{ maxWidth: 680 }}>
        {/* Badge */}
        <Box>
          <Chip
            label="✦ Premium Real Estate Platform"
            sx={{
              fontWeight: 700,
              fontSize: '0.78rem',
              letterSpacing: '0.06em',
              background: 'rgba(124,77,255,0.25)',
              border: '1px solid rgba(124,77,255,0.5)',
              color: '#c8b3ff',
              backdropFilter: 'blur(8px)',
              px: 1,
            }}
          />
        </Box>

        {/* Headline */}
        <Typography
          variant="h1"
          sx={{
            fontWeight: 900,
            fontSize: { xs: '2.8rem', sm: '3.8rem', md: '5rem' },
            lineHeight: 1.05,
            color: '#fff',
            textShadow: '0 4px 40px rgba(0,0,0,0.4)',
          }}
        >
          Find Your{' '}
          <Box
            component="span"
            sx={{
              background: 'linear-gradient(90deg, #a78bfa 0%, #38bdf8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Dream Space
          </Box>
        </Typography>

        {/* Sub-headline */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: 400,
            color: 'rgba(255,255,255,0.75)',
            lineHeight: 1.6,
            fontSize: { xs: '1rem', md: '1.15rem' },
            maxWidth: 540,
          }}
        >
          Explore curated apartments, houses, and studios across the world's most
          sought-after cities — all in one translucent, real-time platform.
        </Typography>

        {/* Stats row */}
        <Stack direction="row" spacing={4} sx={{ pt: 1 }}>
          {[
            { value: '12+', label: 'Listings' },
            { value: '10+', label: 'Cities' },
            { value: '100%', label: 'Verified' },
          ].map(({ value, label }) => (
            <Box key={label}>
              <Typography sx={{ fontSize: '1.7rem', fontWeight: 800, color: '#fff', lineHeight: 1 }}>
                {value}
              </Typography>
              <Typography sx={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)', fontWeight: 600, letterSpacing: '0.08em' }}>
                {label.toUpperCase()}
              </Typography>
            </Box>
          ))}
        </Stack>

        {/* CTA buttons */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ pt: 1 }}>
          <Button
            onClick={onExplore}
            variant="contained"
            size="large"
            sx={{
              fontWeight: 800,
              fontSize: '1rem',
              borderRadius: 3,
              px: 4,
              py: 1.6,
              background: 'linear-gradient(90deg, #7c4dff 0%, #38bdf8 100%)',
              boxShadow: '0 8px 32px rgba(124,77,255,0.5)',
              '&:hover': {
                boxShadow: '0 12px 40px rgba(124,77,255,0.65)',
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            Explore Listings ↓
          </Button>
          {!useContext ? null : null /* placeholder for conditional render below */}
        </Stack>
      </Stack>
    </Container>

    {/* Scroll cue arrow */}
    <Box
      onClick={onExplore}
      sx={{
        position: 'absolute',
        bottom: 32,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 2,
        cursor: 'pointer',
        animation: 'bounce 2s infinite',
        '@keyframes bounce': {
          '0%,100%': { transform: 'translateX(-50%) translateY(0)' },
          '50%': { transform: 'translateX(-50%) translateY(10px)' },
        },
      }}
    >
      <ArrowDownwardIcon sx={{ color: 'rgba(255,255,255,0.5)', fontSize: 28 }} />
    </Box>
  </Box>
);

/* ─────────────────────────────────────────────────────────
   LISTINGS SECTION (white background)
───────────────────────────────────────────────────────── */
const ListingsSection = ({ listingsRef }) => {
  const { user } = useContext(AuthContext);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '', city: '', minPrice: '', maxPrice: '', propertyType: 'All',
  });
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));

  const fetchProperties = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.city) params.city = filters.city;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      if (filters.propertyType && filters.propertyType !== 'All')
        params.propertyType = filters.propertyType;

      const res = await api.get('/properties', { params });
      setProperties(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not connect to the listings pipeline.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(fetchProperties, 400);
    return () => clearTimeout(t);
  }, [filters]);

  const handleFilterChange = (name, value) =>
    setFilters((prev) => ({ ...prev, [name]: value }));

  const handleClearFilters = () =>
    setFilters({ search: '', city: '', minPrice: '', maxPrice: '', propertyType: 'All' });

  return (
    <Box
      ref={listingsRef}
      sx={{
        bgcolor: '#ffffff',
        minHeight: '60vh',
        pt: 8,
        pb: 10,
        boxShadow: 'inset 0 4px 20px rgba(0,0,0,0.06)',
      }}
    >
      <Container maxWidth="xl">
        {/* Section header */}
        <Box sx={{ mb: 6, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { sm: 'flex-end' }, justifyContent: 'space-between', gap: 2 }}>
          <Box>
            <Typography
              variant="overline"
              sx={{ color: 'primary.main', fontWeight: 800, letterSpacing: '0.12em', fontSize: '0.75rem' }}
            >
              Available Now
            </Typography>
            <Typography
              variant="h4"
              component="h2"
              sx={{ fontWeight: 800, color: '#0f0f1a', mt: 0.5 }}
            >
              Browse All Listings
            </Typography>
          </Box>

          {!isMdUp && (
            <Button
              variant="outlined"
              color="primary"
              startIcon={<TuneIcon />}
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              sx={{ borderRadius: 3, fontWeight: 700, alignSelf: 'flex-start' }}
            >
              {mobileFilterOpen ? 'Hide Filters' : 'Filters'}
            </Button>
          )}
        </Box>

        <Grid container spacing={4}>
          {/* Filter Sidebar */}
          {(isMdUp || mobileFilterOpen) && (
            <Grid item xs={12} md={3} lg={2.8}>
              {/* Light-mode FilterSidebar wrapper */}
              <Box
                sx={{
                  background: '#f4f4f8',
                  border: '1px solid #e5e7eb',
                  borderRadius: 4,
                  p: 3,
                  position: 'sticky',
                  top: 90,
                }}
              >
                <FilterSidebar
                  filters={filters}
                  onChange={handleFilterChange}
                  onClear={handleClearFilters}
                  lightMode
                />
              </Box>
            </Grid>
          )}

          {/* Cards Grid */}
          <Grid item xs={12} md={isMdUp || mobileFilterOpen ? 9 : 12} lg={isMdUp || mobileFilterOpen ? 9.2 : 12}>
            {loading ? (
              <LoadingState message="Fetching listings..." />
            ) : error ? (
              <ErrorState message={error} onRetry={fetchProperties} />
            ) : properties.length === 0 ? (
              <EmptyState message="No properties matched your filters. Try adjusting your search." />
            ) : (
              <Grid container spacing={3}>
                {properties.map((property) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={property._id}>
                    <PropertyCard
                      property={property}
                      currentUserId={user?._id}
                      onEdit={() => {}}
                      onDelete={() => {}}
                      lightMode
                    />
                  </Grid>
                ))}
              </Grid>
            )}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

/* ─────────────────────────────────────────────────────────
   PAGE ROOT
───────────────────────────────────────────────────────── */
const PublicFeed = () => {
  const listingsRef = React.useRef(null);

  const scrollToListings = () => {
    listingsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <Box>
      <HeroSection onExplore={scrollToListings} />
      <ListingsSection listingsRef={listingsRef} />
    </Box>
  );
};

export default PublicFeed;
