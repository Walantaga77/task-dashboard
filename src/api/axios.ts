import axios from "axios";
const token = localStorage.getItem("token");
const api = axios.create({
  baseURL: "mongodb+srv://ramadani45697:mVMYqa5k5VQ5jGjr@cluster0.uxamg.mongodb.net/taskApp?retryWrites=true&w=majority",
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
