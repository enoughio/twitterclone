import express from "express";


import { logout, signin, signup } from "../controllers/auth.controller.js";


const router = express.Router();

// signup route
router.get("/signup", signup)

// signin route
router.get("/signin", signin)

// logout route
router.get("/logout", logout)  


export default router;