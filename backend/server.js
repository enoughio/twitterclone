import express from "express";
import dotenv from "dotenv";   // 39min
import cookieParser from "cookie-parser";

dotenv.config();

import authRoutes from "./routes/auth.route.js";
import connectMongoDb from "./db/connectMongoDb.js";


const PORT = process.env.PORT || 8000;
const app = express();


app.use(express.json());  // to parse json data


app.use("/api/auth", authRoutes);


app.get("/", (req,res) => {
    res.send("server is running")
})


app.listen(PORT, () => {
    connectMongoDb();
    console.log(`http://localhost:${PORT}/`)
})
console.log("Running server ")