import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register as registerApi } from '../api/auth';
import { useAuth } from '../context/useAuth';
import { jwtDecode } from 'jwt-decode';

const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await registerApi(formData);
      const decodedUser = jwtDecode(data.token);
      login(data.token, decodedUser);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap');

        :root {
          --primary: #084734;
          --accent: #CEF17B;
          --bg-soft: #CDEDB3;
          --bg-page: #e8f5d8;
          --surface: #f4fbed;
          --surface-low: #dff2c4;
          --border: rgba(8,71,52,0.14);
          --text-main: #0a2e20;
          --text-muted: #3d6b56;
          --text-faint: #7aaa8e;
          --shadow-card: 0 24px 64px -16px rgba(8,71,52,0.16), 0 4px 16px -4px rgba(8,71,52,0.08);
          --shadow-btn: 0 8px 24px -6px rgba(8,71,52,0.42);
          --shadow-btn-hover: 0 14px 32px -8px rgba(8,71,52,0.54);
        }

        .signup-root {
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          background: var(--bg-page);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          position: relative;
          overflow: hidden;
          color: var(--text-main);
        }

        /* Background blobs */
        .s-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(90px);
          pointer-events: none;
          opacity: 0.5;
        }
        .s-blob-1 {
          width: 55vw; height: 55vw;
          top: -20%; left: -12%;
          background: var(--accent);
          animation: sblob 9s ease-in-out infinite;
        }
        .s-blob-2 {
          width: 50vw; height: 50vw;
          bottom: -18%; right: -10%;
          background: var(--bg-soft);
          animation: sblob 12s ease-in-out infinite 2s;
        }
        @keyframes sblob {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.07) translate(10px, -10px); }
        }
        .dot-grid {
          position: absolute; inset: 0;
          background-image: radial-gradient(circle, rgba(8,71,52,0.08) 1px, transparent 1px);
          background-size: 26px 26px;
          pointer-events: none;
        }

        /* Main card */
        .signup-card {
          width: 100%; max-width: 900px;
          position: relative; z-index: 2;
          display: flex; flex-direction: column;
          background: rgba(244,251,237,0.8);
          backdrop-filter: blur(22px);
          -webkit-backdrop-filter: blur(22px);
          border: 1.5px solid rgba(206,241,123,0.45);
          border-radius: 28px;
          box-shadow: var(--shadow-card);
          overflow: hidden;
          transition: box-shadow 0.4s ease;
        }
        .signup-card:hover {
          box-shadow: 0 32px 80px -16px rgba(8,71,52,0.2), 0 8px 24px -8px rgba(8,71,52,0.1);
        }
        @media (min-width: 768px) {
          .signup-card { flex-direction: row; }
        }

        /* ── LEFT PANEL ── */
        .left-panel {
          background: var(--primary);
          padding: 2.5rem 2rem;
          display: flex; flex-direction: column; justify-content: space-between;
          position: relative; overflow: hidden;
          flex-shrink: 0;
        }
        @media (min-width: 768px) { .left-panel { width: 42%; } }

        /* Noise + glow overlays */
        .left-panel::before {
          content: '';
          position: absolute; inset: 0;
          background: url('https://www.transparenttextures.com/patterns/noise-pattern-with-subtle-cross-lines.png');
          mix-blend-mode: overlay; opacity: 0.15; pointer-events: none;
        }
        .left-glow {
          position: absolute;
          bottom: -80px; left: -80px;
          width: 280px; height: 280px;
          background: rgba(206,241,123,0.15);
          border-radius: 50%; filter: blur(60px);
          pointer-events: none;
        }
        .left-glow-2 {
          position: absolute;
          top: -60px; right: -60px;
          width: 200px; height: 200px;
          background: rgba(255,255,255,0.06);
          border-radius: 50%; filter: blur(50px);
          pointer-events: none;
        }

        /* Accent stripe on left edge of panel */
        .left-panel::after {
          content: '';
          position: absolute; top: 10%; left: 0;
          width: 3px; height: 80%;
          background: linear-gradient(180deg, transparent, var(--accent), transparent);
          border-radius: 4px;
        }

        .panel-logo { display: flex; align-items: center; gap: 0.7rem; position: relative; z-index: 2; }
        .panel-logo-icon {
          width: 42px; height: 42px;
          background: var(--accent);
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 14px rgba(206,241,123,0.4);
        }
        .panel-logo-icon .material-symbols-outlined { color: var(--primary); font-size: 20px; }
        .panel-logo-text {
          font-family: 'DM Serif Display', serif;
          font-size: 1.2rem; letter-spacing: 0.12em;
          text-transform: uppercase; color: white;
        }

        .panel-headline {
          position: relative; z-index: 2; margin-top: 3rem;
        }
        .panel-headline h2 {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(1.6rem, 3vw, 2.1rem);
          line-height: 1.2; color: white;
          margin-bottom: 0.9rem;
        }
        .panel-headline h2 em {
          font-style: italic; color: var(--accent);
        }
        .panel-headline p {
          color: rgba(205, 237, 179, 0.8);
          font-size: 0.85rem; line-height: 1.75; font-weight: 400;
        }

        .feature-cards { position: relative; z-index: 2; margin-top: 2.5rem; display: none; flex-direction: column; gap: 0.75rem; }
        @media (min-width: 640px) { .feature-cards { display: flex; } }

        .feature-card {
          display: flex; align-items: center; gap: 0.85rem;
          background: rgba(255,255,255,0.07);
          backdrop-filter: blur(8px);
          padding: 0.85rem 1rem;
          border-radius: 14px;
          border: 1px solid rgba(255,255,255,0.1);
        }
        .feature-icon {
          width: 38px; height: 38px; flex-shrink: 0;
          background: var(--accent);
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
        }
        .feature-icon .material-symbols-outlined { color: var(--primary); font-size: 18px; }
        .feature-card-title { font-size: 0.72rem; font-weight: 700; color: white; letter-spacing: 0.02em; }
        .feature-card-sub { font-size: 0.62rem; color: rgba(205,237,179,0.7); margin-top: 1px; }

        /* ── RIGHT PANEL ── */
        .right-panel {
          flex: 1;
          padding: 2.5rem 2rem;
          display: flex; flex-direction: column; justify-content: center;
        }
        @media (min-width: 640px) { .right-panel { padding: 3rem 2.75rem; } }

        .form-header { margin-bottom: 1.75rem; }
        .form-header h3 {
          font-family: 'DM Serif Display', serif;
          font-size: 1.65rem; color: var(--primary);
          margin-bottom: 0.3rem;
        }
        .form-header p { font-size: 0.72rem; color: var(--text-muted); letter-spacing: 0.02em; }

        .accent-bar {
          width: 40px; height: 3px;
          background: var(--accent);
          border-radius: 4px;
          margin-bottom: 1.25rem;
        }

        /* Error */
        .error-box {
          margin-bottom: 1.25rem;
          padding: 0.8rem 1rem;
          background: #fff1f1; border: 1.5px solid #fca5a5;
          color: #b91c1c; border-radius: 12px;
          font-size: 0.7rem; font-weight: 600;
          text-transform: uppercase; letter-spacing: 0.06em;
          display: flex; align-items: center; gap: 0.5rem;
        }

        /* Form layout */
        .form-grid { display: grid; grid-template-columns: 1fr; gap: 0.9rem; }
        @media (min-width: 480px) { .form-grid-2 { grid-template-columns: 1fr 1fr; } }

        .field-group { display: flex; flex-direction: column; gap: 0.38rem; }
        .field-label {
          font-size: 0.58rem; font-weight: 600;
          letter-spacing: 0.14em; text-transform: uppercase;
          color: var(--text-muted); padding-left: 2px;
        }
        .input-wrap { position: relative; display: flex; align-items: center; }
        .input-icon {
          position: absolute; left: 13px;
          color: var(--text-faint); font-size: 17px;
          pointer-events: none; transition: color 0.2s;
        }
        .input-wrap:focus-within .input-icon { color: var(--primary); }

        .field-input {
          width: 100%;
          padding: 0.82rem 0.9rem 0.82rem 2.6rem;
          background: var(--surface-low);
          border: 1.5px solid transparent;
          border-radius: 12px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.85rem; font-weight: 500;
          color: var(--text-main); outline: none;
          transition: all 0.25s ease;
        }
        .field-input::placeholder { color: var(--text-faint); font-weight: 400; }
        .field-input:focus {
          background: white;
          border-color: var(--accent);
          box-shadow: 0 0 0 4px rgba(206,241,123,0.28);
        }
        .field-input.pr { padding-right: 2.6rem; }

        .toggle-btn {
          position: absolute; right: 13px;
          background: none; border: none; cursor: pointer;
          color: var(--text-faint); padding: 0; transition: color 0.2s;
        }
        .toggle-btn:hover { color: var(--primary); }
        .toggle-btn .material-symbols-outlined { font-size: 17px; }

        /* Terms */
        .terms-row {
          display: flex; align-items: flex-start; gap: 0.65rem;
          margin-top: 0.25rem;
        }
        .terms-row input[type="checkbox"] {
          width: 16px; height: 16px; flex-shrink: 0;
          margin-top: 1px;
          accent-color: var(--primary);
          cursor: pointer; border-radius: 4px;
        }
        .terms-label {
          font-size: 0.68rem; color: var(--text-muted);
          font-weight: 500; line-height: 1.5; cursor: pointer;
        }
        .terms-label a { color: var(--primary); font-weight: 700; text-decoration: none; border-bottom: 1.5px solid var(--accent); }
        .terms-label a:hover { opacity: 0.75; }

        /* Submit */
        .submit-btn {
          width: 100%; margin-top: 0.5rem;
          padding: 0.9rem 1.5rem;
          background: var(--primary); color: var(--accent);
          border: none; border-radius: 12px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.82rem; font-weight: 700;
          letter-spacing: 0.07em; text-transform: uppercase;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 0.5rem;
          box-shadow: var(--shadow-btn);
          transition: all 0.25s ease;
          position: relative; overflow: hidden;
        }
        .submit-btn::before {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(206,241,123,0.1) 0%, transparent 60%);
          opacity: 0; transition: opacity 0.25s;
        }
        .submit-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: var(--shadow-btn-hover); }
        .submit-btn:hover::before { opacity: 1; }
        .submit-btn:active:not(:disabled) { transform: translateY(0); }
        .submit-btn:disabled { opacity: 0.65; cursor: not-allowed; }
        @keyframes blink { 50% { opacity: 0.55; } }
        .authenticating { animation: blink 1.2s ease-in-out infinite; }

        /* Footer */
        .form-footer {
          margin-top: 1.5rem; padding-top: 1.25rem;
          border-top: 1px solid rgba(8,71,52,0.1);
          text-align: center;
          font-size: 0.75rem; color: var(--text-muted); font-weight: 500;
        }
        .form-footer a {
          color: var(--primary); font-weight: 700; text-decoration: none;
          border-bottom: 2px solid var(--accent); padding-bottom: 1px;
          transition: opacity 0.2s;
        }
        .form-footer a:hover { opacity: 0.7; }
      `}</style>

      <div className="signup-root">
        <div className="dot-grid" />
        <div className="s-blob s-blob-1" />
        <div className="s-blob s-blob-2" />

        <div className="signup-card">

          {/* ── LEFT PANEL ── */}
          <div className="left-panel">
            <div className="left-glow" />
            <div className="left-glow-2" />

            <Link to="/" className="panel-logo">
              <div className="panel-logo-icon">
                <span className="material-symbols-outlined">clinical_notes</span>
              </div>
              <span className="panel-logo-text">Formulary</span>
            </Link>

            <div className="panel-headline">
              <h2>Join the <em>Elite</em><br />Medical Network.</h2>
              <p>Streamline prescriptions, optimize workflows, and deliver unmatched care.</p>
            </div>

            <div className="feature-cards">
              <div className="feature-card">
                <div className="feature-icon">
                  <span className="material-symbols-outlined">security</span>
                </div>
                <div>
                  <div className="feature-card-title">Enterprise Security</div>
                  <div className="feature-card-sub">HIPAA Compliant</div>
                </div>
              </div>
              <div className="feature-card">
                <div className="feature-icon">
                  <span className="material-symbols-outlined">speed</span>
                </div>
                <div>
                  <div className="feature-card-title">Lightning Fast</div>
                  <div className="feature-card-sub">99.9% Uptime</div>
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT PANEL ── */}
          <div className="right-panel">
            <div className="accent-bar" />
            <div className="form-header">
              <h3>Create Account</h3>
              <p>Establish your clinical credentials below.</p>
            </div>

            {error && (
              <div className="error-box">
                <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>error</span>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                {/* Name row */}
                <div className="form-grid form-grid-2">
                  <div className="field-group">
                    <label className="field-label" htmlFor="firstName">First Name</label>
                    <div className="input-wrap">
                      <span className="material-symbols-outlined input-icon">person</span>
                      <input
                        type="text" id="firstName"
                        className="field-input"
                        placeholder="Samay"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="field-group">
                    <label className="field-label" htmlFor="lastName">Last Name</label>
                    <div className="input-wrap">
                      <span className="material-symbols-outlined input-icon">person</span>
                      <input
                        type="text" id="lastName"
                        className="field-input"
                        placeholder="Raina"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div className="field-group">
                  <label className="field-label" htmlFor="email">Email</label>
                  <div className="input-wrap">
                    <span className="material-symbols-outlined input-icon">mail</span>
                    <input
                      type="email" id="email"
                      className="field-input"
                      placeholder="doctor@formulary.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="field-group">
                  <label className="field-label" htmlFor="password">Password</label>
                  <div className="input-wrap">
                    <span className="material-symbols-outlined input-icon">lock</span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      className="field-input pr"
                      placeholder="••••••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                    <button type="button" className="toggle-btn" onClick={() => setShowPassword(!showPassword)}>
                      <span className="material-symbols-outlined">
                        {showPassword ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Terms */}
                <div className="terms-row">
                  <input id="terms" type="checkbox" required />
                  <label htmlFor="terms" className="terms-label">
                    I agree to the <Link to="#">Terms</Link> and <Link to="#">Privacy Policy</Link>.
                  </label>
                </div>

                {/* Submit */}
                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? (
                    <span className="authenticating">Creating Account...</span>
                  ) : (
                    'Create Account'
                  )}
                </button>
              </div>
            </form>

            <div className="form-footer">
              Already verified?{' '}
              <Link to="/signin">Sign in here</Link>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default SignupPage;