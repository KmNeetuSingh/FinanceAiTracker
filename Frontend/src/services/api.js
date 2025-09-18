import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: async (credentials) => {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  },
  register: async (userData) => {
    const response = await api.post("/auth/register", userData);
    return response.data;
  },
};

export const transactionsAPI = {
  getAll: async (params = {}) => {
    const response = await api.get("/transactions", { params });
    return response.data;
  },
  create: async (transaction) => {
    const response = await api.post("/transactions", transaction);
    return response.data;
  },
  update: async (id, updates) => {
    const response = await api.put(`/transactions/${id}`, updates);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/transactions/${id}`);
    return response.data;
  },
  getDashboardSummary: async () => {
    const response = await api.get("/transactions/dashboard/summary");
    return response.data;
  },
  uploadStatement: async (formData) => {
    const response = await api.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
};

export const usersAPI = {
  getProfile: async () => {
    const response = await api.get("/users/profile");
    return response.data;
  },
  updateProfile: async (updates) => {
    const response = await api.put("/users/profile", updates);
    return response.data;
  },
};

export default api;
