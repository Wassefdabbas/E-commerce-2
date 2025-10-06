import express from 'express';
import { addToCart, getCart, updateCart, removeItem, clearCart } from '../controllers/cartController.js';
import { protectRoute } from '../middlewares/authUser.js';

const router = express.Router();

router.get('/getCart', protectRoute, getCart)
router.post('/addToCart', protectRoute, addToCart)
router.post('/updateCart', protectRoute, updateCart)
router.post("/removeItem", protectRoute, removeItem);
router.post("/clearCart", protectRoute, clearCart);

export default router;