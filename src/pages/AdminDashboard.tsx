import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiLogOut, FiHome } from "react-icons/fi";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<
    Array<{
      id: number;
      first_name: string;
      last_name: string;
      email: string;
      avatar: string;
    }>
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    console.log("🔍 Checking Authorization...");
    console.log("📌 Stored Token:", token);
    console.log("📌 Stored User ID:", userId);

    if (
      !token ||
      !userId ||
      (parseInt(userId, 10) !== 1 && parseInt(userId, 10) !== 2)
    ) {
      console.warn("⛔ Akses ditolak! Redirecting to /dashboard...");
      navigate("/dashboard");
      return;
    }

    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          "https://reqres.in/api/users?per_page=12"
        );
        setUsers(response.data.data);
      } catch (error) {
        console.error("❌ Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [navigate]);

  if (loading) return <p className="text-center mt-5">Loading users...</p>;

  return (
    <div className="flex h-screen w-screen">
      {/* Sidebar */}
      <div className="w-64 bg-blue-900 text-white p-6 flex flex-col min-h-screen">
        <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>

        <nav className="flex flex-col gap-4">
          <button
            className="flex items-center gap-2 p-3 bg-blue-700 rounded-md hover:bg-blue-600 transition"
            onClick={() => navigate("/dashboard")}
          >
            <FiHome />
            Dashboard
          </button>
        </nav>

        {/* Tombol Logout */}
        <button
          className="mt-auto flex items-center gap-2 p-3 bg-red-500 rounded-md hover:bg-red-700 transition"
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("userId");
            navigate("/login");
          }}
        >
          <FiLogOut />
          Logout
        </button>
      </div>

      {/* Konten Utama */}
      <div className="flex-1 bg-gray-100 p-6 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4 text-blue-700">User List</h2>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-blue-500 text-white">
                <th className="border p-3">ID</th>
                <th className="border p-3">Name</th>
                <th className="border p-3">Email</th>
                <th className="border p-3">Avatar</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="text-center hover:bg-gray-100 transition text-black"
                >
                  <td className="border p-3">{user.id}</td>
                  <td className="border p-3">
                    {user.first_name} {user.last_name}
                  </td>
                  <td className="border p-3 whitespace-nowrap">{user.email}</td>
                  <td className="border p-3">
                    <img
                      src={user.avatar}
                      alt={user.first_name}
                      className="w-10 h-10 rounded-full mx-auto shadow-md"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
