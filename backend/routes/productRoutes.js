import express from 'express';
import {
  getProducts,
  getProductById,
  getOfferProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductCategories,
  getAllProductsAdmin,
  updateProductStatus,
} from '../controllers/productController.js';
import { protectRoute } from '../middlewares/authMiddlewares.js';
import upload from '../utils/cloudinary.js';

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/offers', getOfferProducts); // Fixed: was separate export
router.get('/categories', getProductCategories);
router.get('/:id', getProductById);

// Admin routes
router.get('/admin/all', protectRoute, getAllProductsAdmin);
router.post('/', protectRoute, upload.array('images', 4), createProduct);
router.put('/:id', protectRoute, upload.array('images', 4), updateProduct);
router.patch('/:id/status', protectRoute, updateProductStatus);

router.delete('/:id', protectRoute, deleteProduct);

export default router;