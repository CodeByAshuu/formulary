import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login as loginApi } from '../api/auth';
import { useAuth } from '../context/useAuth';
import { jwtDecode } from 'jwt-decode';

const SigninPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
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
      const data = await loginApi(formData.email, formData.password);
      const decodedUser = jwtDecode(data.token);
      login(data.token, decodedUser);
      if (decodedUser.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600;700&display=swap');

        :root {
          --primary: #084734;
          --accent: #CEF17B;
          --bg-soft: #CDEDB3;
          --bg-page: #e8f5d8;
          --surface: #f4fbed;
          --surface-low: #dff2c4;
          --border: rgba(8, 71, 52, 0.15);
          --border-focus: rgba(8, 71, 52, 0.4);
          --text-main: #0a2e20;
          --text-muted: #3d6b56;
          --text-faint: #7aaa8e;
          --shadow-card: 0 8px 40px -8px rgba(8, 71, 52, 0.18), 0 2px 8px -2px rgba(8,71,52,0.08);
          --shadow-btn: 0 8px 24px -6px rgba(8, 71, 52, 0.45);
          --shadow-btn-hover: 0 14px 32px -8px rgba(8, 71, 52, 0.55);
        }

        .signin-root {
          font-family: 'DM Sans', sans-serif;
          background: var(--bg-page);
          min-height: 100vh;
          display: flex;
          position: relative;
          overflow: hidden;
          color: var(--text-main);
        }

        /* Organic blob backgrounds */
        .blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(90px);
          opacity: 0.55;
          pointer-events: none;
        }
        .blob-1 {
          width: 520px; height: 520px;
          top: -15%; right: -8%;
          background: var(--accent);
          animation: pulse-blob 8s ease-in-out infinite;
        }
        .blob-2 {
          width: 420px; height: 420px;
          bottom: -18%; left: -8%;
          background: var(--bg-soft);
          animation: pulse-blob 11s ease-in-out infinite 1.5s;
        }
        .blob-3 {
          width: 260px; height: 260px;
          top: 40%; left: 20%;
          background: var(--accent);
          opacity: 0.22;
          animation: pulse-blob 13s ease-in-out infinite 3s;
        }
        @keyframes pulse-blob {
          0%, 100% { transform: scale(1) translate(0,0); }
          33% { transform: scale(1.06) translate(12px, -10px); }
          66% { transform: scale(0.95) translate(-8px, 8px); }
        }

        /* Dot grid texture */
        .dot-grid {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(circle, rgba(8,71,52,0.09) 1px, transparent 1px);
          background-size: 28px 28px;
          pointer-events: none;
          z-index: 0;
        }

        /* Left column */
        .left-col {
          display: none;
          position: relative;
          z-index: 2;
        }
        @media (min-width: 1024px) {
          .left-col { display: flex; width: 50%; flex-direction: column; justify-content: space-between; padding: 2.5rem 3rem; }
        }

        .logo-mark {
          display: flex; align-items: center; gap: 0.75rem;
        }
        .logo-icon {
          width: 44px; height: 44px;
          background: var(--primary);
          border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 16px rgba(8,71,52,0.3);
        }
        .logo-icon .material-symbols-outlined {
          color: var(--accent);
          font-size: 22px;
        }
        .logo-text {
          font-family: 'DM Serif Display', serif;
          font-size: 1.35rem;
          letter-spacing: 0.12em;
          color: var(--primary);
          text-transform: uppercase;
        }

        .hero-headline {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(3rem, 5vw, 4rem);
          line-height: 1.1;
          color: var(--primary);
          margin-bottom: 1.25rem;
        }
        .hero-headline .accent-word {
          color: transparent;
          -webkit-text-stroke: 2px var(--primary);
          font-style: italic;
        }
        .hero-headline .highlight-pill {
          display: inline-block;
          background: var(--accent);
          color: var(--primary);
          padding: 0 0.35em;
          border-radius: 8px;
          font-style: normal;
          -webkit-text-stroke: 0;
        }
        .hero-desc {
          color: var(--text-muted);
          font-size: 0.95rem;
          line-height: 1.75;
          max-width: 380px;
          font-weight: 400;
        }

        .trust-bar {
          display: flex; align-items: center; gap: 1rem; margin-top: 2rem;
        }
        .avatar-stack { display: flex; }
        .avatar-ring {
          width: 38px; height: 38px;
          border-radius: 50%;
          border: 2.5px solid var(--bg-page);
          overflow: hidden;
          margin-left: -10px;
          box-shadow: 0 2px 8px rgba(8,71,52,0.15);
        }
        .avatar-ring:first-child { margin-left: 0; }
        .avatar-ring img { width: 100%; height: 100%; object-fit: cover; }
        .trust-text { font-size: 0.75rem; color: var(--text-muted); font-weight: 500; }
        .trust-text strong { color: var(--primary); }

        .decorative-tag {
          font-size: 0.6rem;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--text-faint);
        }

        /* Right column / card */
        .right-col {
          width: 100%;
          display: flex; align-items: center; justify-content: center;
          z-index: 2; padding: 1.5rem;
        }
        @media (min-width: 1024px) {
          .right-col { width: 50%; }
        }

        .auth-card {
          width: 100%; max-width: 440px;
          background: rgba(244, 251, 237, 0.82);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1.5px solid rgba(206, 241, 123, 0.5);
          border-radius: 28px;
          padding: 2.75rem 2.25rem;
          box-shadow: var(--shadow-card);
          transition: box-shadow 0.4s ease;
        }
        .auth-card:hover {
          box-shadow: 0 16px 60px -12px rgba(8,71,52,0.22), 0 4px 16px -4px rgba(8,71,52,0.1);
        }

        /* Accent bar on card top */
        .card-accent-bar {
          height: 3px;
          background: linear-gradient(90deg, var(--accent) 0%, transparent 100%);
          border-radius: 8px;
          margin-bottom: 2rem;
          width: 48px;
        }

        .mobile-logo {
          display: flex; align-items: center; justify-content: center; gap: 0.6rem;
          margin-bottom: 2rem;
        }
        @media (min-width: 1024px) { .mobile-logo { display: none; } }

        .card-title { font-family: 'DM Serif Display', serif; font-size: 1.7rem; color: var(--primary); margin-bottom: 0.3rem; }
        .card-subtitle { font-size: 0.75rem; color: var(--text-muted); font-weight: 400; letter-spacing: 0.01em; }

        /* Error box */
        .error-box {
          margin-bottom: 1.5rem;
          padding: 0.85rem 1rem;
          background: #fff1f1;
          border: 1.5px solid #fca5a5;
          color: #b91c1c;
          border-radius: 12px;
          font-size: 0.72rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          display: flex; align-items: center; gap: 0.5rem;
        }

        /* Form fields */
        .field-group { margin-bottom: 1.1rem; }
        .field-label-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem; }
        .field-label {
          font-size: 0.6rem;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--text-muted);
        }
        .forgot-link {
          font-size: 0.6rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--primary);
          text-decoration: none;
          transition: opacity 0.2s;
        }
        .forgot-link:hover { opacity: 0.7; }

        .input-wrap {
          position: relative; display: flex; align-items: center;
        }
        .input-icon {
          position: absolute; left: 14px;
          color: var(--text-faint);
          font-size: 18px;
          transition: color 0.2s;
          pointer-events: none;
        }
        .input-wrap:focus-within .input-icon { color: var(--primary); }

        .field-input {
          width: 100%;
          padding: 0.85rem 0.85rem 0.85rem 2.75rem;
          background: var(--surface-low);
          border: 1.5px solid transparent;
          border-radius: 12px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-main);
          outline: none;
          transition: all 0.25s ease;
        }
        .field-input::placeholder { color: var(--text-faint); font-weight: 400; }
        .field-input:focus {
          background: white;
          border-color: var(--accent);
          box-shadow: 0 0 0 4px rgba(206, 241, 123, 0.3);
        }
        .field-input.has-toggle { padding-right: 2.75rem; }

        .toggle-btn {
          position: absolute; right: 14px;
          background: none; border: none; cursor: pointer;
          color: var(--text-faint); padding: 0;
          transition: color 0.2s;
        }
        .toggle-btn:hover { color: var(--primary); }
        .toggle-btn .material-symbols-outlined { font-size: 18px; }

        /* Submit button */
        .submit-btn {
          width: 100%;
          margin-top: 1rem;
          padding: 0.9rem 1.5rem;
          background: var(--primary);
          color: var(--accent);
          border: none;
          border-radius: 12px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.85rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 0.5rem;
          box-shadow: var(--shadow-btn);
          transition: all 0.25s ease;
          position: relative;
          overflow: hidden;
        }
        .submit-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(206,241,123,0.12) 0%, transparent 60%);
          opacity: 0;
          transition: opacity 0.25s;
        }
        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: var(--shadow-btn-hover);
        }
        .submit-btn:hover::before { opacity: 1; }
        .submit-btn:active:not(:disabled) { transform: translateY(0); }
        .submit-btn:disabled { opacity: 0.65; cursor: not-allowed; }
        .submit-btn .arrow-icon { transition: transform 0.25s ease; }
        .submit-btn:hover:not(:disabled) .arrow-icon { transform: translateX(4px); }
        .submit-btn .material-symbols-outlined { font-size: 16px; }
        @keyframes blink { 50% { opacity: 0.5; } }
        .authenticating { animation: blink 1.2s ease-in-out infinite; }

        /* Footer */
        .card-footer {
          margin-top: 2rem;
          padding-top: 1.25rem;
          border-top: 1px solid rgba(8,71,52,0.1);
          text-align: center;
          font-size: 0.78rem;
          color: var(--text-muted);
          font-weight: 500;
        }
        .card-footer a {
          color: var(--primary);
          font-weight: 700;
          text-decoration: none;
          border-bottom: 2px solid var(--accent);
          padding-bottom: 1px;
          transition: opacity 0.2s;
        }
        .card-footer a:hover { opacity: 0.75; }
      `}</style>

      <div className="signin-root">
        {/* Backgrounds */}
        <div className="dot-grid" />
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />

        {/* Left Column */}
        <div className="left-col">
          <div className="logo-mark">
            <div className="logo-icon">
              <span className="material-symbols-outlined">clinical_notes</span>
            </div>
            <span className="logo-text">Formulary</span>
          </div>

          <div>
            <h1 className="hero-headline">
              Elevating<br />
              <span className="highlight-pill">Clinical</span><br />
              <span className="accent-word">Care.</span>
            </h1>
            <p className="hero-desc">
              Experience the pinnacle of medical orchestration. A digital atelier engineered for elite practitioners seeking absolute precision.
            </p>
            <div className="trust-bar">
              <div className="avatar-stack">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="avatar-ring">
                    <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" />
                  </div>
                ))}
              </div>
              <div className="trust-text">
                Trusted by <strong>10,000+</strong> professionals
              </div>
            </div>
          </div>

          <div className="decorative-tag">© Formulary — Clinical Platform</div>
        </div>

        {/* Right Column */}
        <div className="right-col">
          <div className="auth-card">
            {/* Mobile logo */}
            <div className="mobile-logo">
              <div className="logo-icon">
                <span className="material-symbols-outlined">clinical_notes</span>
              </div>
              <span className="logo-text">Formulary</span>
            </div>

            <div className="card-accent-bar" />

            <h2 className="card-title">Welcome Back</h2>
            <p className="card-subtitle" style={{ marginBottom: '2rem' }}>Enter your clinical credentials to access your workspace.</p>

            {error && (
              <div className="error-box">
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>error</span>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Email */}
              <div className="field-group">
                <div className="field-label-row">
                  <label className="field-label" htmlFor="email">Email Address</label>
                </div>
                <div className="input-wrap">
                  <span className="material-symbols-outlined input-icon">alternate_email</span>
                  <input
                    type="email"
                    id="email"
                    className="field-input"
                    placeholder="doctor@clinic.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="field-group">
                <div className="field-label-row">
                  <label className="field-label" htmlFor="password">Password</label>
                  <Link to="#" className="forgot-link">Forgot?</Link>
                </div>
                <div className="input-wrap">
                  <span className="material-symbols-outlined input-icon">lock</span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    className="field-input has-toggle"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    className="toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <span className="material-symbols-outlined">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? (
                  <span className="authenticating">Authenticating...</span>
                ) : (
                  <>
                    <span>Access Workspace</span>
                    <span className="material-symbols-outlined arrow-icon">arrow_forward</span>
                  </>
                )}
              </button>
            </form>

            <div className="card-footer">
              Don't have an account?{' '}
              <Link to="/signup">Request access</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SigninPage;