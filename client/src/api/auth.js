import { api } from "./axios";

export const logoutUserApi = async () => {
  return await api.post("/users/logout");
};

// Add this to your existing imports/exports
export const registerUserApi = async (userData) => {
  const response = await api.post("/users/register", userData);
  return response.data;
};