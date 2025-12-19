import mongoose from 'mongoose';
import dotenv from 'dotenv';
import colors from 'colors';
import products from '../data/products.js'; 
import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Contact from '../models/Contact.js';

dotenv.config();

console.log("🔍 Checking Environment Variables...");
if (!process.env.MONGO_URI) {
    console.error("❌ ERROR: MONGO_URI is missing from .env file!");
    process.exit(1);
}

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(async () => {
    console.log('✅ Connected! 🌱 Seeding Database...');
    
    // 1. Clear Old Data
    await Order.deleteMany({});
    await Product.deleteMany({});
    await User.deleteMany({});
    await Contact.deleteMany({});
    console.log('🧹 Old data cleared.');

    // 2. Create Admin User
    const adminUser = await User.create({
        name: 'Super Admin',
        email: 'admin@pharmacy.com',
        password: 'admin123',  
        isAdmin: true,
        phone: '01000000000',
        address: 'Headquarters',
        city: 'Alexandria'
    });
    
    console.log('👤 Admin Created: admin@pharmacy.com / admin123');

    // 3. Create Products linked to Admin
    const sampleProducts = products.map(product => {
        return { ...product, user: adminUser._id };
    });

    await Product.insertMany(sampleProducts);
    
    console.log('💊 Local Products Imported Successfully!');
    process.exit();
}).catch(err => { 
    console.error("❌ CONNECTION ERROR:");
    console.error(err.message);
    process.exit(1); 
});