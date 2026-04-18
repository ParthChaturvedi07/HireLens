import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true
})

/**
 * @description generate interview report
 * @param {Object} data - interview data
 * @param {string} data.jobDescription - job description
 * @param {string} data.selfDescription - self description
 * @param {File} data.resumeFile - resume file
 * @returns {Promise<Object>} - interview report
 */
export const generateInterviewReport = async ({ jobDescription, selfDescription, resumeFile }) => {
    const formData = new FormData();
    formData.append("jobDescription", jobDescription);
    formData.append("selfDescription", selfDescription);
    formData.append("resumeFile", resumeFile);

    const respone = await api.post(`/interview/generate-report`, formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    })
    return respone.data;
}

/**
 * @description get interview report by id
 * @param {string} interviewId - interview id
 * @returns {Promise<Object>} - interview report
 */
export const getInterviewReportById = async (interviewId) => {
    const respone = await api.get(`/interview/report/${interviewId}`)
    return respone.data;
}

/**
 * @description get all interview reports
 * @returns {Promise<Object>} - interview reports
 */
export const getAllInterviewReports = async () => {
    const respone = await api.get(`/interview/reports`)
    return respone.data;
}

/**
 * @description generate resume pdf
 * @param {string} interviewReportId - interview report id
 * @returns {Promise<Object>} - resume pdf
 */
export const generateResumePdf = async (interviewReportId) => {
    const response = await api.post(`/interview/resume/pdf/${interviewReportId}`, null, {
        responseType: "blob"
    })
    return response.data;
}