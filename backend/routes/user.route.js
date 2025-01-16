import express  from "express";
import { protectRoute } from "../middelware/protectRoute.js";
import { getUserProfile, followUserProfile } from "../controllers/user.controllers.js";

const router = express.Router();

router.get("/profile/:username",protectRoute, getUserProfile);
// router.get("/update",protectRoute, updateUserProfile);
router.get("/follow/:id",protectRoute, followUserProfile);
// router.get("/suggested",protectRoute, getSuggesteduser);



export default router;