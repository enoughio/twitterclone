import express  from "express";
import { protectRoute } from "../middelware/protectRoute.js";
import { getUserProfile, followUserProfile, getSuggesteduser, updateUser } from "../controllers/user.controllers.js";

const router = express.Router();

router.get("/profile/:username",protectRoute, getUserProfile);
router.post("/update",protectRoute, updateUser);
router.get("/follow/:id",protectRoute, followUserProfile);
router.get("/suggested",protectRoute, getSuggesteduser);



export default router;