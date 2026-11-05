import api from "./api";

export const register = async (userData) => {
  const response = await api.post("/auth/register", userData);
  return response.data;
};

export const login = async (credentials) => {
  const response = await api.post("/auth/login", credentials);

  const { accessToken, user } = response.data.data;

  sessionStorage.setItem("accessToken", accessToken);

  return { user, accessToken };
};

export const getCurrentUser = async () => {
  const response = await api.get("/auth/me");
  return response.data.data.user;
};

export const updateProfile = async (profileData) => {
  const response = await api.put("/auth/profile", profileData);
  return response.data.data.user;
};

export const logout = async () => {
  try {
    await api.post("/auth/logout");
  } finally {
    sessionStorage.removeItem("accessToken");
  }
};

export const refreshAccessToken = async () => {
  const response = await api.post("/auth/refresh");
  const { accessToken } = response.data.data;

  sessionStorage.setItem("accessToken", accessToken);

  return accessToken;
};
