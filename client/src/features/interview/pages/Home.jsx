import React, { useState } from "react";
import { Sparkles, CheckCircle, FileText } from "lucide-react";
import "./Home.scss";
import { useInterview } from "../hooks/useINterview";
import { useNavigate } from "react-router";

export const Home = () => {
    const navigate = useNavigate()
    const { loading, generateReport } = useInterview();

    const [jobDescription, setJobDescription] = useState("");
    const [selfDescription, setSelfDescription] = useState("");
    const resumeInputRef = useRef();

    const [fileName, setFileName] = useState("");
    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setFileName(e.target.files[0].name);
        } else {
            setFileName("");
        }
    };

    const handleGenerateReport = async () => {
        try {
            const resumeFile = resumeInputRef.current.files[0];

            const data = await generateReport({ jobDescription, selfDescription, resumeFile })
            navigate(`/intevriew/${data._id}`);
        } catch (error) {
            console.log(error);
            // toast.error(error.message);
        }
    }

    return (
        <main className="home-page">
            <header className="home-header">
                <div className="header-badge">
                    <span className="dot"></span>
                    AI-Powered Analysis
                </div>
                <h1 className="header-title">
                    Configure your <span className="highlight">Interview</span>
                </h1>
                <p className="header-description">
                    Provide the job description, your resume, and a self-description to generate tailored interview questions and scenarios.
                </p>
            </header>

            <section className="home-content">
                <div className="form-layout">
                    {/* Left side: Job description */}
                    <div className="form-column">
                        <div className="input-group full-height">
                            <label htmlFor="jobDescription">Job Description</label>
                            <textarea
                                onChange={(e) => { setJobDescription(e.target.value) }}
                                name="jobDescription"
                                id="jobDescription"
                                placeholder="Paste the full job description here..."
                                className="textarea-long"
                            />
                        </div>
                    </div>

                    {/* Right side: Candidate info */}
                    <div className="form-column">
                        <div className="input-group">
                            <label htmlFor="resume">Resume (PDF)</label>
                            <div className="file-upload-wrapper">
                                <input
                                    ref={resumeInputRef}
                                    type="file"
                                    name="resume"
                                    id="resume"
                                    className="file-input"
                                    accept=".pdf,.doc,.docx"
                                    onChange={handleFileChange}
                                />
                                <div className="file-upload-display">
                                    <span className="upload-icon">
                                        {fileName ? <CheckCircle size={32} /> : <FileText size={32} />}
                                    </span>
                                    <span className="upload-text">
                                        {fileName ? fileName : "Click to upload or drag and drop"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="input-group">
                            <label htmlFor="selfDescription">Self Description</label>
                            <textarea
                                onChange={(e) => { setSelfDescription(e.target.value) }}
                                name="selfDescription"
                                id="selfDescription"
                                placeholder="Briefly describe your background, strengths, or specific areas you want the AI to focus on..."
                                className="textarea-short"
                            />
                        </div>

                        <button onClick={handleGenerateReport} className="btn-primary generate-btn">
                            <span className="btn-icon"><Sparkles size={20} /></span> Generate Interview
                        </button>
                    </div>
                </div>
            </section>
        </main>
    );
};

