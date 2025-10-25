import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs"; // ⭐ Use import, not require
import { connectDB, sequelize } from "./config.js";
import authRoutes from "./routes/authRoutes.js";
import orgRoutes from "./routes/orgRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import errorMiddleware from "./middleware/errorMiddleware.js";

import User from "./models/User.js";
import Organization from "./models/Organization.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api", orgRoutes);
app.use("/api/users", userRoutes);

// ⭐⭐ AUTO-CREATE DEMO USER (FIXED) ⭐⭐
const createDemoUser = async () => {
  try {
    // Check if demo user exists
    const existingUser = await User.findOne({ where: { email: 'admin@orgmanage.com' } });
    
    if (!existingUser) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await User.create({
        name: 'Admin User',
        email: 'admin@orgmanage.com',
        password: hashedPassword,
        role: 'admin'
      });
      console.log('✅ DEMO USER CREATED: admin@orgmanage.com / admin123');
    } else {
      console.log('✅ Demo user already exists');
    }
  } catch (error) {
    console.error('❌ Error creating demo user:', error.message);
  }
};

// Error handler
app.use(errorMiddleware);

const startServer = async () => {
  try {
    await connectDB();
    await sequelize.sync({ alter: true });
    console.log("✅ All tables created successfully!");

    // Create demo user
    await createDemoUser();

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (error) {
    console.error("❌ Failed to start server:", error);
  }
};

startServer();