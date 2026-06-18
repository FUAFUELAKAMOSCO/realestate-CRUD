import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage for cached credentials
    const cachedToken = localStorage.getItem('propspace_token');
    const cachedUser = localStorage.getItem('propspace_user');

    if (cachedToken && cachedUser) {
      setToken(cachedToken);
      setUser(JSON.parse(cachedUser));
    }
    setLoading(false);
  }, []);

  const login = async (loginIdentifier, password) => {
    try {
      const response = await api.post('/auth/login', { loginIdentifier, password });
      const { token: userToken, ...userData } = response.data;

      localStorage.setItem('propspace_token', userToken);
      localStorage.setItem('propspace_user', JSON.stringify(userData));

      setToken(userToken);
      setUser(userData);
      return userData;
    } catch (error) {
      throw error.response?.data?.message || 'Login failed';
    }
  };

  const register = async (username, email, password, name, phone, avatar) => {
    try {
      const response = await api.post('/auth/register', {
        username,
        email,
        password,
        name,
        phone,
        avatar,
      });
      const { token: userToken, ...userData } = response.data;

      localStorage.setItem('propspace_token', userToken);
      localStorage.setItem('propspace_user', JSON.stringify(userData));

      setToken(userToken);
      setUser(userData);
      return userData;
    } catch (error) {
      throw error.response?.data?.message || 'Registration failed';
    }
  };

  const logout = () => {
    localStorage.removeItem('propspace_token');
    localStorage.removeItem('propspace_user');
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await api.put('/auth/profile', profileData);
      const updatedUser = response.data;

      // Retain the existing token from state/storage
      const currentToken = localStorage.getItem('propspace_token');
      localStorage.setItem('propspace_user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      return updatedUser;
    } catch (error) {
      throw error.response?.data?.message || 'Profile update failed';
    }
  };

  const updatePassword = async (oldPassword, newPassword) => {
    try {
      const response = await api.put('/auth/profile/password', {
        oldPassword,
        newPassword,
      });
      return response.data.message;
    } catch (error) {
      throw error.response?.data?.message || 'Password update failed';
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        updateProfile,
        updatePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
