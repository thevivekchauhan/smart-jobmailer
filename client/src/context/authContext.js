import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const res = await axios.get('/api/auth/profile', { 
          withCredentials: true,
          validateStatus: status => status < 500 // Don't throw for 401 (unauthorized)
        });
        if (res.status === 200) {
          setUser(res.data);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  // Register user
  const register = async (userData) => {
    try {
      setError('');
      const res = await axios.post('/api/auth/register', userData, { withCredentials: true });
      setUser(res.data);
      return { success: true };
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      return { success: false, error: err.response?.data?.message || 'Registration failed' };
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      setError('');
      const res = await axios.post(
        '/api/auth/login',
        { email, password },
        { withCredentials: true }
      );
      setUser(res.data);
      return { success: true };
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      return { success: false, error: err.response?.data?.message || 'Login failed' };
    }
  };

  // Logout user
  const logout = async () => {
    try {
      await axios.post('/api/auth/logout', {}, { withCredentials: true });
      setUser(null);
      return { success: true };
    } catch (err) {
      setError('Failed to log out');
      return { success: false, error: 'Failed to log out' };
    }
  };

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      setError('');
      const res = await axios.put(
        '/api/auth/profile',
        userData,
        { withCredentials: true }
      );
      setUser(res.data);
      return { success: true };
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
      return { success: false, error: err.response?.data?.message || 'Update failed' };
    }
  };

  const value = {
    user,
    loading,
    error,
    register,
    login,
    logout,
    updateProfile,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};
