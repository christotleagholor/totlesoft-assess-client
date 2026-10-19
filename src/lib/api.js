import axios from "axios";

// Point this to your new Assessment Backend
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

export const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Automatically attach the token to every request
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("assess_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 errors (redirect back to main site if token expires)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired. Redirect to main site login
      window.location.href = import.meta.env.VITE_MAIN_SITE_URL || "http://localhost:3000";
    }
    return Promise.reject(error);
  }
);