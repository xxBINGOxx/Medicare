import express from 'express';
import asyncHandler from 'express-async-handler';
import Contact from '../models/Contact.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', asyncHandler(async (req, res) => {
    const contact = await Contact.create(req.body);
    res.status(201).json(contact);
}));

router.get('/', protect, admin, asyncHandler(async (req, res) => {
    const contacts = await Contact.find({}).sort({createdAt: -1});
    res.json(contacts);
}));

router.delete('/:id', protect, admin, asyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id);
    if(contact) {
        await Contact.deleteOne({_id: contact._id});
        res.json({message: 'Message deleted'});
    } else {
        res.status(404); throw new Error('Not found');
    }
}));

export default router;
