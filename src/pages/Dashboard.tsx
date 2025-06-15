import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FiLogOut,
  FiHome,
  FiSettings,
  FiUser,
  FiMenu,
  FiX,
  FiSun,
  FiMoon,
} from "react-icons/fi";
import PostTable from "../components/PostTable";

interface UserData {
  _id: string;
  name: string;
  email?: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  // ✅ Fetch user data
  const fetchUserData = useCallback(
    async (email: string | null) => {
      if (!email) {
        console.error("⛔ Email tidak ditemukan di localStorage!");
        setLoading(false);
        return;
      }

      try {
        console.log("📡 Fetching user data for email:", email);
        const { data: users } = await axios.get(
          "http://localhost:5002/api/auth/users"
        );

        const loggedInUser = users.find(
          (user: { email: string }) => user.email === email
        );
        if (!loggedInUser) {
          alert("User tidak ditemukan! Silakan login kembali.");
          localStorage.clear();
          navigate("/login", { replace: true });
          return;
        }

        setUserData(loggedInUser);
      } catch (error) {
        console.error("❌ Error fetching user data:", error);
        alert("Terjadi kesalahan saat mengambil data user.");
      } finally {
        setLoading(false);
      }
    },
    [navigate]
  );

  // ✅ Cek token dan ambil user data
  useEffect(() => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");

    if (!token) {
      navigate("/login", { replace: true });
    } else {
      fetchUserData(email);
    }
  }, [navigate, fetchUserData]);

  // ✅ Toggle Dark Mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    navigate("/login", { replace: true });
  };

  if (loading) return <p className="text-center mt-5">Loading...</p>;

  return (
    <div className="flex h-screen w-screen bg-gray-100 dark:bg-gray-900">
      {/* ✅ Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-blue-700 text-white p-6 flex flex-col transform transition-transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-64"
        } md:relative md:translate-x-0 dark:bg-gray-800 shadow-md px-6 py-4`}
      >
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">User Dashboard</h2>
          <FiX
            className="text-2xl cursor-pointer md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        </div>

        <ul className="space-y-4 mt-6">
          <li className="flex items-center gap-3 cursor-pointer hover:bg-blue-800 p-2 rounded dark:hover:bg-gray-500 ">
            <FiHome className="text-lg" /> Home
          </li>
          <li className="flex items-center gap-3 cursor-pointer hover:bg-blue-800 p-2 rounded dark:hover:bg-gray-500">
            <FiUser className="text-lg" /> Profile
          </li>
          <li
            className="flex items-center gap-3 cursor-pointer hover:bg-blue-800 p-2 rounded dark:hover:bg-gray-500"
            onClick={() => navigate("/admin")}
          >
            <FiSettings className="text-lg" /> Admin Dashboard
          </li>
        </ul>

        <button
          className="mt-auto flex items-center gap-2 p-3 bg-red-500 rounded-md hover:bg-red-700 transition"
          onClick={handleLogout}
        >
          <FiLogOut /> Logout
        </button>
      </div>

      {/* ✅ Main Content */}
      <div className="flex-1 bg-gray-100 dark:bg-gray-900 p-6 overflow-y-auto">
        {/* ✅ Navbar Mobile */}
        <div className="flex justify-between items-center mb-4 md:hidden">
          <button onClick={() => setIsSidebarOpen(true)}>
            <FiMenu className="text-2xl text-blue-700 dark:text-white" />
          </button>
          <h1 className="text-xl font-semibold text-blue-700 dark:text-white">
            Dashboard
          </h1>
        </div>

        {/* ✅ Navbar Desktop */}
        <div className="hidden md:flex justify-between items-center bg-white dark:bg-gray-800 shadow-md px-6 py-4 rounded-lg">
          <h1 className="text-xl font-semibold text-blue-700 dark:text-white">
            Dashboard
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-700 dark:text-gray-200 font-medium">
              {userData?.name || "Guest"}
            </span>

            {/* ✅ Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 bg-gray-200 dark:bg-gray-700 rounded-full transition"
            >
              {darkMode ? (
                <FiSun className="text-yellow-400" />
              ) : (
                <FiMoon className="text-gray-500" />
              )}
            </button>
          </div>
        </div>

        {/* ✅ Content */}
        <div className="flex flex-col mt-4">
          <PostTable />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
