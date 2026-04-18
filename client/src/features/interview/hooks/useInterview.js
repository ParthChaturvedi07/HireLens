import { useContext } from "react";
import { getAllInterviewReports, generateInterviewReport, getInterviewReportById } from "../services/interview.api";
import { InterviewContext } from "../interview.context";

export const useInterview = () => {
    const context = useContext(InterviewContext);

    if (!context) {
        throw new Error("useInterview must be used within InterviewProvider");
    }

    const { loading, setLoading, report, setReport, reports, setReports } = context;

    const generateReport = async ({ jobDescription, selfDescription, resumeFile }) => {
        setLoading(true)
        try {
            const respone = await generateInterviewReport({ jobDescription, selfDescription, resumeFile })
            setReport(respone.interviewReport)
            return respone.interviewReport;
        } catch (err) {
            console.error("Error generating report:", err);
            throw err;
        } finally {
            setLoading(false);
        }
    }

    const getReportById = async (interviewId) => {
        setLoading(true);
        try {
            const respone = await getInterviewReportById(interviewId)
            setReport(respone.interviewReport)
            return respone.interviewReport;
        } catch (error) {
            console.error("Error fetching report:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    }

    const getReports = async () => {
        setLoading(true);
        try {
            const respone = await getAllInterviewReports();
            setReports(respone.interviewReports);
            return respone.interviewReports;
        } catch (error) {
            console.error("Error fetching reports:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    }

    return {
        loading,
        report,
        reports,
        generateReport,
        getReportById,
        getReports
    }
}   
