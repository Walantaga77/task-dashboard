import axios from "axios";
const token = localStorage.getItem("token");
const api = axios.create({
  baseURL: "https://reqres.in/api",
  headers: {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  },
});

// Tambahkan interceptor untuk menyisipkan token
api.interceptors.request.use((config) => {
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
