import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiLogOut, FiHome, FiSettings, FiUser } from "react-icons/fi";
import PostTable from "../components/PostTable";

interface UserData {
  first_name: string;
  last_name: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData>();
  const [, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");

    if (!token) {
      navigate("/login", { replace: true });
    } else {
      fetchUserData(email);
    }
  }, [navigate]);

  const fetchUserData = async (email: string | null) => {
    try {
      const { data: userResponse } = await axios.get(
        "https://reqres.in/api/users?per_page=12"
      );
      const users = userResponse.data;
      const loggedInUser = users.find(
        (user: { email: string }) => user.email === email
      );

      if (loggedInUser) {
        setUserData(loggedInUser);
      } else {
        console.warn("User tidak ditemukan! Periksa email di API.");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    navigate("/login", { replace: true });
  };

  return (
    <div className="flex h-full w-full">
      {/* Sidebar */}
      <div className="w-64 bg-blue-700 text-white p-5 hidden md:block">
        <h2 className="text-xl font-bold mb-6">User Dashboard</h2>
        <ul className="space-y-4">
          <li className="flex items-center gap-3 cursor-pointer hover:bg-blue-800 p-2 rounded">
            <FiHome className="text-lg" /> Home
          </li>
          <li className="flex items-center gap-3 cursor-pointer hover:bg-blue-800 p-2 rounded">
            <FiUser className="text-lg" /> Profile
          </li>
          <li
            className="flex items-center gap-3 cursor-pointer hover:bg-blue-800 p-2 rounded"
            onClick={() => navigate("/admin")} // Navigasi ke /admin saat diklik
          >
            <FiSettings className="text-lg" /> Admin Dashboard
          </li>
        </ul>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col flex-grow bg-gray-100">
        {/* Navbar */}
        <div className="h-16 bg-white shadow-md flex justify-between items-center px-6">
          <h1 className="text-xl font-semibold text-blue-700">Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-700 font-medium">
              {userData?.first_name || "Guest"} {userData?.last_name || ""}
            </span>
            <button
              className="flex items-center bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-700 transition"
              onClick={handleLogout}
            >
              <FiLogOut className="mr-2" /> Logout
            </button>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="flex flex-col p-6">
          <PostTable />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
