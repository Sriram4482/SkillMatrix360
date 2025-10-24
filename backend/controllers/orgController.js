import Organization from "../models/Organization.js";
import Department from "../models/Department.js";

// ====================== ORGANIZATION CONTROLLERS ======================

// Create a new organization
export const createOrganization = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const org = await Organization.create({ name, description });
    res.status(201).json(org);
  } catch (error) {
    next(error);
  }
};

// Get all organizations (with departments)
export const getOrganizations = async (req, res, next) => {
  try {
    const orgs = await Organization.findAll();
    res.status(200).json(orgs);
  } catch (error) {
    next(error);
  }
};

// Get a single organization by ID
export const getOrganizationById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const org = await Organization.findByPk(id, { include: [{ model: Department }] });
    if (!org) return res.status(404).json({ message: "Organization not found" });
    res.status(200).json(org);
  } catch (error) {
    next(error);
  }
};

// Update an organization
export const updateOrganization = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const org = await Organization.findByPk(id);
    if (!org) return res.status(404).json({ message: "Organization not found" });

    org.name = name || org.name;
    org.description = description || org.description;
    await org.save();

    res.status(200).json(org);
  } catch (error) {
    next(error);
  }
};

// Delete an organization
export const deleteOrganization = async (req, res, next) => {
  try {
    const { id } = req.params;
    const org = await Organization.findByPk(id);
    if (!org) return res.status(404).json({ message: "Organization not found" });

    await org.destroy();
    res.status(200).json({ message: "Organization deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// ====================== DEPARTMENT CONTROLLERS ======================

// Create a new department under an organization
export const createDepartment = async (req, res, next) => {
  try {
    const { name, orgId } = req.body;
    const org = await Organization.findByPk(orgId);
    if (!org) return res.status(404).json({ message: "Organization not found" });

    const dept = await Department.create({ name, orgId });
    res.status(201).json(dept);
  } catch (error) {
    next(error);
  }
};

// Get all departments (with organization info)
export const getDepartments = async (req, res, next) => {
  try {
    const depts = await Department.findAll({
      include: [{ model: Organization }]
    });
    res.status(200).json(depts);
  } catch (error) {
    next(error);
  }
};

// Get a single department by ID
export const getDepartmentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const dept = await Department.findByPk(id, { include: [{ model: Organization }] });
    if (!dept) return res.status(404).json({ message: "Department not found" });
    res.status(200).json(dept);
  } catch (error) {
    next(error);
  }
};

// Update a department
export const updateDepartment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, orgId } = req.body;

    const dept = await Department.findByPk(id);
    if (!dept) return res.status(404).json({ message: "Department not found" });

    if (orgId) {
      const org = await Organization.findByPk(orgId);
      if (!org) return res.status(404).json({ message: "Organization not found" });
      dept.orgId = orgId;
    }

    dept.name = name || dept.name;
    await dept.save();

    res.status(200).json(dept);
  } catch (error) {
    next(error);
  }
};

// Delete a department
export const deleteDepartment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const dept = await Department.findByPk(id);
    if (!dept) return res.status(404).json({ message: "Department not found" });

    await dept.destroy();
    res.status(200).json({ message: "Department deleted successfully" });
  } catch (error) {
    next(error);
  }
};
