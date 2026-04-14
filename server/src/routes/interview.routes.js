import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import { generateInterviewReportController } from "../controller/interview.controller.js";
import upload from "../middleware/file.middleware.js"
const interviewRouter = express.Router();


/**
 * @route POST /api/interview/generate-report
 * @desc Generate a new interview report on the basis of user self description, resume and job description
 * @access Private (requires valid token)
 */

interviewRouter.post("/generate-report", authMiddleware, upload.single("resumeFile"), generateInterviewReportController)

export default interviewRouter;