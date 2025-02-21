import axios from "axios";

// Ambil token dari localStorage
const token = localStorage.getItem("token");

console.log(token);


const axiosInstance = axios.create({
  baseURL: "https://reqres.in/api", // Sesuaikan dengan API yang digunakan
  headers: {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  },
});

// Interceptor untuk menangani response & error
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      console.error("Unauthorized! Redirecting to login...");
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
