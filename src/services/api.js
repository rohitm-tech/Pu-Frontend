import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth
export const authAPI = {
  signup: (data) => api.post("/auth/signup", data),
  login: (data) => api.post("/auth/login", data),
};

// Applications
export const applicationsAPI = {
  getAll: () => api.get("/applications"),
  create: (data) => api.post("/applications", data),
  update: (id, data) => api.patch(`/applications/${id}`, data),
  delete: (id) => api.delete(`/applications/${id}`),
};

export default api;
