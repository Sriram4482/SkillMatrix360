import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Organizations from "./pages/Organizations";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/orgs" element={<Organizations />} />
        </Routes>
      </Router>
      <ToastContainer 
        position="top-right" 
        autoClose={3000}
        toastClassName="rounded-xl font-medium"
        progressClassName="bg-gradient-to-r from-blue-500 to-purple-600"
      />
    </div>
  );
}

export default App;