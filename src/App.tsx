import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"; // Tambahkan ini

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard"; // Pastikan import Dashboard
import AdminDashboard from "./pages/AdminDashboard";

const queryClient = new QueryClient(); // Buat Query Client

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {" "}
      {/* Bungkus seluruh aplikasi */}
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
