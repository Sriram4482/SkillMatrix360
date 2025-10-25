import dotenv from "dotenv";
import { Sequelize } from "sequelize";

dotenv.config();

let sequelize;

if (process.env.DATABASE_URL) {
  // Use PostgreSQL from Render
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  });
  console.log("📊 Using PostgreSQL database (Production)");
} else {
  // Fallback for local development
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite',
    logging: false
  });
  console.log("📊 Using SQLite database (Development)");
}

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected successfully!");
    return true;
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    throw error;
  }
};

export { sequelize };