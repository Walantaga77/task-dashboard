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
      const response = await axios.post(
        "http://localhost:5002/api/auth/login",
        {
          email,
          password,
        }
      );

      console.log("✅ Response dari backend:", response.data);

      // 🔹 Gunakan optional chaining untuk mencegah error jika response tidak lengkap
      const token = response.data?.token;
      const role = response.data?.role;
      const userEmail = response.data?.email;

      if (!token || !role || !userEmail) {
        console.error("❌ Data login tidak lengkap!", response.data);
        alert("Terjadi kesalahan, coba lagi.");
        return;
      }

      // Simpan data login ke localStorage
      localStorage.setItem("email", userEmail);
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      console.log("✅ Login berhasil! Email:", userEmail, "Role:", role);

      // 🔹 Redirect berdasarkan role
      if (role === "admin") {
        console.log("🟢 Redirecting to /admin");
        navigate("/admin");
      } else {
        console.log("🔵 Redirecting to /dashboard");
        navigate("/dashboard");
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("❌ Login gagal:", error.response?.data || error.message);
        alert(`Login gagal! ${error.response?.data?.message || error.message}`);
      } else if (error instanceof Error) {
        console.error("❌ Unexpected error:", error.message);
        alert(`Terjadi kesalahan: ${error.message}`);
      } else {
        console.error("❌ Unknown error:", error);
        alert("Terjadi kesalahan yang tidak diketahui.");
      }
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
