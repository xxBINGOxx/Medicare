import express from 'express';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import bcrypt from 'bcryptjs'; 
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

const SUPER_ADMIN_EMAIL = 'admin@pharmacy.com';

// 1. UPDATE OWN PROFILE
router.put('/profile', protect, asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.phone = req.body.phone || user.phone;
        user.address = req.body.address || user.address;
        user.city = 'Alexandria'; 

        if (req.body.password) {
            if (!req.body.oldPassword) {
                res.status(400); throw new Error('You must enter your Current Password to change it.');
            }
            if (await user.matchPassword(req.body.oldPassword)) {
                user.password = req.body.password;
            } else {
                res.status(401); throw new Error('Invalid Current Password');
            }
        }
        const updatedUser = await user.save();
        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            phone: updatedUser.phone,
            address: updatedUser.address,
            city: updatedUser.city,
            isAdmin: updatedUser.isAdmin,
            token: req.token 
        });
    } else {
        res.status(404); throw new Error('User not found');
    }
}));



// 2. GET ALL USERS
router.get('/', protect, admin, asyncHandler(async (req, res) => {
    const users = await User.find({});
    res.json(users);
}));

// 3. DELETE USER (Super Admin)
router.delete('/:id', protect, admin, asyncHandler(async (req, res) => {
    const userToDelete = await User.findById(req.params.id);
    const currentUser = req.user;

    if (userToDelete) {
        // Rule A: Nobody can delete the Super Admin
        if (userToDelete.email === SUPER_ADMIN_EMAIL) {
            res.status(400); throw new Error('Cannot delete the Super Admin');
        }

        // Rule B: If target is an Admin, ONLY Super Admin can delete them
        if (userToDelete.isAdmin && currentUser.email !== SUPER_ADMIN_EMAIL) {
            res.status(403); throw new Error('Only Super Admin can delete other Admins');
        }

        await User.deleteOne({ _id: userToDelete._id });
        res.json({ message: 'User removed' });
    } else {
        res.status(404); throw new Error('User not found');
    }
}));

// 4. TOGGLE ADMIN ROLE (Super Admin Only)
router.put('/:id/role', protect, admin, asyncHandler(async (req, res) => {
    
    if (req.user.email !== SUPER_ADMIN_EMAIL) {
        res.status(403); throw new Error('Not Authorized. Only Super Admin can change roles.');
    }

    const user = await User.findById(req.params.id);
    if(user) {
        // Prevent changing Super Admin's own role
        if(user.email === SUPER_ADMIN_EMAIL) {
             res.status(400); throw new Error('Cannot change Super Admin role');
        }

        user.isAdmin = !user.isAdmin; 
        const updatedUser = await user.save();
        res.json({ _id: updatedUser._id, isAdmin: updatedUser.isAdmin });
    } else {
        res.status(404); throw new Error('User not found');
    }
}));

// 5. ADMIN FORCE RESET PASSWORD (New Feature)
router.put('/:id/force-password', protect, admin, asyncHandler(async (req, res) => {
    
    const userToUpdate = await User.findById(req.params.id);
    
    if (userToUpdate) {
         if (userToUpdate.isAdmin && req.user.email !== SUPER_ADMIN_EMAIL) {
             res.status(403); throw new Error('Only Super Admin can reset Admin passwords');
         }
         
         userToUpdate.password = req.body.password; 
         await userToUpdate.save();
         res.json({ message: 'Password updated successfully' });
    } else {
        res.status(404); throw new Error('User not found');
    }
}));

export default router;