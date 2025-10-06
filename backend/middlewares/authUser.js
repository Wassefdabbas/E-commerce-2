import jwt from "jsonwebtoken"
import User from "../models/User.js"

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.token

        if (!token) {
            return res.status(401).json({ message: "Unauthorized = No token provided" })
        }

        let decoded;
        try {
          decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        } catch (err) {
          return res.status(401).json({ success: false, message: "Unauthorized: Invalid or expired token" });
        }

        const user = await User.findById(decoded.userId).select("-password")

        if (!user) {
            return res.status(401).json({ message: "Unauthorized = User not found" })
        }

        req.user = user

        next();
    } catch (error) {
        console.log("Error in protectRoute middleware", error)
        return res.status(401).json({ message: "Token expired or invalid" });
    }
}
