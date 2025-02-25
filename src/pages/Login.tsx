import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Step 1: Kirim login request ke API
      const response = await axios.post("https://reqres.in/api/login", {
        email,
        password,
      });

      const token = response.data.token;
      localStorage.setItem("token", token);
      localStorage.setItem("email", email);

      console.log("✅ Login berhasil, token:", token);

      // Step 2: Ambil daftar user untuk mendapatkan ID berdasarkan email login
      const usersResponse = await axios.get("https://reqres.in/api/users");
      const users = usersResponse.data.data;
      const loggedInUser = users.find(
        (user: { email: string }) => user.email === email
      );

      if (loggedInUser) {
        localStorage.setItem("userId", loggedInUser.id);
        console.log("✅ User ditemukan:", loggedInUser);

        // Step 3: Cek apakah user adalah Admin (id = 1)
        if (loggedInUser.id === 1) {
          console.log("🟢 User adalah ADMIN, redirect ke /admin");
          navigate("/admin");
        } else {
          console.log("🔵 User biasa, redirect ke /dashboard");
          navigate("/dashboard");
        }
      } else {
        console.warn("⚠ User tidak ditemukan dalam daftar API.");
        alert("Login gagal: User tidak ditemukan!");
      }
    } catch (error) {
      console.error("❌ Login gagal:", error);
      alert(`Login gagal, periksa kembali email dan password! (${error})`);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen w-screen bg-gray-200">
      <div className="bg-white p-8 rounded-xl shadow-md w-96">
        <h2 className="text-2xl font-bold text-center text-gray-700">Login</h2>
        <form onSubmit={handleLogin} className="mt-4 space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>
        <p className="text-center mt-4 text-gray-600">
          Belum punya akun?
          <button
            onClick={() => navigate("/register")}
            className="text-blue-500 underline ml-1"
          >
            Register
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
