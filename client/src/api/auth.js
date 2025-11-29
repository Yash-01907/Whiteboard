import { api } from "./axios";

export const logoutUserApi = async () => {
  return await api.post("/users/logout");
};