import express from "express";
import "dotenv/config";
import connectDB from "./config/db.js";
import cors from "cors";
import rateLimit from "express-rate-limit";
import helmet from "helmet"
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRouter from './routes/orderRoutes.js'
import dashboardRoutes from "./routes/dashboardRoutes.js";

const app = express();
const PORT = process.env.PORT || 5001;
const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    // "https://e-commerce-frontend-snowy-rho.vercel.app",
    // "https://e-commerce-admin-three-wine.vercel.app"
  ];
app.use(cors({
    origin: function(origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) return callback(null, true);
        return callback(new Error("Not allowed by CORS"));
    },
    credentials: true
}));
// app.use(cors())
app.use(helmet());
app.use(express.json());
app.use(cookieParser());

// Basizc rate limiting to protect auth and product routes
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 300 });
app.use(limiter);

// Mount your routes before starting the server
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRouter);

app.use("/api/dashboard", dashboardRoutes);

app.get("/", (req, res) => {
    res.send("server running!");
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});


const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Server is running on port: http://localhost:${PORT}`);
        });

    } catch (err) {
        console.error("Failed to connect to DB", err);
        process.exit(1);
    }
};

startServer();