import React, { useState } from 'react';
import { useParams } from 'react-router';
import {
  Briefcase,
  Target,
  AlertTriangle,
  Calendar,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  CheckCircle2,
  BrainCircuit,
  MessageSquare,
  Activity,
  User,
  Clock,
  FileText,
  Loader2,
  X,
  Download
} from 'lucide-react';
import './Interview.scss';
import { useInterview } from '../hooks/useInterview';

const QuestionItem = ({ question, index }) => {
  const [isOpen, setIsOpen] = useState(false);

  const { report } = useInterview();

  return (
    <div className={`question-card ${isOpen ? 'open' : ''}`}>
      <button
        className="question-header"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className="question-title">
          {index + 1}. {question.question}
        </span>
        <span className="toggle-icon">
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </span>
      </button>

      {isOpen && (
        <div className="question-content">
          <div className="content-box intention">
            <div className="box-title">
              <Target size={16} /> Why they are asking this
            </div>
            <p>{question.intention}</p>
          </div>

          <div className="content-box answer">
            <div className="box-title">
              <Lightbulb size={16} /> Recommended Answer Strategy
            </div>
            <p>{question.answer}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export const Interview = () => {
  const { interviewId } = useParams();
  const { report, getReportById, loading, getResumeUrl } = useInterview();

  const [resumeUrl, setResumeUrl] = useState(null);
  const [isGeneratingResume, setIsGeneratingResume] = useState(false);
  const [showResumeModal, setShowResumeModal] = useState(false);

  const handleGenerateResume = async () => {
    setIsGeneratingResume(true);
    try {
      const url = await getResumeUrl(report._id);
      setResumeUrl(url);
      setShowResumeModal(true);
    } catch (error) {
      console.error("Failed to generate resume", error);
    } finally {
      setIsGeneratingResume(false);
    }
  };

  React.useEffect(() => {
    if (!report || report._id !== interviewId) {
      getReportById(interviewId);
    }
  }, [interviewId, report?._id, getReportById]);

  if (loading || !report) return <div className='loading-container'>Loading...</div>;

  return (
    <main className="dashboard-layout">
      {/* SIDEBAR: Scrollable independently */}
      <aside className="dashboard-sidebar custom-scrollbar">
        {/* Branding / Top Sidebar Info */}
        <div className="sidebar-brand">
          <Briefcase size={28} className="brand-icon" />
          <div className="brand-text">
            <h2>{report.title}</h2>
            <span>Interview Strategy Report</span>
          </div>
        </div>

        {/* Match Score Card inside Sidebar */}
        <div className="score-card">
          <div className="score-info">
            <span className="score-label">Resume Match</span>
            <span className="score-value">{report.matchScore}%</span>
          </div>
          <div className="score-ring" style={{ background: `conic-gradient(var(--color-primary) ${report.matchScore}%, rgba(255,255,255,0.1) 0)` }}>
            <Activity className="score-icon" size={24} />
          </div>
        </div>

        <hr className="sidebar-divider" />

        {/* Skill Gaps in Sidebar */}
        <section className="sidebar-section">
          <div className="section-header">
            <AlertTriangle size={18} className="section-icon" />
            <h3>Identified Skill Gaps</h3>
          </div>
          <div className="skills-list">
            {report.skillGaps.map((gap, idx) => (
              <div key={idx} className="skill-item">
                <div className={`severity-indicator ${gap.severity}`} title={`Severity: ${gap.severity}`} />
                <span className="skill-text">{gap.skill}</span>
              </div>
            ))}
          </div>
        </section>

        <hr className="sidebar-divider" />

        {/* Preparation Plan in Sidebar */}
        <section className="sidebar-section">
          <div className="section-header">
            <Calendar size={18} className="section-icon" />
            <h3>Action Plan</h3>
          </div>
          <div className="prep-timeline">
            {report.preparationPlan.map((plan) => (
              <div key={plan._id?.$oid || plan.day} className="timeline-item">
                <div className="timeline-marker">
                  D{plan.day}
                </div>
                <div className="timeline-content">
                  <div className="day-focus">{plan.focus}</div>
                  <ul className="task-list">
                    {plan.tasks.map((task, idx) => (
                      <li key={idx}>
                        <CheckCircle2 className="task-icon" size={14} />
                        <span>{task}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        <button 
          className="generate-resume-btn" 
          onClick={handleGenerateResume} 
          disabled={isGeneratingResume}
        >
          {isGeneratingResume ? (
            <><Loader2 className="animate-spin" size={18} /> Generating...</>
          ) : (
            <><FileText size={18} /> Generate Resume</>
          )}
        </button>

      </aside>

      {/* MAIN CONTENT AREA: Scrollable independently */}
      <section className="dashboard-main custom-scrollbar">
        {/* Main Content Header Optional */}
        <header className="main-header">
          <h1>Interview Questions & Preparation</h1>
          <p>Review standard and behavioral questions prioritized by our AI models based on your background.</p>
        </header>

        {/* Technical Questions */}
        <div className="glass-panel">
          <div className="panel-header">
            <BrainCircuit className="panel-icon" size={28} />
            <h2>Technical Questions</h2>
          </div>
          <div className="questions-list">
            {report.technicalQuestions.map((q, idx) => (
              <QuestionItem key={idx} question={q} index={idx} />
            ))}
          </div>
        </div>

        {/* Behavioral Questions */}
        <div className="glass-panel">
          <div className="panel-header">
            <MessageSquare className="panel-icon" size={28} />
            <h2>Behavioral & Leadership</h2>
          </div>
          <div className="questions-list">
            {report.behavioralQuestions.map((q, idx) => (
              <QuestionItem key={idx} question={q} index={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* Resume Modal */}
      {showResumeModal && (
        <div className="resume-modal-overlay">
          <div className="resume-modal-content">
            <div className="modal-header">
              <h2>Generated ATS Resume</h2>
              <button 
                className="close-btn" 
                onClick={() => setShowResumeModal(false)}
              >
                <X size={24} />
              </button>
            </div>
            <div className="modal-body">
              <iframe 
                src={resumeUrl} 
                title="Resume Preview" 
                className="resume-preview-iframe"
              />
            </div>
            <div className="modal-footer">
              <button 
                className="download-btn"
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = resumeUrl;
                  link.setAttribute('download', `resume_${report._id}.pdf`);
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
              >
                <Download size={18} /> Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};