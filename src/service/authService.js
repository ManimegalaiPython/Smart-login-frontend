import api from './api';

export const login = async (username, password) => {
  const response = await api.post('/api/login/', { username, password });
  return response.data; // { access, refresh }
};

export const register = async (email, username, password) => {
  const response = await api.post('/api/register/', { email, username, password });
  return response.data;
};

export const refreshToken = async (refresh) => {
  const response = await api.post('/api/token/refresh/', { refresh });
  return response.data; // { access }
};

export const fetchDashboard = async () => {
  const response = await api.get('/api/dashboard/');
  return response.data;
};