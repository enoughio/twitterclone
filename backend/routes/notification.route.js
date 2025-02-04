import { Router } from "express";
import { protectRoute } from "../middelware/protectRoute.js";
import { getNotifications, deleteNotifications } from "../controllers/notifiaction.controller.js";

const router = Router();


router.get('/', protectRoute, getNotifications);
router.delete('/', protectRoute, deleteNotifications);



export default router;
