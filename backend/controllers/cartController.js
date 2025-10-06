import User from "../models/User.js";

// Helper function to find a user by ID
const findUser = (id) => User.findById(id);

// add product to user cart
export const addToCart = async (req, res) => {
    try {
        const { itemId, size } = req.body;
        const user = await findUser(req.user._id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const { cartData } = user;
        if (!cartData[itemId]) {
            cartData[itemId] = {};
        }
        cartData[itemId][size] = (cartData[itemId][size] || 0) + 1;

        // Mark 'cartData' as modified since it's a nested object
        user.markModified('cartData');
        await user.save();

        // Return the updated cart
        res.status(200).json({ success: true, message: "Product added to cart", cartData: user.cartData });
    } catch (error) {
        console.log("Error in addToCart controller:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// update user cart
export const updateCart = async (req, res) => {
    try {
        const { itemId, size, quantity } = req.body;
        const user = await findUser(req.user._id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const { cartData } = user;
        if (cartData[itemId]?.[size] !== undefined) {
            cartData[itemId][size] = quantity;
        } else {
            return res.status(404).json({ success: false, message: "Item not found in cart" });
        }

        user.markModified('cartData');
        await user.save();

        res.status(200).json({ success: true, message: "Cart updated", cartData: user.cartData });
    } catch (error) {
        console.log("Error in updateCart controller:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// get user cart
export const getCart = async (req, res) => {
    try {
        const user = await findUser(req.user._id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.status(200).json({ success: true, cartData: user.cartData });
    } catch (error) {
        console.log("Error in getCart controller:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// remove item from cart (CORRECTED)
export const removeItem = async (req, res) => {
    try {
        const { itemId, size } = req.body;
        const user = await findUser(req.user._id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const { cartData } = user;
        // Check if the item and size exist before trying to delete
        if (cartData[itemId]?.[size] !== undefined) {
            // Delete the specific size from the item
            delete cartData[itemId][size];

            // If the item has no more sizes left, remove the item entry itself
            if (Object.keys(cartData[itemId]).length === 0) {
                delete cartData[itemId];
            }
        } else {
            return res.status(404).json({ success: false, message: "Item not found in cart" });
        }

        user.markModified('cartData');
        await user.save();

        // Return the updated cart so the frontend can sync
        res.status(200).json({ success: true, message: "Item removed", cartData: user.cartData });
    } catch (error) {
        console.log("Error in removeItem controller:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// Clear the cart (CORRECTED)
export const clearCart = async (req, res) => {
    try {
        const user = await findUser(req.user._id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Simply reset the cartData object to be empty
        user.cartData = {};
        await user.save();

        // Return the new empty cart
        res.status(200).json({ success: true, message: "Cart cleared", cartData: user.cartData });
    } catch (error) {
        console.log("Error in clearCart controller:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};