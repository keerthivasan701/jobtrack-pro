import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jobtrack_access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401 and token refresh
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url.includes('/auth/login/')) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('jobtrack_refresh_token');
      if (!refreshToken) {
        localStorage.removeItem('jobtrack_access_token');
        localStorage.removeItem('jobtrack_refresh_token');
        localStorage.removeItem('jobtrack_user');
        window.dispatchEvent(new Event('auth:logout'));
        return Promise.reject(error);
      }

      try {
        const response = await axios.post(`${API_BASE_URL}/auth/refresh/`, {
          refresh: refreshToken,
        });

        const newAccessToken = response.data.access;
        localStorage.setItem('jobtrack_access_token', newAccessToken);
        if (response.data.refresh) {
          localStorage.setItem('jobtrack_refresh_token', response.data.refresh);
        }

        apiClient.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        processQueue(null, newAccessToken);
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.removeItem('jobtrack_access_token');
        localStorage.removeItem('jobtrack_refresh_token');
        localStorage.removeItem('jobtrack_user');
        window.dispatchEvent(new Event('auth:logout'));
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export const authApi = {
  login: (credentials) => apiClient.post('/auth/login/', credentials),
  register: (userData) => apiClient.post('/auth/register/', userData),
  getProfile: () => apiClient.get('/auth/profile/'),
  updateProfile: (profileData) => apiClient.put('/auth/profile/', profileData),
  changePassword: (passwordData) => apiClient.post('/auth/change-password/', passwordData),
};

export const applicationsApi = {
  list: (params) => apiClient.get('/applications/', { params }),
  allItems: (params) => apiClient.get('/applications/all-items/', { params }),
  get: (id) => apiClient.get(`/applications/${id}/`),
  create: (data) => apiClient.post('/applications/', data),
  update: (id, data) => apiClient.put(`/applications/${id}/`, data),
  patch: (id, data) => apiClient.patch(`/applications/${id}/`, data),
  updateStatus: (id, status) => apiClient.patch(`/applications/${id}/status/`, { status }),
  delete: (id) => apiClient.delete(`/applications/${id}/`),
  getStats: () => apiClient.get('/applications/stats/'),
};

export const interviewsApi = {
  list: (params) => apiClient.get('/interviews/', { params }),
  get: (id) => apiClient.get(`/interviews/${id}/`),
  create: (data) => apiClient.post('/interviews/', data),
  update: (id, data) => apiClient.put(`/interviews/${id}/`, data),
  patch: (id, data) => apiClient.patch(`/interviews/${id}/`, data),
  delete: (id) => apiClient.delete(`/interviews/${id}/`),
  toggleComplete: (id, outcomeData = {}) => apiClient.post(`/interviews/${id}/toggle-complete/`, outcomeData),
  getUpcoming: () => apiClient.get('/interviews/upcoming/'),
};

export default apiClient;
