import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Card, CardMedia, CardContent, Typography, Box, Chip, IconButton,
} from '@mui/material';
import {
  LocationOn as LocationOnIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  AccountCircle as AccountCircleIcon,
} from '@mui/icons-material';

const PropertyCard = ({ property, currentUserId, onEdit, onDelete, lightMode = true }) => {
  const { _id, title, description, price, location, propertyType, imageUrls, owner } = property;
  const isOwner =
    currentUserId && owner && (owner._id === currentUserId || owner === currentUserId);

  const displayImage = imageUrls && imageUrls.length > 0 ? imageUrls[0] : '';

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(price);

  const typeColor = {
    Apartment: { bg: '#ede9fe', text: '#6d28d9' },
    House: { bg: '#e0f2fe', text: '#0369a1' },
    Studio: { bg: '#fef3c7', text: '#b45309' },
  }[propertyType] || { bg: '#f3f4f6', text: '#374151' };

  return (
    <Card
      component={RouterLink}
      to={`/properties/${_id}`}
      elevation={lightMode ? 0 : 4}
      sx={{
        textDecoration: 'none',
        color: 'inherit',
        cursor: 'pointer',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        borderRadius: 4,
        overflow: 'hidden',
        border: lightMode ? '1px solid #e5e7eb' : '1px solid rgba(255,255,255,0.08)',
        background: lightMode ? '#fff' : 'rgba(20,22,35,0.45)',
        backdropFilter: lightMode ? 'none' : 'blur(16px)',
        transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
        '&:hover': {
          transform: 'translateY(-6px)',
          boxShadow: lightMode
            ? '0 20px 60px rgba(0,0,0,0.12)'
            : '0 12px 40px rgba(124,77,255,0.25)',
          borderColor: lightMode ? '#c4b5fd' : 'rgba(124,77,255,0.3)',
        },
      }}
    >
      {/* Property Type Badge */}
      <Chip
        label={propertyType}
        size="small"
        sx={{
          position: 'absolute', top: 12, left: 12, fontWeight: 700,
          zIndex: 2, fontSize: '0.72rem',
          background: typeColor.bg, color: typeColor.text,
          border: 'none',
        }}
      />

      {/* Owner controls */}
      {isOwner && (
        <Box sx={{ position: 'absolute', top: 12, right: 12, zIndex: 2, display: 'flex', gap: 1 }}>
          <IconButton
            size="small"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              onEdit(property);
            }}
            sx={{
              background: 'rgba(0,0,0,0.45)', color: '#38bdf8',
              backdropFilter: 'blur(8px)',
              '&:hover': { background: 'rgba(56,189,248,0.2)' },
            }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              onDelete(_id);
            }}
            sx={{
              background: 'rgba(0,0,0,0.45)', color: '#f87171',
              backdropFilter: 'blur(8px)',
              '&:hover': { background: 'rgba(239,68,68,0.2)' },
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      )}

      {/* Image */}
      {displayImage ? (
        <CardMedia
          component="img"
          height="210"
          image={displayImage}
          alt={title}
          sx={{ objectFit: 'cover' }}
          onError={(e) => { e.target.style.display = 'none'; }}
        />
      ) : (
        <Box
          sx={{
            height: 210,
            background: 'linear-gradient(135deg, #ede9fe 0%, #e0f2fe 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <Typography variant="caption" sx={{ color: '#9ca3af', fontWeight: 600 }}>
            No image provided
          </Typography>
        </Box>
      )}

      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 3 }}>
        {/* Price */}
        <Typography
          variant="h5"
          sx={{
            fontWeight: 800, mb: 0.5,
            color: lightMode ? '#7c3aed' : '#a78bfa',
          }}
        >
          {formattedPrice}
          <Typography component="span" variant="caption" sx={{ fontWeight: 500, color: lightMode ? '#9ca3af' : 'text.secondary', ml: 0.5 }}>
            /mo
          </Typography>
        </Typography>

        {/* Title */}
        <Typography
          variant="h6"
          component="h2"
          sx={{
            fontWeight: 700, mb: 1, fontSize: '1rem',
            color: lightMode ? '#111827' : '#f3f4f6',
            overflow: 'hidden', textOverflow: 'ellipsis',
            display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical',
          }}
        >
          {title}
        </Typography>

        {/* Location */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5, gap: 0.5 }}>
          <LocationOnIcon sx={{ fontSize: '1rem', color: lightMode ? '#9ca3af' : 'text.secondary' }} />
          <Typography variant="body2" sx={{ color: lightMode ? '#6b7280' : 'text.secondary', fontWeight: 500 }}>
            {location.city}, {location.country}
          </Typography>
        </Box>

        {/* Description */}
        <Typography
          variant="body2"
          sx={{
            color: lightMode ? '#6b7280' : 'text.secondary',
            mb: 2.5, lineHeight: 1.6, flexGrow: 1,
            overflow: 'hidden', textOverflow: 'ellipsis',
            display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical',
          }}
        >
          {description}
        </Typography>

        {/* Owner row */}
        {owner && (
          <Box
            sx={{
              display: 'flex', alignItems: 'center', gap: 1,
              pt: 2,
              borderTop: `1px solid ${lightMode ? '#f3f4f6' : 'rgba(255,255,255,0.06)'}`,
            }}
          >
            {owner.avatar ? (
              <Box
                component="img"
                src={owner.avatar}
                alt={owner.username}
                sx={{ width: 26, height: 26, borderRadius: '50%', objectFit: 'cover' }}
              />
            ) : (
              <AccountCircleIcon sx={{ fontSize: 26, color: '#9ca3af' }} />
            )}
            <Box>
              <Typography variant="caption" sx={{ color: lightMode ? '#374151' : 'text.secondary', fontWeight: 600, display: 'block' }}>
                {owner.name || owner.username}
              </Typography>
              {owner.phone && (
                <Typography variant="caption" sx={{ color: '#9ca3af' }}>
                  {owner.phone}
                </Typography>
              )}
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default PropertyCard;
