import axios from "axios";

const BACKEND_URL = (typeof process !== "undefined" && process.env?.REACT_APP_BACKEND_URL) || (typeof import.meta !== "undefined" && import.meta.env?.VITE_BACKEND_URL) || "";
export const API = `${BACKEND_URL}/api`;

export const http = axios.create({ baseURL: API });

http.interceptors.request.use((cfg) => {
  const token = localStorage.getItem("exploro_token");
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});
