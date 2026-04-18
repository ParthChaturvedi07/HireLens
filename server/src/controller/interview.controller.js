import { PDFParse } from "pdf-parse";
import { generateInterviewReport, generateResumePdf } from "../services/ai.services.js";
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

/**
 * @desc Controller to get interview report by ID
 * @access Private (requires valid token)
 */
const getInterviewReportByIdController = async (req, res) => {
    const { interviewId } = req.params;

    const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id })

    if (!interviewReport) {
        return res.status(404).json({ message: "Interview report not found" });
    }

    return res.status(200).json({
        message: "Interview report fetched successfully",
        interviewReport
    });
}

/**
 * @desc Controller to get all interview reports
 * @access Private (requires valid token)
 */
const getAllInterviewReportsController = async (req, res) => {
    const interviewReports = await interviewReportModel.find({ user: req.user.id }).sort({ createdAt: -1 }).select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan")

    return res.status(200).json({
        message: "Interview reports fetched successfully",
        interviewReports
    });
}

/**
 * @description Controller to generate ATS friendly resume
 */

const generateResumePdfController = async (req, res) => {
    const { interviewReportId } = req.params;

    const interviewReport = await interviewReportModel.findById(interviewReportId);

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found"
        });
    }

    const { resume, jobDescription, selfDescription } = interviewReport;

    const pdfBuffer = await generateResumePdf({ resume, jobDescription, selfDescription });

    res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`
    })

    res.send(pdfBuffer);
}

export { generateInterviewReportController, getInterviewReportByIdController, getAllInterviewReportsController, generateResumePdfController };