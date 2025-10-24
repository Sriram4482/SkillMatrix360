import express from "express";
import {
  // Organization controllers
  createOrganization,
  getOrganizations,
  getOrganizationById,
  updateOrganization,
  deleteOrganization,
  // Department controllers
  createDepartment,
  getDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment
} from "../controllers/orgController.js";

const router = express.Router();

// ====================== ORGANIZATION ROUTES ======================

// Create a new organization
router.post("/orgs", createOrganization);

// Get all organizations
router.get("/orgs", getOrganizations);

// Get a single organization by ID
router.get("/orgs/:id", getOrganizationById);

// Update an organization
router.put("/orgs/:id", updateOrganization);

// Delete an organization
router.delete("/orgs/:id", deleteOrganization);

// ====================== DEPARTMENT ROUTES ======================

// Create a new department
router.post("/dept", createDepartment);

// Get all departments
router.get("/dept", getDepartments);

// Get a single department by ID
router.get("/dept/:id", getDepartmentById);

// Update a department
router.put("/dept/:id", updateDepartment);

// Delete a department
router.delete("/dept/:id", deleteDepartment);

export default router;
