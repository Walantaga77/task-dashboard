import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiLogOut, FiHome, FiMenu, FiX } from "react-icons/fi";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<
    Array<{
      _id: string;
      name: string;
      email: string;
      role: string;
    }>
  >([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // ✅ State untuk sidebar mobile

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || (role !== "admin" && role !== "manager")) {
      navigate("/dashboard");
      return;
    }

    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5002/api/auth/users",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [navigate]);

  if (loading) return <p className="text-center mt-5">Loading users...</p>;

  return (
    <div className="flex h-screen w-screen">
      {/* ✅ Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-blue-900 text-white p-6 flex flex-col transition-transform transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-64"
        } md:relative md:translate-x-0 dark:bg-gray-800 shadow-md px-6 py-4`}
      >
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <FiX
            className="text-2xl cursor-pointer md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        </div>

        <nav className="flex flex-col gap-4 mt-6">
          <button
            className="flex items-center gap-2 p-3 bg-blue-700 rounded-md hover:bg-blue-600 transition dark:bg-gray-700 shadow-md px-6 py-4 dark:hover:bg-gray-500"
            onClick={() => navigate("/dashboard")}
          >
            <FiHome />
            Dashboard
          </button>
        </nav>

        <button
          className="mt-auto flex items-center gap-2 p-3 bg-red-500 rounded-md hover:bg-red-700 transition"
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            navigate("/login");
          }}
        >
          <FiLogOut />
          Logout
        </button>
      </div>

      {/* ✅ Main Content */}
      <div className="flex-1 bg-gray-100 p-6 overflow-y-auto dark:bg-gray-900">
        {/* ✅ Navbar Mobile */}
        <div className="flex justify-between items-center mb-4 md:hidden">
          <button onClick={() => setIsSidebarOpen(true)}>
            <FiMenu className="text-2xl text-blue-700" />
          </button>
          <h2 className="text-xl font-bold text-blue-700 dark:text-white">
            User List
          </h2>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md dark:bg-gray-800 shadow-md px-6 py-4">
          <h2 className="text-2xl font-bold text-blue-700 hidden md:block mb-4 dark:text-white">
            User List
          </h2>
          {/* ✅ Responsive Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 min-w-max">
              <thead>
                <tr className="bg-blue-500 text-white dark:bg-gray-700 shadow-md px-6 py-4">
                  <th className="border p-3">ID</th>
                  <th className="border p-3">Name</th>
                  <th className="border p-3">Email</th>
                  <th className="border p-3">Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user._id}
                    className="text-center hover:bg-gray-100 transition text-black dark:text-white"
                  >
                    <td className="border p-3">{user._id}</td>
                    <td className="border p-3">{user.name}</td>
                    <td className="border p-3 whitespace-nowrap">
                      {user.email}
                    </td>
                    <td className="border p-3">{user.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
