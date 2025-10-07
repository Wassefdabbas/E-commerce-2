import express from 'express';
import { addToCart, getCart, updateCart, removeItem, clearCart } from '../controllers/cartController.js';
import { userProtectRoute } from '../middlewares/authUser.js';

const router = express.Router();

router.get('/getCart', userProtectRoute, getCart)
router.post('/addToCart', userProtectRoute, addToCart)
router.post('/updateCart', userProtectRoute, updateCart)
router.post("/removeItem", userProtectRoute, removeItem);
router.post("/clearCart", userProtectRoute, clearCart);

export default router;