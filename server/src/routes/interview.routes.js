import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import { generateInterviewReportController, generateResumePdfController, getAllInterviewReportsController, getInterviewReportByIdController } from "../controller/interview.controller.js";
import upload from "../middleware/file.middleware.js"
const interviewRouter = express.Router();


/**
 * @route POST /api/interview/generate-report
 * @desc Generate a new interview report on the basis of user self description, resume and job description
 * @access Private (requires valid token)
 */

interviewRouter.post("/generate-report", authMiddleware, upload.single("resumeFile"), generateInterviewReportController)


/**
 * @route GET /api/interview/report/:interviewId
 * @description get interview report by interviewId.
 * @access private
 */
interviewRouter.get("/report/:interviewId", authMiddleware, getInterviewReportByIdController)

/**
 * @route GET /api/interview/reports
 * @description get all interview reports.
 * @access private
 */
interviewRouter.get("/reports", authMiddleware, getAllInterviewReportsController)


/**
 * @route GET /api/interview/resume/pdf
 * @description generate resume pdf on the basis of user self description, resume content and job description.
 * @access private
 */
interviewRouter.post("/resume/pdf/:interviewReportId", authMiddleware, generateResumePdfController)

export default interviewRouter;