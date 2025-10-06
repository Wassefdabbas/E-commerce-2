import express from 'express'
import { getProductsDashboard } from '../controllers/dashboardController.js'
import { protectRoute } from '../middlewares/authMiddlewares.js'

const router = express.Router()

router.get('/Products', protectRoute, getProductsDashboard)


export default router