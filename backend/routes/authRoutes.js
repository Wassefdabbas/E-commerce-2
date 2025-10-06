import express from 'express'
import { login, logout, loginUser, registerUser, logoutUser } from '../controllers/authController.js'
import { protectRoute } from '../middlewares/authMiddlewares.js'

const router = express.Router()

// ALL of these ROUTER have prefix with /api/auth
router.post('/login', login);
router.post('/logout', logout);

router.post('/register', registerUser)
router.post('/userlogin', loginUser)
router.post('/userlogout', logoutUser)

router.get("/me", protectRoute, (req, res) => {
    const { password, ...adminData } = req.admin
    res.json({
        success: true,
        admin: adminData
    });
});


export default router