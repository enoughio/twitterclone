import express, { urlencoded } from "express";
import dotenv from "dotenv";   
import cookieParser from "cookie-parser";
import cors from "cors";  // Import cors
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";

import connectMongoDb from "./db/connectMongoDb.js";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import postRoutes from "./routes/post.route.js";
import notificationRoutes from "./routes/notification.route.js";

dotenv.config();

// Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET  // Fix typo: SECCRET -> SECRET
});

const PORT = process.env.PORT || 8000;
const app = express();

// ✅ Enable CORS
app.use(cors({
    origin: "http://localhost:3000", // Allow requests from frontend
    credentials: true, // Allow cookies and authorization headers
}));

app.use(express.json());  
app.use(urlencoded({ extended: true }));  
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);
app.use("/api/notification", notificationRoutes);

app.get("/", (req, res) => {
    res.send("server is running");
});

app.listen(PORT, () => {
    connectMongoDb();
    console.log(`http://localhost:${PORT}/`);
});
console.log("Running server");
