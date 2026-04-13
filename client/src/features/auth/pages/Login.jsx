import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import "../auth.form.scss";
import { useAuth } from "../hooks/useAuth";
const Login = () => {
    const { handleLogin, loading } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await handleLogin({ email, password });
            navigate("/");
        } catch (err) {
            console.error("Login failed:", err);
        }
    }

    if (loading) {
        return <div>Loading...</div>
    }

    return (
        <main className="auth-page">
            {/* ── Left branding panel ── */}
            <section className="auth-brand">
                <div className="brand-badge">
                    <span className="dot"></span>
                    AI-Powered Platform
                </div>

                <h2 className="brand-title">
                    Hire smarter with <span className="highlight">HireLens</span>
                </h2>

                <p className="brand-description">
                    Streamline your entire recruitment workflow — from resume
                    screening to candidate ranking — powered by advanced AI that
                    saves you hours on every hire.
                </p>

                <div className="brand-features">
                    <div className="feature-item">
                        <span className="feature-icon">🎯</span>
                        <span>AI-driven resume analysis &amp; scoring</span>
                    </div>
                    <div className="feature-item">
                        <span className="feature-icon">⚡</span>
                        <span>Reduce time-to-hire by up to 70%</span>
                    </div>
                    <div className="feature-item">
                        <span className="feature-icon">🔒</span>
                        <span>Enterprise-grade security &amp; compliance</span>
                    </div>
                </div>
            </section>

            {/* ── Right form panel ── */}
            <section className="auth-form-panel">
                <div className="auth-card">
                    <div className="auth-card-header">
                        <div className="auth-logo">H</div>
                        <h1>Welcome back</h1>
                        <p>Sign in to your HireLens account</p>
                    </div>

                    <form className="auth-form" action="" onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label htmlFor="login-email">Email address</label>
                            <input
                                type="email"
                                id="login-email"
                                name="email"
                                placeholder="you@company.com"
                                autoComplete="email"
                                onChange={(e) => { setEmail(e.target.value) }}
                            />
                        </div>

                        <div className="input-group">
                            <label htmlFor="login-password">Password</label>
                            <input
                                type="password"
                                id="login-password"
                                name="password"
                                placeholder="Enter your password"
                                autoComplete="current-password"
                                onChange={(e) => { setPassword(e.target.value) }}
                            />
                        </div>

                        <button type="submit" className="btn-primary" id="login-submit">
                            Sign in
                        </button>
                    </form>

                    <div className="auth-footer">
                        Don&apos;t have an account?{" "}
                        <Link to="/register">Create one</Link>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Login;