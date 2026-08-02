import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

const client = axios.create({ baseURL: API, timeout: 20000 });

client.interceptors.request.use((config) => {
  const t = localStorage.getItem("pg_admin_token");
  if (t && config.url && config.url.startsWith("/admin")) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${t}`;
  }
  return config;
});

export default client;
