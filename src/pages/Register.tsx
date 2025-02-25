import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("https://reqres.in/api/register", {
        email,
        password,
      });
      alert("Registrasi berhasil, silakan login!");
      navigate("/login");
    } catch (error) {
      alert(`Registrasi gagal, periksa kembali inputan! (${error})`);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen w-screen bg-gray-200">
      <div className="bg-white p-8 rounded-xl shadow-md w-96">
        <h2 className="text-2xl font-bold text-center text-gray-700">
          Register
        </h2>
        <form onSubmit={handleRegister} className="mt-4 space-y-4">
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
            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-5000"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-700 transition"
          >
            Register
          </button>
        </form>
        <p className="text-center mt-4 text-gray-600">
          Sudah punya akun?
          <button
            onClick={() => navigate("/login")}
            className="text-blue-500 underline ml-1"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default Register;
