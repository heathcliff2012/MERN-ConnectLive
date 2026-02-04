import express from 'express';
import { login, logout, signup, onboarding, verifyEmail, forgotPassword, resetPassword } from '../controllers/auth.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';
import upload from "../middleware/upload.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/verify-email", verifyEmail);
router.post("/login",login);
router.post("/logout",logout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

router.post("/onboarding",protectRoute, upload.single("profilePic"), onboarding);

router.get("/me", protectRoute, async (req, res) => {
    res.status(200).json({ success: true, user: req.user });
});

export default router;