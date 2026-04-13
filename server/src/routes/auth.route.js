import express from "express";
import { loginUserController, logoutUserController, registerUserController, getCurrentUserController } from "../controller/auth.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
const router = express.Router();

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */
router.post("/register", registerUserController)

/**
 * @route POST /api/auth/login
 * @desc Login a user with email and password
 * @access Public
 */
router.post("/login", loginUserController)

/**
 * @route POST /api/auth/logout
 * @desc Logout a user
 * @access Private (requires valid token)
 */
router.post("/logout", authMiddleware, logoutUserController)

/**
 * @route GET /api/auth/me
 * @desc Get current logged in user
 * @access Private (requires valid token)
 */
router.get("/get-me", authMiddleware, getCurrentUserController);

export default router;