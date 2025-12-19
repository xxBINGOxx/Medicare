import express from 'express';
import asyncHandler from 'express-async-handler';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// 1. Create Order
router.post('/', protect, asyncHandler(async (req, res) => {
    const { orderItems, shippingAddress, totalPrice } = req.body;
    if (orderItems && orderItems.length === 0) { res.status(400); throw new Error('No order items'); }
    
    if (shippingAddress) {
        shippingAddress.city = 'Alexandria';
        shippingAddress.country = 'Egypt';
    }

    for (const item of orderItems) {
        const product = await Product.findById(item.product);
        if (!product || product.countInStock < item.qty) {
            res.status(400); throw new Error(`Not enough stock for ${item.name}`);
        }
    }

    const order = new Order({
        orderItems, user: req.user._id, shippingAddress, paymentMethod: 'Paymob', totalPrice
    });
    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
}));

// 2. Get User's Orders
router.get('/myorders', protect, asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id }).sort({createdAt: -1});
    res.json(orders);
}));

// 3. Get All Orders (Admin)
router.get('/', protect, admin, asyncHandler(async (req, res) => {
    const orders = await Order.find({}).populate('user', 'id name email').sort({createdAt: -1});
    res.json(orders);
}));

// --- 4. NEW: GET SINGLE ORDER BY ID ---
router.get('/:id', protect, asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (order) {
        if (req.user.isAdmin || order.user._id.equals(req.user._id)) {
            res.json(order);
        } else {
            res.status(401);
            throw new Error('Not authorized to view this order');
        }
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
}));

// 5. Update Order Status (Admin)
router.put('/:id/status', protect, admin, asyncHandler(async (req, res) => {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (order) {
        order.status = status;
        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
}));

export default router;