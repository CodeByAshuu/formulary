import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');

  :root {
    --primary: #084734;
    --accent: #CEF17B;
    --bg-soft: #CDEDB3;
    --bg-page: #f0f9ea;
    --text-main: #0c2e22;
    --text-muted: #3a6652;
    --border: rgba(8,71,52,0.12);
  }

  body { background: var(--bg-page); }

  .hero-header {
    position: relative;
    // display: flex;
    flex-direction: column;
    // align-items: center;
    justify-content: center;
    // text-align: center;
    padding: 80px 24px 120px;
    background: var(--primary);
    overflow: hidden;
  }
  .hero-header::before, .hero-header::after {
    content: ''; position: absolute; border-radius: 50%; pointer-events: none;
  }
  .hero-header::before {
    width: 500px; height: 500px;
    background: radial-gradient(circle, rgba(206,241,123,0.18) 0%, transparent 70%);
    top: -120px; left: -100px;
    animation: drift 8s ease-in-out infinite alternate;
  }
  .hero-header::after {
    width: 400px; height: 400px;
    background: radial-gradient(circle, rgba(205,237,179,0.12) 0%, transparent 70%);
    bottom: -80px; right: -80px;
    animation: drift 10s ease-in-out infinite alternate-reverse;
  }
  @keyframes drift {
    from { transform: translate(0,0) scale(1); }
    to   { transform: translate(20px,15px) scale(1.05); }
  }

  .hero-badge {
    align-items: center; gap: 6px;
    background: rgba(206,241,123,0.15);
    border: 1px solid rgba(206,241,123,0.35);
    color: var(--accent);
    font-size: 0.72rem; font-weight: 600;
    letter-spacing: 0.12em; text-transform: uppercase;
    padding: 6px 14px; border-radius: 100px;
    margin-bottom: 28px; position: relative; z-index: 1;
  }

  .hero-title {
    font-family: 'DM Serif Display', serif;
    font-size: clamp(2.8rem, 6vw, 4.2rem);
    color: #ffffff; line-height: 1.05;
    position: relative; z-index: 1; margin-bottom: 20px;
  }
  .hero-title em { font-style: italic; color: var(--accent); }

  .hero-subtitle {
    font-size: 1.05rem; color: rgba(205,237,179,0.85);
    max-width: 540px; line-height: 1.65;
    position: relative; z-index: 1; margin-bottom: 48px; font-weight: 300;
  }

  .search-wrapper { position: relative; z-index: 1; width: 100%; max-width: 600px; }

  .search-box {
    display: flex; align-items: center;
    background: rgba(255,255,255,0.07);
    border: 1.5px solid rgba(206,241,123,0.4);
    border-radius: 16px; padding: 6px 6px 6px 20px; gap: 12px;
    transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
    backdrop-filter: blur(8px);
  }
  .search-box:focus-within {
    border-color: var(--accent);
    background: rgba(255,255,255,0.11);
    box-shadow: 0 0 0 4px rgba(206,241,123,0.15), 0 8px 32px rgba(0,0,0,0.25);
  }

  .ghost-input {
    flex: 1; background: transparent; border: none; outline: none;
    font-family: 'DM Sans', sans-serif; font-size: 1rem;
    color: #ffffff; caret-color: var(--accent);
  }
  .ghost-input::placeholder { color: rgba(205,237,179,0.5); }

  .search-hint {
    margin-top: 14px; font-size: 0.78rem;
    color: rgba(205,237,179,0.6); letter-spacing: 0.02em;
  }
  .search-hint strong { color: var(--accent); font-weight: 600; }

  .workspace-layer {
    position: relative; z-index: 2;
    max-width: 1100px; margin: -72px auto 0;
    padding: 0 32px 60px;
  }

  .bento-grid { display: grid; gap: 20px; }

  .clinical-card {
    background: #ffffff;
    border: 1px solid var(--border);
    border-radius: 20px; padding: 40px 28px; text-align: center;
    box-shadow: 0 4px 24px rgba(8,71,52,0.08);
    transition: transform 0.2s, box-shadow 0.2s;
    position: relative; overflow: hidden;
  }
  .clinical-card::before {
    content: ''; position: absolute;
    top: 0; left: 0; right: 0; height: 3px;
    background: linear-gradient(90deg, var(--primary), var(--accent));
    opacity: 0; transition: opacity 0.2s;
  }
  .clinical-card:hover { transform: translateY(-4px); box-shadow: 0 12px 36px rgba(8,71,52,0.14); }
  .clinical-card:hover::before { opacity: 1; }

  .card-icon-wrap {
    width: 64px; height: 64px; border-radius: 16px;
    background: var(--bg-soft);
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 20px; transition: background 0.2s;
  }
  .clinical-card:hover .card-icon-wrap { background: #b8e89e; }

  .card-title {
    font-family: 'DM Serif Display', serif;
    font-size: 1.15rem; color: var(--primary); margin-bottom: 10px;
  }
  .card-body { font-size: 0.88rem; color: var(--text-muted); line-height: 1.6; }
`;

function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/signin");
      return;
    }

    navigate(`/search-results?q=${encodeURIComponent(searchTerm.trim())}`);
  }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="">
        {/* Hero */}
        <div className="hero-header" style={{ minHeight: '60vh' }}>
          <div className="hero-badge">
            Clinical Formulary Platform
          </div>
          <h1 className="hero-title">Formu<em>lary</em></h1>
          <p className="hero-subtitle">
            The Clinical Atelier for Medicine Strategy. Find optimized pricing through molecular equivalents.
          </p>
          <div className="search-wrapper">
            <div className="search-box">
              <span className="material-symbols-outlined" style={{ color: 'rgba(206,241,123,0.7)', fontSize: 22 }}>search</span>
              <input
                type="text"
                className="ghost-input"
                placeholder="Search medicine (e.g., Paracetamol)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleSearch}
                autoFocus
              />
            </div>
            <div className="search-hint">
              Press <strong>Enter</strong> to start Molecular Search
            </div>
          </div>
          <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          height: '140px',
          background: 'linear-gradient(to bottom, transparent, #CDEDB3)',
          pointerEvents: 'none', zIndex: 1
        }} />
        </div>
        

        {/* Feature Cards */}
        <div className="mt-24" style={{ padding: '0 32px 60px' }}>
          <div className="bento-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
            {[
              { icon: 'search', title: 'Instant Search', body: 'Fast, indexed search across thousands of medical compounds.' },
              { icon: 'compare_arrows', title: 'Price Optimization', body: 'Instantly discover equivalent substitutes with lower retail costs.' },
              { icon: 'verified_user', title: 'Verified Data', body: 'Directly sourced from manufacturer indexes and clinical guidelines.' },
            ].map(({ icon, title, body }) => (
              <div className="clinical-card" key={title}>
                <div className="card-icon-wrap">
                  <span className="material-symbols-outlined" style={{ fontSize: 30, color: 'var(--primary)' }}>{icon}</span>
                </div>
                <h3 className="card-title">{title}</h3>
                <p className="card-body">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default SearchPage;