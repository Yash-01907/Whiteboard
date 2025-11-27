import axios from "axios";

// 1. Create the Axios Instance
const api = axios.create({
  baseURL: "http://localhost:8000/api/v1", 
  withCredentials: true, 
});

// 2. Define the API Calls
export const createBoard = async (title) => {
  const response = await api.post("/whiteboards", { title });
  return response.data; 
};

export const getMyBoards = async () => {
  const response = await api.get("/whiteboards");
  return response.data; 
};

export const getBoardById = async (id) => {
  const response = await api.get(`/whiteboards/${id}`);
  return response.data; 
};

export const saveBoard = async (id, elements) => {
  const response = await api.put(`/whiteboards/${id}`, { elements });
  return response.data;
};
