import React, { useState } from 'react';
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
  Clock
} from 'lucide-react';
import './Interview.scss';

// Temporary Mock Data based on the user's provided structure
const MOCK_DATA = {
  "_id": {
    "$oid": "69e32d5f14542bc0648c4dd3"
  },
  "matchScore": 85,
  "technicalQuestions": [
    {
      "question": "Explain the differences between PostgreSQL and MongoDB in the context of healthcare data, and when you would prefer one over the other for high-frequency transactions.",
      "intention": "Evaluate database selection skills and understanding of ACID vs BASE consistency models.",
      "answer": "PostgreSQL is better for ACID compliance and structured relationships, while MongoDB offers horizontal scaling and schema flexibility."
    },
    {
      "question": "How would you design and implement a scalable microservice architecture using Node.js that ensures fault tolerance and high availability?",
      "intention": "Assess system design knowledge and proficiency in Node.js scaling strategies.",
      "answer": "Implement clustering, use PM2 for process management, and utilize message queues like RabbitMQ for decoupling services."
    },
    {
      "question": "Describe the process of implementing JWT-based role access control. How do you ensure secure token storage and prevent unauthorized access in a production environment?",
      "intention": "Verify understanding of authentication security and web security best practices.",
      "answer": "Store tokens in HttpOnly/Secure cookies, implement token blacklisting, and verify signatures on every request via middleware."
    },
    {
      "question": "Explain your experience with tRPC in your VoxTrace.AI project. How does it compare to standard REST APIs regarding type safety and developer productivity?",
      "intention": "Check familiarity with modern API communication and end-to-end type safety.",
      "answer": "tRPC eliminates the need for manual schema synchronization between client and server, catching errors at compile-time unlike REST."
    }
  ],
  "behavioralQuestions": [
    {
      "question": "Describe a situation where you faced a major technical hurdle during a hackathon, such as Innovertex 2.0. How did you manage the time pressure to deliver a runner-up solution?",
      "intention": "Measure resilience and time management under high-stakes conditions.",
      "answer": "Prioritized a Minimum Viable Product (MVP), delegated debugging tasks, and focused on core functionality to meet the deadline."
    },
    {
      "question": "Tell me about a time you had to lead or influence a team decision, drawing from your experience as a sports captain or within the MMIL tech society.",
      "intention": "Evaluate leadership, communication, and conflict resolution skills.",
      "answer": "Facilitated a structured discussion where every member voiced concerns, then reached a consensus based on project objectives."
    },
    {
      "question": "How do you approach learning a new technology, such as the Gemini API or Three.js, when you need to integrate it into a project within a short timeframe?",
      "intention": "Assess adaptability and the ability to learn complex concepts quickly.",
      "answer": "Review documentation for core concepts, follow a project-based tutorial, and immediately apply findings to the specific use case."
    }
  ],
  "skillGaps": [
    {
      "skill": "Practical experience with cloud infrastructure platforms (AWS/GCP)",
      "severity": "high"
    },
    {
      "skill": "Familiarity with containerization and orchestration (Docker/Kubernetes)",
      "severity": "medium"
    },
    {
      "skill": "Experience with the Go programming language",
      "severity": "low"
    }
  ],
  "preparationPlan": [
    {
      "day": 1,
      "focus": "Backend Architecture and Database Optimization",
      "tasks": [
        "Review Advanced Node.js concepts including the event loop, streams, and cluster modules.",
        "Practice complex SQL queries for PostgreSQL and aggregation pipelines in MongoDB.",
        "Study microservices design patterns and API Gateway implementation strategies."
      ],
      "_id": {
        "$oid": "69e32d5f14542bc0648c4dd4"
      }
    },
    {
      "day": 2,
      "focus": "DevOps, Cloud, and System Design",
      "tasks": [
        "Complete a crash course on Docker containerization and Kubernetes basic orchestration.",
        "Review AWS core services (EC2, S3, RDS) and how they facilitate scalable backend systems.",
        "Practice System Design questions focused on building fault-tolerant healthcare platforms."
      ],
      "_id": {
        "$oid": "69e32d5f14542bc0648c4dd5"
      }
    },
    {
      "day": 3,
      "focus": "Algorithms, Behavioral Prep, and Project Review",
      "tasks": [
        "Solve medium-to-hard problems on Data Structures and Algorithms, specifically focusing on Graphs and Dynamic Programming.",
        "Prepare STAR-format answers for behavioral questions regarding leadership and technical challenges.",
        "Conduct a deep-dive walkthrough of the VoxTrace.AI and HopScotch architectures to explain design choices."
      ],
      "_id": {
        "$oid": "69e32d5f14542bc0648c4dd6"
      }
    }
  ],
  "title": "Software Development Engineer (SDE)"
};

const QuestionItem = ({ question, index }) => {
  const [isOpen, setIsOpen] = useState(false);

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

export const Interview = ({ data = MOCK_DATA }) => {
  if (!data) return <div>Loading...</div>;

  return (
    <main className="dashboard-layout">
      {/* SIDEBAR: Scrollable independently */}
      <aside className="dashboard-sidebar custom-scrollbar">
        {/* Branding / Top Sidebar Info */}
        <div className="sidebar-brand">
          <Briefcase size={28} className="brand-icon" />
          <div className="brand-text">
            <h2>{data.title}</h2>
            <span>Interview Strategy Report</span>
          </div>
        </div>

        {/* Match Score Card inside Sidebar */}
        <div className="score-card">
          <div className="score-info">
            <span className="score-label">Resume Match</span>
            <span className="score-value">{data.matchScore}%</span>
          </div>
          <div className="score-ring" style={{ background: `conic-gradient(var(--color-primary) ${data.matchScore}%, rgba(255,255,255,0.1) 0)` }}>
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
            {data.skillGaps.map((gap, idx) => (
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
            {data.preparationPlan.map((plan) => (
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
            {data.technicalQuestions.map((q, idx) => (
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
            {data.behavioralQuestions.map((q, idx) => (
              <QuestionItem key={idx} question={q} index={idx} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};