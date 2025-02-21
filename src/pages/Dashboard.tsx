import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true); // Tambahkan state loading

  useEffect(() => {
    console.log("Stored email in localStorage:", localStorage.getItem("email"));
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");

    console.log("Stored email in localStorage:", email); // Debug: Cek email yang tersimpan

    if (!token) {
      navigate("/login", { replace: true });
    } else if (email) {
      fetchUserData(email);
    }
  }, [navigate]);

  const fetchUserData = async (email: string | null) => {
    try {
      const response = await axios.get(
        "https://reqres.in/api/users?per_page=12"
      );
      const users = response.data.data;

      console.log("All users from API:", users); // Debug: Cek user dari API

      const loggedInUser = users.find((user: any) => user.email === email);

      if (loggedInUser) {
        console.log("Found logged-in user:", loggedInUser);
        setUserData(loggedInUser);
      } else {
        console.warn("User tidak ditemukan! Periksa email yang ada di API.");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false); // Matikan loading setelah selesai fetch
    }
  };

  useEffect(() => {
    console.log("Updated userData in state:", userData);
  }, [userData]); // Debugging untuk melihat perubahan userData

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    navigate("/login", { replace: true });
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen w-screen bg-gray-200">
      <h2 className="text-2xl font-bold">Welcome to Dashboard!</h2>

      {loading ? (
        <p className="mt-2 text-lg">Memuat data user...</p>
      ) : userData ? (
        <>
          <p className="mt-2 text-lg">
            Hello,{" "}
            <span className="font-bold">
              {userData?.first_name || "Unknown"}{" "}
              {userData?.last_name || "User"}
            </span>
            !
          </p>
          <pre className="bg-gray-300 p-2 rounded mt-2">
            {JSON.stringify(userData, null, 2)}
          </pre>
        </>
      ) : (
        <p className="mt-2 text-lg text-red-500">User tidak ditemukan.</p>
      )}

      <button
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
