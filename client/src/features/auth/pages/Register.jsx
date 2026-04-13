import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import "../auth.form.scss";
import { useAuth } from "../hooks/useAuth";

const Register = () => {
    const { handleRegister, loading } = useAuth();
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await handleRegister({ username, email, password });
            navigate("/");
        } catch (error) {
            console.error("Registration failed:", error);
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
                    Get Started Free
                </div>

                <h2 className="brand-title">
                    Join the future of <span className="highlight">hiring</span>
                </h2>

                <p className="brand-description">
                    Create your free account and start building a smarter,
                    faster, and fairer hiring pipeline — all powered by
                    cutting-edge AI.
                </p>

                <div className="brand-features">
                    <div className="feature-item">
                        <span className="feature-icon">🚀</span>
                        <span>Set up in under 2 minutes</span>
                    </div>
                    <div className="feature-item">
                        <span className="feature-icon">📊</span>
                        <span>Instant candidate insights &amp; dashboards</span>
                    </div>
                    <div className="feature-item">
                        <span className="feature-icon">🤝</span>
                        <span>Collaborate with your whole team</span>
                    </div>
                </div>
            </section>

            {/* ── Right form panel ── */}
            <section className="auth-form-panel">
                <div className="auth-card">
                    <div className="auth-card-header">
                        <div className="auth-logo">H</div>
                        <h1>Create your account</h1>
                        <p>Start your 14-day free trial — no card required</p>
                    </div>

                    <form className="auth-form" action="" onSubmit={handleSubmit}>

                        <div className="input-group">
                            <label htmlFor="username">Username</label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                placeholder="John"
                                autoComplete="given-name"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>


                        <div className="input-group">
                            <label htmlFor="register-email">Work email</label>
                            <input
                                type="email"
                                id="register-email"
                                name="email"
                                placeholder="you@company.com"
                                autoComplete="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="input-group">
                            <label htmlFor="register-password">Password</label>
                            <input
                                type="password"
                                id="register-password"
                                name="password"
                                placeholder="Min. 8 characters"
                                autoComplete="new-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <button type="submit" className="btn-primary" id="register-submit">
                            Create account
                        </button>
                    </form>

                    <div className="auth-footer">
                        Already have an account?{" "}
                        <Link to="/login">Sign in</Link>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Register;