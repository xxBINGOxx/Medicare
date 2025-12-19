import express from 'express';
import asyncHandler from 'express-async-handler';
import Product from '../models/Product.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import multer from 'multer';
import path from 'path';

const router = express.Router();

const storage = multer.diskStorage({
    destination(req, file, cb) { cb(null, 'uploads/') },
    filename(req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`)
    }
});
const upload = multer({ storage });

// 1. Get All Products
router.get('/', asyncHandler(async (req, res) => {
    const products = await Product.find({});
    res.json(products);
}));

// 2. Get Single Product
router.get('/:id', asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if(product) res.json(product);
    else { res.status(404); throw new Error('Product not found'); }
}));

// 3. Create Product (Uses Multer for Image)
router.post('/', protect, admin, upload.single('image'), asyncHandler(async (req, res) => {
    const { name, price, category, description, countInStock, tags } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : '/uploads/sample.jpg';
    
    const product = new Product({
        name, price, category, description, countInStock, image, 
        tags: tags ? tags.split(',').map(t=>t.trim()) : []
    });
    const created = await product.save();
    res.status(201).json(created);
}));

// 4. Delete Product
router.delete('/:id', protect, admin, asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
        await Product.deleteOne({ _id: product._id });
        res.json({ message: 'Product removed' });
    } else {
        res.status(404); throw new Error('Product not found');
    }
}));

// 5. UPDATE PRODUCT (NEW! Added for Stock Management)
router.put('/:id', protect, admin, asyncHandler(async (req, res) => {
    const { name, price, description, image, category, countInStock, tags } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
        product.name = name || product.name;
        product.price = price || product.price;
        product.description = description || product.description;
        product.category = category || product.category;
        product.image = image || product.image;
        
        if(tags) {
             product.tags = tags.split(',').map(t => t.trim());
        }

        if (countInStock !== undefined) {
            product.countInStock = countInStock;
        }

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
}));

export default router;