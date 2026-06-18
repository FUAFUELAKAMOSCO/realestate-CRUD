import React, { useState, useContext } from 'react';
import { Container, Grid, Typography, Button, Alert, Box, CircularProgress, Divider, Avatar } from '@mui/material';
import { AuthContext } from '../context/AuthContext';
import GlassContainer from '../components/GlassContainer';
import InputField from '../components/InputField';
import { Badge as BadgeIcon, Security as SecurityIcon } from '@mui/icons-material';

const Dashboard = () => {
  const { user, updateProfile, updatePassword } = useContext(AuthContext);

  // Profile fields state
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');

  // Password fields state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // UI status
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');
  const [profileSubmitting, setProfileSubmitting] = useState(false);

  const [pwdSuccess, setPwdSuccess] = useState('');
  const [pwdError, setPwdError] = useState('');
  const [pwdSubmitting, setPwdSubmitting] = useState(false);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileSuccess('');
    setProfileError('');

    setProfileSubmitting(true);
    try {
      await updateProfile({
        name: name.trim(),
        phone: phone.trim(),
        avatar: avatar.trim(),
      });
      setProfileSuccess('Profile details updated successfully!');
    } catch (err) {
      setProfileError(String(err));
    } finally {
      setProfileSubmitting(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPwdSuccess('');
    setPwdError('');

    if (!oldPassword || !newPassword || !confirmPassword) {
      setPwdError('Please enter old, new, and confirmation passwords.');
      return;
    }

    if (newPassword.length < 6) {
      setPwdError('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPwdError('New passwords do not match.');
      return;
    }

    setPwdSubmitting(true);
    try {
      await updatePassword(oldPassword, newPassword);
      setPwdSuccess('Account password updated successfully.');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPwdError(String(err));
    } finally {
      setPwdSubmitting(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Intro Header */}
      <Box sx={{ mb: 6, display: 'flex', alignItems: 'center', gap: 3 }}>
        <Avatar
          src={user?.avatar || ''}
          alt={user?.username}
          sx={{
            width: 70,
            height: 70,
            fontSize: '2rem',
            background: 'linear-gradient(45deg, #7c4dff 30%, #00e5ff 90%)',
            border: '3px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 8px 20px 0 rgba(124, 77, 255, 0.3)',
          }}
        >
          {user?.username?.charAt(0).toUpperCase()}
        </Avatar>
        <Box>
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 800,
              background: 'linear-gradient(45deg, #7c4dff 30%, #00e5ff 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Dashboard
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            Welcome back, <strong>{user?.username}</strong> ({user?.email})
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={4}>
        {/* Profile Settings */}
        <Grid item xs={12} md={6}>
          <GlassContainer sx={{ height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
              <BadgeIcon color="primary" sx={{ fontSize: 28 }} />
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                Profile Management
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
              Update your personal configuration metrics and contact parameters.
            </Typography>

            {profileSuccess && (
              <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
                {profileSuccess}
              </Alert>
            )}
            {profileError && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                {profileError}
              </Alert>
            )}

            <Box component="form" onSubmit={handleProfileSubmit}>
              <InputField
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={profileSubmitting}
              />
              <InputField
                label="Contact Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={profileSubmitting}
              />
              <InputField
                label="Avatar URL (Link)"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                disabled={profileSubmitting}
              />

              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={profileSubmitting}
                sx={{ mt: 2 }}
              >
                {profileSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Save Changes'}
              </Button>
            </Box>
          </GlassContainer>
        </Grid>

        {/* Security Settings */}
        <Grid item xs={12} md={6}>
          <GlassContainer sx={{ height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
              <SecurityIcon color="secondary" sx={{ fontSize: 28 }} />
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                Security Settings
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
              Safely adjust your password details after authenticating your old credentials.
            </Typography>

            {pwdSuccess && (
              <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
                {pwdSuccess}
              </Alert>
            )}
            {pwdError && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                {pwdError}
              </Alert>
            )}

            <Box component="form" onSubmit={handlePasswordSubmit}>
              <InputField
                label="Current Password"
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                disabled={pwdSubmitting}
                required
              />
              <InputField
                label="New Password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={pwdSubmitting}
                required
              />
              <InputField
                label="Confirm New Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={pwdSubmitting}
                required
              />

              <Button
                type="submit"
                variant="outlined"
                color="secondary"
                disabled={pwdSubmitting}
                sx={{ mt: 2 }}
              >
                {pwdSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Change Password'}
              </Button>
            </Box>
          </GlassContainer>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
