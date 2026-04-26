import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      navigate(`/search-results?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <div className="dashboard-container">
      {/* Search Header */}
      <div className="hero-header" style={{ minHeight: '60vh'}}>
        <h1 className="display-lg hero-header-gradient" style={{ fontSize: '4rem', marginBottom: '24px' }}>Formulary</h1>
        <p className="body-lg" style={{ maxWidth: '600px', fontSize: '1.20rem', color: 'var(--on-surface-variant)' }}>
          The Clinical Atelier for Medicine Strategy. Find optimized pricing through molecular equivalents.
        </p>

        <div className="ghost-input-container" style={{ marginTop: '48px', width: '100%', maxWidth: '600px' }}>
          <input
            type="text"
            className="ghost-input"
            placeholder="Search medicine (e.g., Paracetamol)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleSearch}
            autoFocus
          />
          <div style={{ marginTop: '16px' }} className="label-sm">
            Press <span style={{ fontWeight: 700, color: 'var(--primary)' }}>Enter</span> to start Molecular Search
          </div>
        </div>
      </div>

      {/* Feature Highlight Layer */}
      <div className="workspace-layer" style={{ marginTop: '-80px' }}>
        <div className="bento-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
          <div className="clinical-card" style={{ textAlign: 'center', padding: '40px 24px' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '48px', color: 'var(--primary)', marginBottom: '16px' }}>search</span>
            <h3 className="title-md">Instant Search</h3>
            <p className="body-md" style={{ marginTop: '8px' }}>Fast, indexed search across thousands of medical compounds.</p>
          </div>
          <div className="clinical-card" style={{ textAlign: 'center', padding: '40px 24px' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '48px', color: 'var(--primary)', marginBottom: '16px' }}>compare_arrows</span>
            <h3 className="title-md">Price Optimization</h3>
            <p className="body-md" style={{ marginTop: '8px' }}>Instantly discover equivalent substitutes with lower retail costs.</p>
          </div>
          <div className="clinical-card" style={{ textAlign: 'center', padding: '40px 24px' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '48px', color: 'var(--primary)', marginBottom: '16px' }}>verified_user</span>
            <h3 className="title-md">Verified Data</h3>
            <p className="body-md" style={{ marginTop: '8px' }}>Directly sourced from manufacturer indexes and clinical guidelines.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchPage;
