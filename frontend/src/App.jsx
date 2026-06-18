import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import theme from './theme';
import { AuthProvider } from './context/AuthContext';
import RouteGuard from './components/RouteGuard';
import Navbar from './components/Navbar';
import PublicFeed from './pages/PublicFeed';
import MyListings from './pages/MyListings';
import Dashboard from './pages/Dashboard';
import LoginRegister from './pages/LoginRegister';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#f8f9fa' }}>
            <Navbar />
            <Box component="main" sx={{ flexGrow: 1 }}>
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
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
