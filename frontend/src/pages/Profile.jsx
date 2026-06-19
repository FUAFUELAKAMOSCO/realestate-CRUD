import React, { useContext, useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Button,
  Alert,
  Box,
  CircularProgress,
  Avatar,
  Grid,
  Paper,
  Stack,
  Divider,
  Chip,
} from '@mui/material';
import { Badge as BadgeIcon, Security as SecurityIcon, CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import { AuthContext } from '../context/AuthContext';
import InputField from '../components/InputField';
import { colors, gradients } from '../themeTokens';

const readFileAsDataURL = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Unable to read the selected avatar image.'));
    reader.readAsDataURL(file);
  });

const Profile = () => {
  const { user, updateProfile, updatePassword } = useContext(AuthContext);

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [avatarName, setAvatarName] = useState('');

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');
  const [profileSubmitting, setProfileSubmitting] = useState(false);

  const [pwdSuccess, setPwdSuccess] = useState('');
  const [pwdError, setPwdError] = useState('');
  const [pwdSubmitting, setPwdSubmitting] = useState(false);

  useEffect(() => {
    setName(user?.name || '');
    setPhone(user?.phone || '');
    setAvatar(user?.avatar || '');
    setAvatarName('');
  }, [user]);

  const handleAvatarUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setProfileError('Please select an image file for your avatar.');
      return;
    }

    setProfileError('');
    try {
      const dataUrl = await readFileAsDataURL(file);
      setAvatar(String(dataUrl));
      setAvatarName(file.name);
    } catch (error) {
      setProfileError(error instanceof Error ? error.message : 'Unable to upload avatar image.');
    }
  };

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
    <Box
      sx={{
        py: { xs: 5, md: 7 },
        background: gradients.page,
      }}
    >
      <Container maxWidth="lg">
        <Paper
          elevation={0}
          sx={{
            mb: 4,
            p: { xs: 2.5, md: 4 },
            borderRadius: 4,
            border: `1px solid ${colors.border}`,
            background: gradients.panel,
          }}
        >
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2.5}
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            justifyContent="space-between"
          >
            <Stack direction="row" spacing={2.5} alignItems="center">
              <Avatar
                src={user?.avatar || ''}
                alt={user?.username}
                sx={{
                  width: 76,
                  height: 76,
                  fontSize: '2rem',
                  background: gradients.accent,
                  border: `4px solid ${colors.surface}`,
                  boxShadow: '0 16px 35px rgba(124, 77, 255, 0.22)',
                }}
              >
                {user?.username?.charAt(0).toUpperCase()}
              </Avatar>
              <Box>
                <Typography
                  variant="h4"
                  component="h1"
                  sx={{
                    fontWeight: 900,
                    background: gradients.accent,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 0.5,
                  }}
                >
                  Profile
                </Typography>
                <Typography variant="body1" sx={{ color: colors.textMuted, maxWidth: 760 }}>
                  Keep your contact details, avatar, and password aligned with your PropSpace account.
                </Typography>
              </Box>
            </Stack>

            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              <Chip label="Account" sx={{ bgcolor: colors.accentBg, color: colors.accentText, fontWeight: 700 }} />
              <Chip label="Security" sx={{ bgcolor: colors.infoBg, color: colors.infoText, fontWeight: 700 }} />
              <Chip label="PropSpace" sx={{ bgcolor: colors.successBg, color: colors.successText, fontWeight: 700 }} />
            </Stack>
          </Stack>
        </Paper>

        <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper
            elevation={0}
            sx={{
              height: '100%',
              p: { xs: 2.5, md: 3.5 },
              borderRadius: 4,
              border: `1px solid ${colors.border}`,
              background: colors.surface,
              boxShadow: '0 20px 60px rgba(15, 23, 42, 0.06)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
              <Box
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'linear-gradient(135deg, rgba(124,77,255,0.12), rgba(0,184,217,0.16))',
                  color: colors.primary,
                }}
              >
                <BadgeIcon sx={{ fontSize: 24 }} />
              </Box>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 800, color: colors.text }}>
                  Profile Details
                </Typography>
                <Typography variant="body2" sx={{ color: colors.textMuted }}>
                  Update your public account information.
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 2.5 }} />

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
                mode="light"
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={profileSubmitting}
              />
              <InputField
                mode="light"
                label="Contact Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={profileSubmitting}
              />
              <Box
                sx={{
                  mt: 1,
                  mb: 2,
                  p: 2,
                  borderRadius: 3,
                  border: `1px dashed ${colors.border}`,
                  background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 700, color: colors.text, mb: 1 }}>
                  Avatar Image
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems={{ xs: 'stretch', sm: 'center' }}>
                  <Button
                    component="label"
                    variant="outlined"
                    startIcon={<CloudUploadIcon />}
                    disabled={profileSubmitting}
                    sx={{ whiteSpace: 'nowrap', alignSelf: 'flex-start' }}
                  >
                    Choose from device
                    <input hidden type="file" accept="image/*" onChange={handleAvatarUpload} />
                  </Button>
                  <Typography variant="body2" sx={{ color: colors.textMuted }}>
                    {avatarName || 'No file selected yet'}
                  </Typography>
                </Stack>
              </Box>

              {avatar && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Avatar
                    src={avatar}
                    alt={user?.username}
                    sx={{ width: 56, height: 56, border: `2px solid ${colors.border}` }}
                  />
                  <Typography variant="body2" sx={{ color: colors.textMuted }}>
                    {avatarName || 'Current avatar image'}
                  </Typography>
                </Box>
              )}

              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={profileSubmitting}
                sx={{ mt: 2, px: 3.5, py: 1.25 }}
              >
                {profileSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Save Changes'}
              </Button>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper
            elevation={0}
            sx={{
              height: '100%',
              p: { xs: 2.5, md: 3.5 },
              borderRadius: 4,
              border: '1px solid #e5e7eb',
              background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
              boxShadow: '0 20px 60px rgba(15, 23, 42, 0.06)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
              <Box
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'linear-gradient(135deg, rgba(0,184,217,0.12), rgba(124,77,255,0.12))',
                  color: '#00b8d9',
                }}
              >
                <SecurityIcon sx={{ fontSize: 24 }} />
              </Box>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 800, color: '#111827' }}>
                  Security Settings
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Protect your account with a strong password.
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 2.5 }} />

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
                mode="light"
                label="Current Password"
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                disabled={pwdSubmitting}
                required
              />
              <InputField
                mode="light"
                label="New Password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={pwdSubmitting}
                required
              />
              <InputField
                mode="light"
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
                sx={{ mt: 2, px: 3.5, py: 1.25 }}
              >
                {pwdSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Change Password'}
              </Button>
            </Box>
          </Paper>
        </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Profile;