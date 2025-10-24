import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import API from "../api/api";
import { motion } from "framer-motion";

export default function Dashboard() {
  const [stats, setStats] = useState({
    users: 0,
    orgs: 0,
    admins: 0,
  });

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    async function fetchStats() {
      try {
        const usersRes = await API.get("/users");
        const orgsRes = await API.get("/orgs");
        setStats({
          users: usersRes.data.length,
          orgs: orgsRes.data.length,
          admins: usersRes.data.filter(u => u.role === "admin").length,
        });
      } catch (err) {
        console.error("Failed to fetch stats", err);
      }
    }
    fetchStats();

    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const cards = [
    {
      title: "Total Users",
      value: stats.users,
      icon: "👥",
      gradient: "from-blue-500 to-cyan-500",
      growth: "+12%",
      description: "Active users in system"
    },
    {
      title: "Organizations",
      value: stats.orgs,
      icon: "🏢",
      gradient: "from-emerald-500 to-green-500",
      growth: "+8%",
      description: "Registered organizations"
    },
    {
      title: "Active Admins",
      value: stats.admins,
      icon: "🛡️",
      gradient: "from-purple-500 to-pink-500",
      growth: "+5%",
      description: "Administrative users"
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 dark:from-gray-900 dark:to-gray-800">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Header title="Dashboard" />
        
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          {/* Welcome Banner */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl p-8 text-white shadow-xl"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between">
              <div className="mb-4 lg:mb-0">
                <h1 className="text-3xl font-bold mb-3">Welcome back! 👋</h1>
                <p className="text-blue-100 text-lg opacity-90">
                  Here's what's happening with your organization today.
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm px-6 py-4 rounded-xl border border-white/20">
                <div className="text-blue-100 font-semibold text-lg">
                  {currentTime.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
                <div className="text-blue-200 text-sm font-mono">
                  {currentTime.toLocaleTimeString()}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
          >
            {cards.map((card, index) => (
              <motion.div
                key={card.title}
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.05,
                  y: -5,
                  transition: { type: "spring", stiffness: 300 }
                }}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 dark:border-gray-700"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-4 rounded-xl bg-gradient-to-r ${card.gradient} text-white shadow-lg text-2xl`}>
                    {card.icon}
                  </div>
                  <div className="flex items-center space-x-1 bg-green-50 dark:bg-green-900/30 px-3 py-2 rounded-full">
                    <span className="text-green-500 text-xs">▲</span>
                    <span className="text-green-700 dark:text-green-300 text-sm font-semibold">{card.growth}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-gray-600 dark:text-gray-300 text-sm font-medium">{card.title}</p>
                  <p className="text-3xl font-bold text-gray-800 dark:text-white">{card.value}</p>
                  <p className="text-gray-400 dark:text-gray-500 text-xs">{card.description}</p>
                </div>

                {/* Progress Bar */}
                <div className="mt-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(card.value * 5, 100)}%` }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 1 }}
                    className={`h-2 rounded-full bg-gradient-to-r ${card.gradient}`}
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Performance Metrics */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 dark:border-gray-700"
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl text-xl">
                  📈
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Performance Metrics</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">System performance overview</p>
                </div>
              </div>
              
              <div className="space-y-6">
                {[
                  { label: "User Engagement", value: 87, color: "bg-blue-500" },
                  { label: "System Uptime", value: 99.9, color: "bg-green-500" },
                  { label: "Storage Usage", value: 65, color: "bg-amber-500" },
                  { label: "Task Completion", value: 78, color: "bg-purple-500" }
                ].map((metric, idx) => (
                  <div key={idx} className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{metric.label}</span>
                      <span className="text-sm font-semibold text-gray-800 dark:text-white">{metric.value}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${metric.value}%` }}
                        transition={{ delay: 0.6 + idx * 0.1, duration: 1 }}
                        className={`h-3 rounded-full ${metric.color} shadow-sm`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 dark:border-gray-700"
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl text-xl">
                  🔔
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Recent Activity</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">Latest system activities</p>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { action: "New user registration", time: "2 min ago", type: "user" },
                  { action: "Organization created", time: "5 min ago", type: "org" },
                  { action: "System backup completed", time: "1 hour ago", type: "system" },
                  { action: "Profile updated", time: "2 hours ago", type: "user" }
                ].map((activity, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + idx * 0.1 }}
                    className="flex items-center space-x-4 p-4 rounded-xl bg-gray-50/50 dark:bg-gray-700/50 hover:bg-gray-100/50 dark:hover:bg-gray-600/50 transition-all duration-200 group cursor-pointer"
                  >
                    <div className={`w-3 h-3 rounded-full ${
                      activity.type === 'user' ? 'bg-blue-500' : 
                      activity.type === 'org' ? 'bg-green-500' : 'bg-purple-500'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white">
                        {activity.action}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
                    </div>
                    <div className="w-2 h-2 bg-gray-300 dark:bg-gray-500 rounded-full group-hover:bg-gray-400 dark:group-hover:bg-gray-400" />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}