import { createContext, useContext, useState, useEffect } from 'react';
import api from '../service/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const isAdmin = localStorage.getItem('is_admin') === 'true';
    if (token) {
      api.get('/api/dashboard/')
        .then(() => setUser({ email: localStorage.getItem('user_email'), isAdmin }))
        .catch(() => {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('is_admin');
          localStorage.removeItem('user_email');
          setUser(null);
        });
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setError('');
    try {
      const response = await api.post('/api/login/', { email, password });
      const { access, refresh, is_admin } = response.data;
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      localStorage.setItem('is_admin', is_admin);
      localStorage.setItem('user_email', email);
      setUser({ email, isAdmin: is_admin });
      return true;
    } catch (err) {
      const msg = err.response?.data?.detail || 'Invalid credentials';
      setError(msg);
      return false;
    }
  };

  const register = async (email, username, password) => {
    setError('');
    try {
      await api.post('/api/register/', { email, username, password });
      return true;
    } catch (err) {
      const msg = err.response?.data?.error || 'Registration failed';
      setError(msg);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('is_admin');
    localStorage.removeItem('user_email');
    setUser(null);
  };

  const requestPasswordReset = async (email) => {
    setError('');
    try {
      await api.post('/api/password-reset/', { email });
      return true;
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to send reset email';
      setError(msg);
      return false;
    }
  };

  const confirmPasswordReset = async (uidb64, token, newPassword) => {
    setError('');
    try {
      await api.post('/api/password-reset-confirm/', { uidb64, token, new_password: newPassword });
      return true;
    } catch (err) {
      const msg = err.response?.data?.error || 'Invalid or expired reset link';
      setError(msg);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      register,
      requestPasswordReset,
      confirmPasswordReset,
      loading,
      error
    }}>
      {children}
    </AuthContext.Provider>
  );
};