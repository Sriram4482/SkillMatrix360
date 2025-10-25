import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB, sequelize } from "./config.js"; // note: import sequelize
import authRoutes from "./routes/authRoutes.js";
import orgRoutes from "./routes/orgRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import errorMiddleware from "./middleware/errorMiddleware.js";

import User from "./models/User.js";
import Organization from "./models/Organization.js";
import Department from "./models/Department.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api", orgRoutes);
app.use("/api/users", userRoutes);

// Add after your routes, before error middleware
const createDemoUser = async () => {
  try {
    const bcrypt = require('bcryptjs');
    const existingUser = await User.findOne({ where: { email: 'admin@orgmanage.com' } });
    
    if (!existingUser) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await User.create({
        name: 'Admin User',
        email: 'admin@orgmanage.com', 
        password: hashedPassword,
        role: 'admin'
      });
      console.log('✅ DEMO USER CREATED');
    }
  } catch (error) {
    console.error('Error creating demo user:', error);
  }
};
createDemoUser();

// Error handler
app.use(errorMiddleware);

const startServer = async () => {
  try {
    await connectDB();

    // This will create tables automatically if they don't exist
    await sequelize.sync({ alter: true }); // use { force: true } if you want to drop & recreate tables
    console.log("✅ All tables created successfully!");

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (error) {
    console.error("❌ Failed to start server:", error);
  }
};

startServer();
