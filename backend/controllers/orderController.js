import Order from "../models/Order.js";
import User from "../models/User.js";

export const placeOrderCOD = async (req, res) => {
    try {
        const { items, amount, address } = req.body
        const userId = req.user?._id
        const orderDate = {
            userId,
            items,
            amount,
            address,
            paymentMethod: 'cod',
            payment: false,
            date: Date.now()
        }

        const newOrder = new Order(orderDate)
        await newOrder.save()

        await User.findByIdAndUpdate(userId, { cartData: {} })

        res.status(201).json({ success: true, message: 'Order placed successfully' })
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' })
    }

}

export const allOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .sort({ date: -1 }); // newest first

    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("Error fetching all orders:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const userOrders = async (req, res) => {
    try {
        const userId = req.user?._id
        const orders = await Order.find({ userId }).sort({ date: -1 })
        res.status(200).json({ success: true, orders })

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' })
    }
}

export const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;

        // 1. Validate input
        const allowedStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"];
        if (!orderId || !status) {
            return res.status(400).json({ success: false, message: "Missing Order ID or Status." });
        }
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ success: false, message: "Invalid status value." });
        }

        // 2. Find and update the order
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found." });
        }

        order.status = status;
        await order.save();

        res.status(200).json({ success: true, message: "Order status updated successfully" });
    } catch (error) {
        console.error("Error updating order status:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};