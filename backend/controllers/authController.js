import Admin from "../models/Admin.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import User from "../models/User.js"


//  LOG-IN CONTROLLER //
export const login = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ message: "All fields are Required" })
        }

        const admin = await Admin.findOne({ email })
        if (!admin) {
            return res.status(401).json({ message: "Invalid Email or Password" })
        }

        const isPasswordCorrect = await admin.matchPassword(password)
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: "Invalid Email or Password" })
        }

        // create the token and cookie
        const token = jwt.sign(
            { adminId: admin._id },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "7d" }
        )

        const isProd = process.env.NODE_ENV === "production"
        res.cookie("token", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: isProd ? "none" : "lax",
            secure: isProd
        })

        const adminData = admin.toObject()
        delete adminData.password
        res.status(200).json({ success: true, admin: adminData })
    } catch (error) {
        console.log("Error in login controller", error)
        res.status(500).json({ message: "Server Error" })
    }
}

//  LOG-OUT CONTROLLER //
export const logout = (req, res) => {
    res.clearCookie("token")
    res.status(200).json({ success: true, message: "Logout successfully" })
}


// USER REGISTER CONTROLLER
export const registerUser = async (req, res) => {
    const { name, email, password} = req.body;

    try {
        if (!name || !email || !password) {
            return res.status(400).json({success: false, message: "All fields are Required" })
        }

        if (password.length < 8) {
            return res.status(400).json({success: false, message: "Password must be at least 8 characters" })
        }

        // Regular Expression for check from the shape of email that has @
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({success: false, message: "Invalid email format" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({success: false, message: "Email already existing, please use a different one" })
        }

        // create the new User
        const newUser = await User.create({
            name,
            email,
            password,
        })

        const userData = newUser.toObject()
        delete userData.password

        // create the token and cookie
        const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET_KEY, {
            expiresIn: "7d"
        })

        const isProd = process.env.NODE_ENV === "production"
        res.cookie("token", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 day in millie Secund
            httpOnly: true, // prevent XSS attacks // can't access cookie from JavaScript
            sameSite: isProd ? "none" : "lax", // prevent CSRF attacks // Prevents the browser from sending cookies in cross-site requests
            secure: isProd
        })

        res.status(201).json({ success: true, user: userData, token, message: "Creating New User" })

    } catch (error) {
        console.log("Error in signup controller", error)
        res.status(500).json({success: false, message: "Server Error" })
    }
}

// USER LOGIN CONTROLLER
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({success: false, message: "All fields are Required" })
        }

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(401).json({success: false, message: "Invalid Email or Password" })
        }

        const isPasswordCorrect = await user.matchPassword(password)
        if (!isPasswordCorrect) {
            return res.status(401).json({success: false, message: "Invalid Email or Password" })
        }

        // create the token and cookie
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "7d" }
        )

        const isProd = process.env.NODE_ENV === "production"
        res.cookie("token", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: isProd ? "none" : "lax",
            secure: isProd
        })

        const userData = user.toObject()
        delete userData.password
        res.status(200).json({ success: true, token, user: userData })
    } catch (error) {
        console.log("Error in login controller", error)
        res.status(500).json({success: false, message: "Server Error" })
    }
}

//  LOG-OUT CONTROLLER //
export const logoutUser = (req, res) => {
    res.clearCookie("token")
    res.status(200).json({ success: true, message: "Logout successfully" })
}