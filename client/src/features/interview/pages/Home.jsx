import React, { useRef, useState, useEffect } from "react";
import { Sparkles, CheckCircle, FileText, Activity } from "lucide-react";
import "./Home.scss";
import { useInterview } from "../hooks/useInterview";
import { useNavigate } from "react-router";
import gsap from "gsap";

const LoadingOverlay = () => {
    const textRef = useRef(null);
    const [index, setIndex] = useState(0);

    const messages = [
        "Analyzing job description...",
        "Parsing candidate resume...",
        "Calculating match score...",
        "Evaluating core competencies...",
        "Generating targeted questions...",
        "Finalizing interview plan..."
    ];

    useEffect(() => {
        if (!textRef.current) return;

        const tl = gsap.timeline({ repeat: -1 });

        messages.forEach((_, i) => {
            tl.to(textRef.current, {
                opacity: 0,
                y: -10,
                duration: 0.3,
                ease: "power2.in",
                onComplete: () => setIndex((i + 1) % messages.length)
            })
                .to(textRef.current, {
                    opacity: 1,
                    y: 0,
                    duration: 0.4,
                    ease: "power2.out"
                })
                .to({}, { duration: 1.5 });
        });

        return () => {
            tl.kill();
        };
    }, [messages.length]);

    return (
        <main className="loading-container">
            <div className="loader-orbit">
                <div className="loader-core">
                    <Sparkles className="loader-icon" size={32} />
                </div>
                <div className="loader-ring ring-1"></div>
                <div className="loader-ring ring-2"></div>
            </div>
            <h2 className="loading-title">Generating...</h2>
            <div className="loading-text-wrapper">
                <p ref={textRef} className="loading-text">{messages[index]}</p>
            </div>
        </main>
    );
};

export const Home = () => {
    const navigate = useNavigate()
    const { loading, generateReport, reports, getReports } = useInterview();

    useEffect(() => {
        getReports();
    }, []);

    console.log(reports);

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

    if (loading) {
        return <LoadingOverlay />;
    }

    const handleGenerateReport = async () => {
        try {
            const resumeFile = resumeInputRef.current.files[0];

            const data = await generateReport({ jobDescription, selfDescription, resumeFile })
            navigate(`/interview/${data._id}`);
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

            {/* Reports Section */}
            {reports && reports.length > 0 && (
                <section className="reports-section">
                    <h2 className="reports-heading">Recent Reports</h2>
                    <div className="reports-grid">
                        {reports.map((report) => (
                            <div 
                                key={report._id} 
                                className="report-card"
                                onClick={() => navigate(`/interview/${report._id}`)}
                            >
                                <div className="report-card-header">
                                    <h3 className="report-title">{report.title}</h3>
                                    <span className="report-date">
                                        {new Date(report.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="report-card-body">
                                    <div className="score-badge">
                                        <Activity size={16} />
                                        <span>{report.matchScore}% Match</span>
                                    </div>
                                    <div className="card-action">View Report &rarr;</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </main>
    );
};

