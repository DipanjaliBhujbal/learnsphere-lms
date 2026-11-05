import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach access token to protected API requests.
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("accessToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Handle unauthorized responses.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      sessionStorage.removeItem("accessToken");
    }

    return Promise.reject(error);
  }
);

export const saveAccessToken = (token) => {
  sessionStorage.setItem("accessToken", token);
};

export const clearAccessToken = () => {
  sessionStorage.removeItem("accessToken");
};

export default api;
