import express from "express";

import { protectRoute } from "../middelware/protectRoute.js";
import { likeUnlikePost, createPost, commetOnPost, deletePost } from "../controllers/post.controllers.js";


const router = express.Router();

router.post("/create", protectRoute, createPost);
router.post("/like/:id", protectRoute, likeUnlikePost);
router.post("/comment/:id", protectRoute, commetOnPost);
router.delete("/", protectRoute, deletePost);


export default router;