import express from 'express';
import User from '../models/UserModels.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = express.Router();


// Login Endpoint: POST /api/auth/login
// router.post('/login', async (req, res) => {
//     try {
//       const { email, password } = req.body;
      
//       // Check if the user exists
//       const user = await User.findOne({ email });
//       if (!user) {
//         return res.status(401).json({ message: 'Invalid email or password' });
//       }
  
//       // Compare the password using bcrypt
//       const isMatch = await bcrypt.compare(password, user.password);
//       if (!isMatch) {
//         return res.status(401).json({ message: 'Invalid email or password' });
//       }
  
//       // Generate JWT token
//     //   const token = jwt.sign(
//     //     { userId: user._id, email: user.email },
//     //     // process.env.JWT_SECRET,
//     //    your_secret_key,
//     //     { expiresIn: '1h' }
//     //   );
  
//       res.status(200).json({  message: 'successfully login', user: { id: user._id, email: user.email } });
//     } catch (error) {
//       res.status(500).json({ message: 'Server error', error: error.message });
//     }
//   });

// ✅ Create User
router.post('/create', async (req, res) => {
    try {
        const { userId, name, lastname, email, password, mobile_no, gender, user_type, dob, image, roleId } = req.body;

        const newUser = new User({
            userId,
            name,
            lastname,
            email,
            password,
            mobile_no,
            gender,
            user_type,
            dob,
            image,
            roleId
        });

        await newUser.save();
        res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
        res.status(500).json({ message: 'Error creating user', error: error.message });
    }
});

// ✅ Get All Active Users
router.get('/all', async (req, res) => {
    try {
        const users = await User.find({ status: 1 }).populate('roleId', 'userRole');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
});

// ✅ Get User by ID
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate('userId');
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user', error: error.message });
    }
});

// ✅ Update User
router.put('/update/:id', async (req, res) => {
    try {
        const { name, lastname, mobile_no, gender, user_type, dob, image, roleId } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { name, lastname, mobile_no, gender, user_type, dob, image, roleId },
            { new: true }
        );

        if (!updatedUser) return res.status(404).json({ message: 'User not found' });

        res.status(200).json({ message: 'User updated successfully', user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: 'Error updating user', error: error.message });
    }
});

// ✅ Soft Delete User (Change Status to 0)
router.put('/delete/:id', async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { status: 0 }, // Soft delete
            { new: true }
        );

        if (!updatedUser) return res.status(404).json({ message: 'User not found' });

        res.status(200).json({ message: 'User status changed to inactive', user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: 'Error changing user status', error: error.message });
    }
});

export default router;
