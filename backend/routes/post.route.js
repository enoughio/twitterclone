import express from "express";

import { protectRoute } from "../middelware/protectRoute.js";
import { createPost, deletePost, commetOnPost, likeUnlikePost, getAllPost, getLikedPost, getFollowedPost } from "../controllers/post.controllers.js";


const router = express.Router();

router.get("/likes/:id", protectRoute, getLikedPost);
router.get("/following", protectRoute, getFollowedPost);
router.get("/likes/:id", protectRoute, getLikedPost);
router.get("/all", protectRoute, getAllPost);
router.post("/create", protectRoute, createPost);
router.post("/like/:id", protectRoute, likeUnlikePost);
router.post("/comment/:id", protectRoute, commetOnPost);
router.delete("/:id", protectRoute, deletePost);


export default router;