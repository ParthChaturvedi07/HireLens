import { PDFParse } from "pdf-parse";
import generateInterviewReport from "../services/ai.services.js";
import interviewReportModel from "../models/interviewReport.model.js";

/**
 * @desc Controller to generate interview report
 * @access Private (requires valid token)
 */

const generateInterviewReportController = async (req, res) => {
    const resumeFile = req.file;
    const { selfDescription, jobDescription } = req.body;

    if (!resumeFile || !selfDescription || !jobDescription) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const parser = new PDFParse({ data: new Uint8Array(resumeFile.buffer) });
    const textResult = await parser.getText();
    const resumeContent = textResult.text;

    const interviewReportByAi = await generateInterviewReport({
        resume: resumeContent,
        selfDescription,
        jobDescription
    });

    const interviewReport = await interviewReportModel.create({
        user: req.user.id,
        resume: resumeContent,
        selfDescription: selfDescription,
        jobDescription: jobDescription,
        ...interviewReportByAi
    })

    return res.status(200).json({
        message: "Interview report generated successfully",
        interviewReport
    });
}

export { generateInterviewReportController };