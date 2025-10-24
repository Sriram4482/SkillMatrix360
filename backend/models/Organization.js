import { DataTypes } from "sequelize";
import { sequelize } from "../config.js";

const Organization = sequelize.define("Organization", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.STRING },
});

export default Organization;
