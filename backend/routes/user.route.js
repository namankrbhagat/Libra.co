import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getProfile, getUserHistory } from "../controller/user.controller.js";

const router = express.Router();

router.get("/profile", protectRoute, getProfile);
router.get("/history", protectRoute, getUserHistory);

export default router;
