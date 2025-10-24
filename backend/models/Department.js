import { DataTypes } from "sequelize";
import { sequelize } from "../config.js";
import Organization from "./Organization.js";

const Department = sequelize.define("Department", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
});

// Relationships
Organization.hasMany(Department, { foreignKey: "orgId", onDelete: "CASCADE" });
Department.belongsTo(Organization, { foreignKey: "orgId" });

export default Department;
