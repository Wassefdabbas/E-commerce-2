import express from 'express'
import { allOrders, placeOrderCOD, updateStatus, userOrders } from '../controllers/orderController.js'
import { protectRoute } from '../middlewares/authMiddlewares.js'
import { userProtectRoute } from '../middlewares/authUser.js'

const orderRouter = express.Router()
// Admin
orderRouter.post('/list', protectRoute ,allOrders)
orderRouter.post('/status', protectRoute ,updateStatus)

// Payment
orderRouter.post('/cod', userProtectRoute, placeOrderCOD)

// User
orderRouter.post('/userOrders', userProtectRoute ,userOrders)

export default orderRouter