import axios from 'axios';

// const api = axios.create({
//   baseURL: 'http://localhost:8000',
// });
const api = axios.create({
  baseURL: 'https://manipython1.pythonanywhere.com',
});

// Request interceptor: attach access token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle token refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Skip refresh for authentication-related endpoints
    const skipUrls = ['/api/login/', '/api/register/', '/api/password-reset/', '/api/password-reset-confirm/'];
    if (skipUrls.some(url => originalRequest.url?.includes(url))) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refresh = localStorage.getItem('refresh_token');
      if (refresh) {
        try {
          const { data } = await axios.post('http://localhost:8000/api/token/refresh/', {
            refresh,
          });
          localStorage.setItem('access_token', data.access);
          api.defaults.headers.common['Authorization'] = `Bearer ${data.access}`;
          originalRequest.headers.Authorization = `Bearer ${data.access}`;
          return api(originalRequest);
        } catch (refreshError) {
          // Refresh failed – clear tokens and redirect to login
          localStorage.clear();
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
