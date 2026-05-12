import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});

// Items
export const getItems = (params) => API.get("/items", { params });
export const getItemById = (id) => API.get(`/items/${id}`);
export const createItem = (data) => API.post("/items", data);
export const updateItem = (id, data) => API.put(`/items/${id}`, data);
export const deleteItem = (id) => API.delete(`/items/${id}`);
export const getStats = () => API.get("/items/stats");

// Claims
export const getClaims = (params) => API.get("/claims", { params });
export const createClaim = (data) => API.post("/claims", data);
export const updateClaimStatus = (id, data) => API.patch(`/claims/${id}`, data);
export const deleteClaim = (id) => API.delete(`/claims/${id}`);

// Users
export const getUsers = (params) => API.get("/users", { params });
export const createUser = (data) => API.post("/users", data);
export const updateUser = (id, data) => API.put(`/users/${id}`, data);
export const deleteUser = (id) => API.delete(`/users/${id}`);

export default API;
