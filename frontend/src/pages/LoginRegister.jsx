import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Typography, Button, Tabs, Tab, Alert, Container, CircularProgress } from '@mui/material';
import { AuthContext } from '../context/AuthContext';
import GlassContainer from '../components/GlassContainer';
import InputField from '../components/InputField';

const LoginRegister = () => {
  const { user, login, register } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState(0); // 0 = Login, 1 = Register
  
  // Login fields
  const [loginIdent, setLoginIdent] = useState('');
  const [loginPwd, setLoginPwd] = useState('');

  // Register fields
  const [regUser, setRegUser] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPwd, setRegPwd] = useState('');
  const [regConfirmPwd, setRegConfirmPwd] = useState('');
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regAvatar, setRegAvatar] = useState('');

  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // If already logged in, redirect away
  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  // Handle URL expiration params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('expired') === 'true') {
      setInfo('Your authentication session has expired. Please log in again.');
    }
  }, [location]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setError('');
    setInfo('');
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setInfo('');

    if (!loginIdent.trim() || !loginPwd) {
      setError('Please enter your email or username, and password.');
      return;
    }

    setSubmitting(true);
    try {
      await login(loginIdent, loginPwd);
      navigate(from, { replace: true });
    } catch (err) {
      setError(String(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setInfo('');

    // Client-side validations
    if (!regUser.trim() || !regEmail.trim() || !regPwd || !regConfirmPwd) {
      setError('Please fill out all required fields: username, email, and password.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(regEmail.trim())) {
      setError('Invalid email address format.');
      return;
    }

    if (regPwd.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (regPwd !== regConfirmPwd) {
      setError('Passwords do not match.');
      return;
    }

    setSubmitting(true);
    try {
      await register(
        regUser.trim(),
        regEmail.trim(),
        regPwd,
        regName.trim(),
        regPhone.trim(),
        regAvatar.trim()
      );
      navigate(from, { replace: true });
    } catch (err) {
      setError(String(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ py: 8, display: 'flex', flexDirection: 'column', minHeight: '80vh', justifyContent: 'center' }}>
      <Typography variant="h4" align="center" sx={{ mb: 4, fontWeight: 900, letterSpacing: '.1rem' }}>
        PROPSPACE
      </Typography>

      <GlassContainer sx={{ p: 4 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          centered
          sx={{
            mb: 4,
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            '& .MuiTabs-indicator': {
              height: 3,
              borderRadius: 3,
            },
          }}
        >
          <Tab label="Login" sx={{ fontWeight: 700, fontSize: '1rem', px: 4 }} />
          <Tab label="Register" sx={{ fontWeight: 700, fontSize: '1rem', px: 4 }} />
        </Tabs>

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 3, border: '1px solid rgba(239, 68, 68, 0.3)' }}>
            {error}
          </Alert>
        )}

        {info && (
          <Alert severity="info" sx={{ mb: 3, borderRadius: 3, border: '1px solid rgba(0, 229, 255, 0.3)' }}>
            {info}
          </Alert>
        )}

        {activeTab === 0 ? (
          /* Login Form */
          <Box component="form" onSubmit={handleLoginSubmit} noValidate>
            <InputField
              label="Email or Username"
              value={loginIdent}
              onChange={(e) => setLoginIdent(e.target.value)}
              autoFocus
              required
            />
            <InputField
              label="Password"
              type="password"
              value={loginPwd}
              onChange={(e) => setLoginPwd(e.target.value)}
              required
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={submitting}
              sx={{ mt: 2, py: 1.5 }}
            >
              {submitting ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
            </Button>
          </Box>
        ) : (
          /* Register Form */
          <Box component="form" onSubmit={handleRegisterSubmit} noValidate>
            <InputField
              label="Username*"
              value={regUser}
              onChange={(e) => setRegUser(e.target.value)}
              required
            />
            <InputField
              label="Email Address*"
              type="email"
              value={regEmail}
              onChange={(e) => setRegEmail(e.target.value)}
              required
            />
            <InputField
              label="Password*"
              type="password"
              value={regPwd}
              onChange={(e) => setRegPwd(e.target.value)}
              required
            />
            <InputField
              label="Confirm Password*"
              type="password"
              value={regConfirmPwd}
              onChange={(e) => setRegConfirmPwd(e.target.value)}
              required
            />
            <InputField
              label="Full Name"
              value={regName}
              onChange={(e) => setRegName(e.target.value)}
            />
            <InputField
              label="Contact Phone"
              value={regPhone}
              onChange={(e) => setRegPhone(e.target.value)}
            />
            <InputField
              label="Avatar Link (URL)"
              value={regAvatar}
              onChange={(e) => setRegAvatar(e.target.value)}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={submitting}
              sx={{ mt: 2, py: 1.5 }}
            >
              {submitting ? <CircularProgress size={24} color="inherit" /> : 'Register Account'}
            </Button>
          </Box>
        )}
      </GlassContainer>
    </Container>
  );
};

export default LoginRegister;
