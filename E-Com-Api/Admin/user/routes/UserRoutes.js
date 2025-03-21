import express from 'express';
import User from '../../../Admin/user/models/UserModels.js';
import upload from "../../../config/multerConfig.js";
import bcrypt from 'bcryptjs';
const router = express.Router();

// Create a new user
router.post('/user/create', upload.single("image"), async (req, res) => {
    try {
      const { name, lastname, email, password, mobile_no, gender, user_type, role } = req.body;
      // Check if email already exists
      const existingEmailUser = await User.findOne({ email });
      if (existingEmailUser) {
          return res.status(400).json({ message: 'Email already exists. Please use a different email.' });
      }

      // Check if mobileNo already exists
      const existingMobileUser = await User.findOne({ mobile_no });
      if (existingMobileUser) {
          return res.status(400).json({ message: 'Mobile number already exists. Please use a different mobile number.' });
      }
       // Hash password before saving
        const hashedPassword = await bcrypt.hash(password, 10);
     
     const profilePic = req.file ? req.file.path : ""; 
      const newUser = new User({
        name,
        lastname,
        email,
        password: hashedPassword,
        mobile_no,
        gender,
        user_type,
        image: profilePic,
        role,
      });
      await newUser.save();
      res.status(201).json({ message: "User created successfully", user: newUser });
    } catch (error) {
      res.status(500).json({ message: `Error creating User: ${error.message}`, error: error.message });
    }
  });
  

// Get all active users
router.get('/users/all', async (req, res) => {
  try {
    const users = await User.find({ status: 1 }).populate('role');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error: error.message });
  }
});

// Get a user by ID
router.get('/user/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if(!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error: error.message });
  }
});

// Update a user
router.put('/user/update/:id', upload.single('image'), async (req, res) => {
    try {
        const { name, lastname, gender, role } = req.body;

        let updateData = { name, lastname, gender, role };

        if (req.file) {
            updateData.image = req.file.path; // Update profile picture path if a new file is uploaded
        }
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        if (!updatedUser) return res.status(404).json({ message: 'User not found' });

        res.status(200).json({ message: 'User updated successfully', User: updatedUser });
    } catch (error) {
        res.status(500).json({ message: 'Error updating User', error: error.message });
    }
});

// Soft delete a user (set status to 0)
router.put('/user/delete/:id', async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, { status: 0 }, { new: true });
    if(!updatedUser) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User deleted successfully", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error: error.message });
  }
});

export default router;
