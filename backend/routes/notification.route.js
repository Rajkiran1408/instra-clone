import express, { Router } from "express";
import protectRoute from "../middleware/protectRoute.js";

import {getNotification,deleteNotification} from "../controllers/notification.controllers.js"

const router=express.Router();

router.get("/",protectRoute,getNotification);
router.delete("/", protectRoute, deleteNotification);

export default router;