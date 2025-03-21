import express from 'express';
import Permission from "../model/PermissionModel.js";

const router = express.Router();
// Create a new Permission
router.post('/permission/create', async (req, res) => {
    try {
      const { tab, actions } = req.body;
    //   if (!tab || !actions) {
    //     return res.status(400).json({ message: 'Tab and actions are required' });
    //   }
      // Generate a unique permissionId
      const permissionId = `PERM-${Date.now()}`;
      const newPermission = new Permission({
        permissionId,
        tab,
        actions, // actions is a string, e.g., "create,update,delete"
        status: 1,
      });
      await newPermission.save();
      res.status(201).json({ message: 'Permission created successfully', permission: newPermission });
    } catch (error) {
      res.status(500).json({ message: 'Error creating permission', error: error.message });
    }
  });
  
  // Get all active permissions
  router.get('/permissions/all', async (req, res) => {
    try {
      const permissions = await Permission.find({ status: 1 });
      res.status(200).json(permissions);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching permissions', error: error.message });
    }
  });
  
  // Get a permission by ID
  router.get('/permission/:id', async (req, res) => {
    try {
      const permission = await Permission.findById(req.params.id);
      if (!permission) return res.status(404).json({ message: 'Permission not found' });
      res.status(200).json(permission);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching permission', error: error.message });
    }
  });
  
  // Update a permission by ID
  router.put('/permission/update/:id', async (req, res) => {
    try {
      const { tab, actions } = req.body;
      if (!tab || !actions) {
        return res.status(400).json({ message: 'Tab and actions are required' });
      }
      const updatedPermission = await Permission.findByIdAndUpdate(
        req.params.id,
        { tab, actions },
        { new: true }
      );
      if (!updatedPermission) return res.status(404).json({ message: 'Permission not found' });
      res.status(200).json({ message: 'Permission updated successfully', permission: updatedPermission });
    } catch (error) {
      res.status(500).json({ message: 'Error updating permission', error: error.message });
    }
  });
  
  // Soft delete a permission (set status to 0)
  router.put('/permission/delete/:id', async (req, res) => {
    try {
      const updatedPermission = await Permission.findByIdAndUpdate(
        req.params.id,
        { status: 0 },
        { new: true }
      );
      if (!updatedPermission) return res.status(404).json({ message: 'Permission not found' });
      res.status(200).json({ message: 'Permission deleted successfully', permission: updatedPermission });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting permission', error: error.message });
    }
  });

export default router;
