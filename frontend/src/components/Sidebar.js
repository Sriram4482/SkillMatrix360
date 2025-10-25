import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const userJson = localStorage.getItem("user");
  const user = userJson ? JSON.parse(userJson) : null;

  // Dark mode state - check localStorage first, default to false
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : false;
  });

  const items = [
    { label: "Dashboard", to: "/dashboard", icon: "📊" },
    { label: "Users", to: "/users", icon: "👥" },
    { label: "Organizations", to: "/orgs", icon: "🏢" },
  ];

  const toggleDarkMode = () => {
  const newDarkMode = !darkMode;
  setDarkMode(newDarkMode);
  localStorage.setItem('darkMode', newDarkMode);
};

  // Apply dark mode to entire app
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    // Save to localStorage
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

 const handleLogout = () => {
  localStorage.clear();
  // Use HashRouter navigation
  window.location.href = '/#/login';
  // OR
  window.location.reload();
};

  return (
    <aside className="w-64 bg-gradient-to-b from-slate-800 to-slate-900 dark:from-gray-900 dark:to-gray-800 h-screen sticky top-0 flex flex-col shadow-xl">
      {/* Logo Section */}
      <div className="p-6 border-b border-slate-700 dark:border-gray-700">
        <h1 className="text-2xl font-bold text-white mb-1">OrgManage</h1>
        <p className="text-slate-400 dark:text-gray-400 text-sm">SkillMatrix360</p>
      </div>

      {/* User Profile Section */}
      <div className="p-4 border-b border-slate-700 dark:border-gray-700">
        {user && (
          <div className="flex items-center gap-3 p-3 bg-slate-700/50 dark:bg-gray-700/50 rounded-lg">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium text-sm truncate">{user.name}</p>
              <p className="text-slate-400 dark:text-gray-400 text-xs capitalize">{user.role}</p>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Menu */}
      <nav className="p-4 flex-1">
        <ul className="space-y-2">
          {items.map((item) => {
            const active = location.pathname === item.to;
            return (
              <li key={item.to}>
                <button
                  onClick={() => navigate(item.to)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    active 
                      ? "bg-blue-500 text-white shadow-lg shadow-blue-500/25" 
                      : "text-slate-300 dark:text-gray-300 hover:bg-slate-700 dark:hover:bg-gray-700 hover:text-white"
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Dark Mode Toggle Section */}
      <div className="p-4 border-t border-slate-700 dark:border-gray-700">
        <button
          onClick={toggleDarkMode}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 dark:text-gray-300 hover:bg-slate-700 dark:hover:bg-gray-700 hover:text-white transition-all duration-200"
        >
          <span className="text-lg">{darkMode ? "☀️" : "🌙"}</span>
          <span className="font-medium">{darkMode ? "Light Mode" : "Dark Mode"}</span>
        </button>
      </div>

      {/* Logout Section */}
      <div className="p-4 border-t border-slate-700 dark:border-gray-700">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200"
        >
          <span className="text-lg">🚪</span>
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}