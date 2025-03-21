import express from 'express';
import Role from "../../../Admin/Roles/models/RoleModel.js";

const router = express.Router();

// Create a new Role
router.post('/role/create', async (req, res) => {
  try {
    const { name, permissions } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Role name is required" });
    }
    // Generate a unique roleId using timestamp (or use UUID)
    const roleId = `ROLE-${Date.now()}`;
    // permissions is expected as an array of permission ids
    const newRole = new Role({ roleId, name, permissions, status: 1 });
    await newRole.save();
    res.status(201).json({ message: "Role created successfully", role: newRole });
  } catch (error) {
    res.status(500).json({ message: "Error creating role", error: error.message });
  }
});

// Get all active Roles
router.get('/roles/all', async (req, res) => {
  try {
    const roles = await Role.find({ status: 1 }).populate('permissions');
    res.status(200).json(roles);
  } catch (error) {
    res.status(500).json({ message: "Error fetching roles", error: error.message });
  }
});

// Get a role by ID
router.get('/role/:id', async (req, res) => {
  try {
    const role = await Role.findById(req.params.id).populate('permissions');
    if (!role) return res.status(404).json({ message: "Role not found" });
    res.status(200).json(role);
  } catch (error) {
    res.status(500).json({ message: "Error fetching role", error: error.message });
  }
});

// Update a role by ID
router.put('/role/update/:id', async (req, res) => {
  try {
    const { name, permissions } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Role name is required" });
    }
    const updatedRole = await Role.findByIdAndUpdate(
      req.params.id,
      { name, permissions },
      { new: true }
    ).populate('permissions');
    if (!updatedRole) return res.status(404).json({ message: "Role not found" });
    res.status(200).json({ message: "Role updated successfully", role: updatedRole });
  } catch (error) {
    res.status(500).json({ message: "Error updating role", error: error.message });
  }
});

// Soft delete a role (set status to 0)
router.put('/role/delete/:id', async (req, res) => {
  try {
    const updatedRole = await Role.findByIdAndUpdate(
      req.params.id,
      { status: 0 },
      { new: true }
    );
    if (!updatedRole) return res.status(404).json({ message: "Role not found" });
    res.status(200).json({ message: "Role deleted successfully", role: updatedRole });
  } catch (error) {
    res.status(500).json({ message: "Error deleting role", error: error.message });
  }
});

export default router;
