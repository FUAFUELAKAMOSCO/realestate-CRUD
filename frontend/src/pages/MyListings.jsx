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
  Chip,
  Stack,
} from '@mui/material';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import PropertyCard from '../components/PropertyCard';
import InputField from '../components/InputField';
import { LoadingState, EmptyState, ErrorState } from '../components/States';
import { AddHomeWork as AddHomeWorkIcon, CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import { colors, gradients } from '../themeTokens';

const readFileAsDataURL = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Unable to read the selected image file.'));
    reader.readAsDataURL(file);
  });

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
  const [imageUrls, setImageUrls] = useState([]);
  const [imageNames, setImageNames] = useState([]);

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
    setImageUrls([]);
    setImageNames([]);
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
    setImageUrls(property.imageUrls || []);
    setImageNames((property.imageUrls || []).map((_, index) => `Current image ${index + 1}`));
    setFormError('');
    setDialogOpen(true);
  };

  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    const invalidFile = files.find((file) => !file.type.startsWith('image/'));
    if (invalidFile) {
      setFormError('Please select image files only for the property listing.');
      return;
    }

    setFormError('');
    try {
      const uploadedImages = await Promise.all(files.map((file) => readFileAsDataURL(file)));
      setImageUrls(uploadedImages.map(String));
      setImageNames(files.map((file) => file.name));
    } catch (uploadError) {
      setFormError(uploadError instanceof Error ? uploadError.message : 'Unable to upload listing images.');
    }
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

    const payload = {
      title: title.trim(),
      description: description.trim(),
      price: priceNum,
      location: {
        city: city.trim(),
        country: country.trim(),
      },
      propertyType,
      imageUrls,
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
    <Box sx={{ py: { xs: 5, md: 7 }, background: gradients.page }}>
      <Container maxWidth="xl">
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
              fontWeight: 900,
              background: gradients.accent,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 1,
            }}
          >
            My Listing Portfolio
          </Typography>
          <Typography variant="body1" sx={{ color: colors.textMuted }}>
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

            <Box
              sx={{
                mt: 1,
                mb: 1,
                p: 2,
                borderRadius: 3,
                border: `1px dashed ${colors.border}`,
                background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 700, color: colors.text, mb: 1 }}>
                Property Images
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems={{ xs: 'stretch', sm: 'center' }}>
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<CloudUploadIcon />}
                  disabled={submitting}
                  sx={{ whiteSpace: 'nowrap', alignSelf: 'flex-start' }}
                >
                  Choose from device
                  <input hidden type="file" accept="image/*" multiple onChange={handleImageUpload} />
                </Button>
                <Typography variant="body2" sx={{ color: colors.textMuted }}>
                  {imageNames.length > 0 ? `${imageNames.length} image(s) selected` : 'No image selected yet'}
                </Typography>
              </Stack>

              {imageNames.length > 0 && (
                <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ mt: 2 }}>
                  {imageNames.map((name) => (
                    <Chip key={name} label={name} size="small" sx={{ bgcolor: colors.accentBg, color: colors.accentText, fontWeight: 700 }} />
                  ))}
                </Stack>
              )}
            </Box>
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
    </Box>
  );
};

export default MyListings;
