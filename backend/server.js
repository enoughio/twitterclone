import express, { urlencoded } from "express";
import dotenv from "dotenv";   // 39min
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";

dotenv.config();

import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import connectMongoDb from "./db/connectMongoDb.js";


const PORT = process.env.PORT || 8000;
const app = express();


app.use(express.json());  // to parse json data
app.use(urlencoded({extended: true}));  // to parse form data

app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);


app.get("/", (req,res) => {
    res.send("server is running")
})


app.listen(PORT, () => {
    connectMongoDb();
    console.log(`http://localhost:${PORT}/`)
})
console.log("Running server ")