import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach Bearer token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('propspace_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to intercept 401 / 403 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;
    if (response) {
      // 401 Unauthorized / 403 Forbidden means our token is invalid/expired or unauthorized access
      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('propspace_token');
        localStorage.removeItem('propspace_user');
        
        // Only redirect if not already on the login page to avoid infinite redirect loops
        if (!window.location.pathname.endsWith('/login') && !window.location.pathname.endsWith('/auth')) {
          window.location.href = '/login?expired=true';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
