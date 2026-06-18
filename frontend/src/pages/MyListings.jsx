import React, { useState, useEffect, useContext } from 'react';
import {
  Container,
  Typography,
  Button,
  Grid,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Snackbar,
} from '@mui/material';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import PropertyCard from '../components/PropertyCard';
import InputField from '../components/InputField';
import { LoadingState, EmptyState, ErrorState } from '../components/States';
import { AddHomeWork as AddHomeWorkIcon } from '@mui/icons-material';

const MyListings = () => {
  const { user } = useContext(AuthContext);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Dialog State
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [propertyType, setPropertyType] = useState('Apartment');
  const [imageUrlsString, setImageUrlsString] = useState('');

  // UI Feedback
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // Fetch only my listings
  const fetchMyListings = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/properties/my-listings');
      setListings(response.data);
    } catch (err) {
      console.error('Error fetching my listings:', err);
      setError(err.response?.data?.message || 'Failed to fetch personal listings portfolio.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyListings();
  }, []);

  const handleOpenCreateDialog = () => {
    setEditingProperty(null);
    setTitle('');
    setDescription('');
    setPrice('');
    setCity('');
    setCountry('');
    setPropertyType('Apartment');
    setImageUrlsString('');
    setFormError('');
    setDialogOpen(true);
  };

  const handleOpenEditDialog = (property) => {
    setEditingProperty(property);
    setTitle(property.title);
    setDescription(property.description);
    setPrice(property.price);
    setCity(property.location.city);
    setCountry(property.location.country);
    setPropertyType(property.propertyType);
    setImageUrlsString(property.imageUrls ? property.imageUrls.join(', ') : '');
    setFormError('');
    setDialogOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    // Pre-network validation
    if (!title.trim() || !description.trim() || price === '' || !city.trim() || !country.trim() || !propertyType) {
      setFormError('Please enter all required property details.');
      return;
    }

    const priceNum = Number(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      setFormError('Price must be a valid positive number.');
      return;
    }

    // Split image URLs by comma and trim whitespace
    const urls = imageUrlsString
      .split(',')
      .map((url) => url.trim())
      .filter((url) => url.length > 0);

    const payload = {
      title: title.trim(),
      description: description.trim(),
      price: priceNum,
      location: {
        city: city.trim(),
        country: country.trim(),
      },
      propertyType,
      imageUrls: urls,
    };

    setSubmitting(true);
    try {
      if (editingProperty) {
        // Edit property PUT request
        const response = await api.put(`/properties/${editingProperty._id}`, payload);
        // Update local state listing object
        setListings((prev) =>
          prev.map((item) => (item._id === editingProperty._id ? response.data : item))
        );
        setSnackbarMessage('Property listing updated successfully!');
      } else {
        // Create property POST request
        const response = await api.post('/properties', payload);
        // Prepend new listing to local listings
        setListings((prev) => [response.data, ...prev]);
        setSnackbarMessage('Property listed successfully!');
      }
      setSnackbarOpen(true);
      setDialogOpen(false);
    } catch (err) {
      setFormError(err.response?.data?.message || 'Error occurred saving property listing.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProperty = async (propertyId) => {
    if (window.confirm('Are you sure you want to permanently delete this property listing?')) {
      try {
        await api.delete(`/properties/${propertyId}`);
        setListings((prev) => prev.filter((item) => item._id !== propertyId));
        setSnackbarMessage('Listing removed successfully.');
        setSnackbarOpen(true);
      } catch (err) {
        alert(err.response?.data?.message || 'Error deleting property');
      }
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 6 }}>
      {/* Header and Floating controls */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          mb: 5,
          gap: 2,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 800,
              background: 'linear-gradient(45deg, #7c4dff 30%, #00e5ff 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 1,
            }}
          >
            My Listing Portfolio
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            Manage, update, and remove your registered listings.
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddHomeWorkIcon />}
          onClick={handleOpenCreateDialog}
          sx={{ py: 1.2, px: 3 }}
        >
          Create New Listing
        </Button>
      </Box>

      {/* Main content grid */}
      {loading ? (
        <LoadingState message="Fetching your portfolio listings..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchMyListings} />
      ) : listings.length === 0 ? (
        <EmptyState message="You have not published any property listings yet. Click the 'Create New Listing' button to start listing!" />
      ) : (
        <Grid container spacing={3}>
          {listings.map((property) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={property._id}>
              <PropertyCard
                property={property}
                currentUserId={user?._id}
                onEdit={handleOpenEditDialog}
                onDelete={handleDeleteProperty}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Dialog modal for Creation and Modification */}
      <Dialog open={dialogOpen} onClose={() => !submitting && setDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 800, borderBottom: '1px solid rgba(255, 255, 255, 0.08)', pb: 2 }}>
          {editingProperty ? 'Modify Property Details' : 'Create Property Listing'}
        </DialogTitle>
        <Box component="form" onSubmit={handleFormSubmit} noValidate>
          <DialogContent sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
            {formError && (
              <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                {formError}
              </Alert>
            )}

            <InputField
              label="Property Title*"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              disabled={submitting}
            />

            <InputField
              label="Description*"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              multiline
              rows={3}
              required
              disabled={submitting}
            />

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <InputField
                  label="Price ($ / month)*"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  disabled={submitting}
                  InputProps={{ inputProps: { min: 0 } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel id="dialog-property-type-label" sx={{ color: '#9ca3af' }}>
                    Property Type
                  </InputLabel>
                  <Select
                    labelId="dialog-property-type-label"
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    label="Property Type"
                    disabled={submitting}
                    sx={{
                      borderRadius: 3,
                      background: 'rgba(255, 255, 255, 0.03)',
                      color: '#f3f4f6',
                    }}
                  >
                    <MenuItem value="Apartment">Apartment</MenuItem>
                    <MenuItem value="House">House</MenuItem>
                    <MenuItem value="Studio">Studio</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <InputField
                  label="City*"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                  disabled={submitting}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InputField
                  label="Country*"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  required
                  disabled={submitting}
                />
              </Grid>
            </Grid>

            <InputField
              label="Image URLs (Comma separated)"
              value={imageUrlsString}
              onChange={(e) => setImageUrlsString(e.target.value)}
              placeholder="e.g. https://image1.com, https://image2.com"
              helperText="Separate multiple URLs with commas"
              disabled={submitting}
            />
          </DialogContent>
          <DialogActions sx={{ p: 3, borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <Button onClick={() => setDialogOpen(false)} disabled={submitting} color="inherit">
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={submitting} color="primary">
              {submitting ? 'Saving...' : editingProperty ? 'Save Changes' : 'Publish Listing'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* Snackbar feedback */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Container>
  );
};

export default MyListings;
