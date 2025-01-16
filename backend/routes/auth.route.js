import express from "express";

import { getMe, login, logout, signup } from "../controllers/auth.controller.js";
import { protectRoute } from "../middelware/protectRoute.js";


const router = express.Router();

// signup route
router.post("/signup", signup)

// signin route
router.post("/login", login)

// logout route
router.post("/logout", logout)  

// check user authentication
router.get("/me",protectRoute, getMe)  


export default router;