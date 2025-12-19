import express from 'express';
import axios from 'axios';
import asyncHandler from 'express-async-handler';
import crypto from 'crypto';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// 1. Initialize Payment
router.post('/init', protect, asyncHandler(async (req, res) => {
    const { orderId, amount, billingData } = req.body;
    try {
        // Step 1: Auth
        const authRes = await axios.post('https://accept.paymob.com/api/auth/tokens', { 
            api_key: process.env.PAYMOB_API_KEY 
        });
        const token = authRes.data.token;
        
        // Step 2: Order Registration
        const orderRes = await axios.post('https://accept.paymob.com/api/ecommerce/orders', {
            auth_token: token,
            delivery_needed: "false",
            amount_cents: Math.round(amount * 100),
            currency: "EGP",
            merchant_order_id: orderId,
            items: []
        });
        
        // Step 3: Payment Key
        const keyRes = await axios.post('https://accept.paymob.com/api/acceptance/payment_keys', {
            auth_token: token,
            amount_cents: Math.round(amount * 100),
            expiration: 3600,
            order_id: orderRes.data.id,
            billing_data: {
                email: billingData.email,
                first_name: billingData.name || "User",
                last_name: "Customer",
                phone_number: billingData.phone || "+201234567890",
                street: billingData.address || "NA",
                building: "NA", floor: "NA", apartment: "NA", city: "Cairo", country: "EG"
            },
            currency: "EGP",
            integration_id: process.env.PAYMOB_INTEGRATION_ID
        });
        
        res.json({ iframeUrl: `https://accept.paymob.com/api/acceptance/iframes/${process.env.PAYMOB_IFRAME_ID}?payment_token=${keyRes.data.token}` });
    } catch (error) {
        console.error("PayMob Init Error:", error.response?.data || error.message);
        res.status(500).json({ message: "Payment Init Failed" });
    }
}));

// 2. Verify Payment 

router.post('/verify', asyncHandler(async (req, res) => {
    const data = req.body;
    console.log("🔹 PAYMOB CALLBACK RECEIVED:", data); 

    
    const success = data.success === 'true' || data.success === true;
    const merchantOrderId = data.merchant_order_id; 

    if (success && merchantOrderId) {
        const order = await Order.findById(merchantOrderId);
        
        if (order) {
            // Update Order Status
            order.isPaid = true;
            order.paidAt = Date.now();
            order.paymentResult = { 
                id: data.id, 
                status: 'COMPLETED', 
                email_address: data.data_message 
            };
            
            // Decrease Stock
            for (const item of order.orderItems) {
                const product = await Product.findById(item.product);
                if(product) { 
                    product.countInStock = Math.max(0, product.countInStock - item.qty); 
                    await product.save(); 
                }
            }
            
            await order.save();
            console.log("✅ SUCCESS: Order paid and saved to DB! Order ID:", merchantOrderId);
            return res.json({ success: true });
        } else {
            console.error("❌ ERROR: Order ID not found in DB:", merchantOrderId);
        }
    } else {
        console.error("❌ PAYMOB SAYS FAILED. Success status is:", data.success);
    }

    return res.json({ success: false, message: 'Transaction Failed' });
}));

export default router;