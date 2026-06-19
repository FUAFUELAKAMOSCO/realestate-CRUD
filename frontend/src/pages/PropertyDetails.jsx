import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Typography,
  Grid,
  Chip,
  Paper,
  Avatar,
  Divider,
  Stack,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon, LocationOn as LocationOnIcon } from '@mui/icons-material';
import api from '../services/api';
import { LoadingState, ErrorState } from '../components/States';
import { colors, gradients } from '../themeTokens';

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProperty = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await api.get(`/properties/${id}`);
        setProperty(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load this property listing.');
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <LoadingState message="Loading property details..." />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <ErrorState message={error} onRetry={() => navigate(-1)} />
      </Container>
    );
  }

  if (!property) {
    return null;
  }

  const images = property.imageUrls || [];
  const ownerName = property.owner?.name || property.owner?.username || 'Property Owner';

  return (
    <Box sx={{ py: 6, background: gradients.page }}>
      <Container maxWidth="lg">
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{ mb: 3, borderRadius: 999, color: colors.text }}
        >
          Back
        </Button>

        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, sm: 3, md: 4 },
            borderRadius: 4,
            border: `1px solid ${colors.border}`,
            background: '#ffffff',
          }}
        >
          <Stack spacing={2} sx={{ mb: 3 }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} justifyContent="space-between">
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 800, color: colors.text, mb: 1 }}>
                  {property.title}
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  <Chip label={property.propertyType} sx={{ background: '#ede9fe', color: '#6d28d9', fontWeight: 700 }} />
                  <Chip
                    icon={<LocationOnIcon />}
                    label={`${property.location.city}, ${property.location.country}`}
                    sx={{ background: '#eff6ff', color: '#1d4ed8', fontWeight: 600 }}
                  />
                </Stack>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 900, color: colors.primary }}>
                {currencyFormatter.format(property.price)}
                <Typography component="span" variant="body1" sx={{ color: colors.textMuted, fontWeight: 600, ml: 0.5 }}>
                  /mo
                </Typography>
              </Typography>
            </Stack>

            <Divider />

            <Grid container spacing={2}>
              <Grid item xs={12} md={8}>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: images.length > 1 ? { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' } : '1fr',
                    gap: 2,
                  }}
                >
                  {images.length > 0 ? (
                    images.map((src, index) => (
                      <Box
                        key={`${src}-${index}`}
                        component="img"
                        src={src}
                        alt={`${property.title} ${index + 1}`}
                        sx={{
                          width: '100%',
                          height: { xs: 220, sm: 260 },
                          objectFit: 'cover',
                          borderRadius: 3,
                          border: `1px solid ${colors.border}`,
                        }}
                      />
                    ))
                  ) : (
                    <Box
                      sx={{
                        height: 320,
                        borderRadius: 3,
                        border: '1px dashed #d1d5db',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: colors.textMuted,
                        background: '#fafafa',
                      }}
                    >
                      No images available for this property.
                    </Box>
                  )}
                </Box>
              </Grid>

              <Grid item xs={12} md={4}>
                <Stack spacing={2}>
                  <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3, borderColor: colors.border }}>
                    <Typography variant="subtitle2" sx={{ color: colors.textMuted, mb: 0.5 }}>
                      Full Description
                    </Typography>
                    <Typography variant="body1" sx={{ color: colors.text, lineHeight: 1.8, whiteSpace: 'pre-line' }}>
                      {property.description}
                    </Typography>
                  </Paper>

                  <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3, borderColor: colors.border }}>
                    <Typography variant="subtitle2" sx={{ color: colors.textMuted, mb: 2 }}>
                      Listing Owner
                    </Typography>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar src={property.owner?.avatar || ''} sx={{ width: 54, height: 54 }}>
                        {ownerName?.[0] || 'P'}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: colors.text }}>
                          {ownerName}
                        </Typography>
                        <Typography variant="body2" sx={{ color: colors.textMuted }}>
                          {property.owner?.email || 'Contact details available through the app'}
                        </Typography>
                        {property.owner?.phone && (
                          <Typography variant="body2" sx={{ color: colors.textMuted }}>
                            {property.owner.phone}
                          </Typography>
                        )}
                      </Box>
                    </Stack>
                  </Paper>
                </Stack>
              </Grid>
            </Grid>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};

export default PropertyDetails;