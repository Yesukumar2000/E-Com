import express from 'express';
import UserRole from '../models/UserRoleModel.js';

const router = express.Router();

// ✅ Create User Role
router.post('/create', async (req, res) => {
    try {
        const { userId, userRole } = req.body;

        const newUserRole = new UserRole({ userId, userRole });
        await newUserRole.save();

        res.status(201).json({ message: 'User role created successfully', userRole: newUserRole });
    } catch (error) {
        res.status(500).json({ message: 'Error creating user role', error: error.message });
    }
});

// ✅ Get All User Roles (Only Active)
router.get('/all', async (req, res) => {
    try {
        const userRoles = await UserRole.find({ status: 1 });
        res.status(200).json(userRoles);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user roles', error: error.message });
    }
});

// ✅ Get User Role by ID
router.get('/:id', async (req, res) => {
    try {
        const userRole = await UserRole.findById(req.params.id).populate('userId', 'name email');
        if (!userRole) return res.status(404).json({ message: 'User role not found' });

        res.status(200).json(userRole);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user role', error: error.message });
    }
});

// ✅ Update User Role
router.put('/update/:id', async (req, res) => {
    try {
        const { userRole } = req.body;

        const updatedUserRole = await UserRole.findByIdAndUpdate(
            req.params.id,
            { userRole },
            { new: true }
        );

        if (!updatedUserRole) return res.status(404).json({ message: 'User role not found' });

        res.status(200).json({ message: 'User role updated successfully', userRole: updatedUserRole });
    } catch (error) {
        res.status(500).json({ message: 'Error updating user role', error: error.message });
    }
});

// ✅ Soft Delete (Set status to 0 instead of deleting)
router.put('/delete/:id', async (req, res) => {
    try {
        const updatedUserRole = await UserRole.findByIdAndUpdate(
            req.params.id,
            { status: 0 }, // Set status to Inactive (0)
            { new: true }
        );

        if (!updatedUserRole) return res.status(404).json({ message: 'User role not found' });

        res.status(200).json({ message: 'User role status changed to inactive', userRole: updatedUserRole });
    } catch (error) {
        res.status(500).json({ message: 'Error changing user role status', error: error.message });
    }
});

export default router;
