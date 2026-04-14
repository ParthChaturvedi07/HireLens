import express from "express";
import { loginUserController, logoutUserController, registerUserController, getCurrentUserController } from "../controller/auth.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
const authRouter = express.Router();

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */
authRouter.post("/register", registerUserController)

/**
 * @route POST /api/auth/login
 * @desc Login a user with email and password
 * @access Public
 */
authRouter.post("/login", loginUserController)

/**
 * @route POST /api/auth/logout
 * @desc Logout a user
 * @access Private (requires valid token)
 */
authRouter.post("/logout", authMiddleware, logoutUserController)

/**
 * @route GET /api/auth/me
 * @desc Get current logged in user
 * @access Private (requires valid token)
 */
authRouter.get("/get-me", authMiddleware, getCurrentUserController);

export default authRouter;