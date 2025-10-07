import jwt from "jsonwebtoken"
import Admin from "../models/Admin.js"

export const protectRoute = async (req, res, next) => {
    try {
        const admin_token = req.cookies.admin_token

        if (!admin_token) {
            return res.status(401).json({ message: "Unauthorized = No admin_token provided" })
        }

        let decoded;
        try {
          decoded = jwt.verify(admin_token, process.env.JWT_SECRET_KEY);
        } catch (err) {
          return res.status(401).json({ success: false, message: "Unauthorized: Invalid or expired admin_token" });
        }

        const admin = await Admin.findById(decoded.adminId).select("-password")

        if (!admin) {
            return res.status(401).json({ message: "Unauthorized = User not found" })
        }

        req.admin = admin

        next();
    } catch (error) {
        console.log("Error in protectRoute middleware", error)
        return res.status(401).json({ message: "admin_token expired or invalid" });

    }
}
