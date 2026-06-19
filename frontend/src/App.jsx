import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import theme from './theme';
import { gradients } from './themeTokens';
import { AuthProvider } from './context/AuthContext';
import RouteGuard from './components/RouteGuard';
import Navbar from './components/Navbar';
import PublicFeed from './pages/PublicFeed';
import Profile from './pages/Profile';
import MyListings from './pages/MyListings';
import Dashboard from './pages/Dashboard';
import LoginRegister from './pages/LoginRegister';
import PropertyDetails from './pages/PropertyDetails';

const AppShell = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundImage: gradients.page,
        backgroundAttachment: 'fixed',
      }}
    >
      <Navbar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: isHome ? 0 : { xs: 10, md: 11 },
        }}
      >
        <Routes>
          <Route path="/" element={<PublicFeed />} />
          <Route path="/login" element={<LoginRegister />} />
          <Route
            path="/my-listings"
            element={
              <RouteGuard>
                <MyListings />
              </RouteGuard>
            }
          />
          <Route
            path="/profile"
            element={
              <RouteGuard>
                <Profile />
              </RouteGuard>
            }
          />
          <Route path="/properties/:id" element={<PropertyDetails />} />
          <Route
            path="/dashboard"
            element={
              <RouteGuard>
                <Dashboard />
              </RouteGuard>
            }
          />
          <Route path="*" element={<PublicFeed />} />
        </Routes>
      </Box>
    </Box>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <AppShell />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
