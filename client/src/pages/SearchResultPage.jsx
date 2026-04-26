import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { searchMedicines } from '../api/medicine';
import '../index.css';

function SearchResultPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [searchTerm, setSearchTerm] = useState(query);
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) return;
      setLoading(true);
      try {
        const data = await searchMedicines(query);
        setMedicines(data);
      } catch (err) {
        console.error('Search failed:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [query]);

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      setSearchParams({ q: searchTerm.trim() });
    }
  };

  return (
    <div className="dashboard-container">
      {/* Ghost Input Header */}
      <div className="hero-header" style={{ paddingBottom: '24px' }}>
         <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
           <h1 className="title-md" style={{ margin: 0, color: 'var(--primary)' }}>Formulary Search</h1>
           <span className="chip chip-action" style={{ fontSize: '0.6rem' }}>Clinical View</span>
         </div>
         <div className="ghost-input-container">
          <input
            type="text"
            className="ghost-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleSearch}
            placeholder="Search medicine (e.g., Paracetamol)..."
          />
        </div>
      </div>

      {/* Results Layer */}
      <div className="workspace-layer">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h2 className="headline-sm" style={{ margin: 0 }}>Results for "{query}"</h2>
            <p className="body-md" style={{ margin: '4px 0 0 0' }}>
              {loading ? 'Searching...' : `Found ${medicines.length} clinical profiles.`}
            </p>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '100px' }}>
            <div className="animate-spin" style={{ width: '40px', height: '40px', border: '4px solid var(--primary)', borderTopColor: 'transparent', borderRadius: '50%', margin: '0 auto' }}></div>
          </div>
        ) : (
          <div className="bento-grid">
            {medicines.map((med) => (
              <div key={med.id} className="clinical-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h3 className="title-md" style={{ margin: '0 0 4px 0' }}>{med.name}</h3>
                    <div className="body-md">{med.composition}</div>
                  </div>
                </div>

                <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                      <div className="label-sm">Manufacturer</div>
                      <div className="body-md" style={{ color: 'var(--on-surface)' }}>{med.manufacturer}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div className="label-sm">Retail Price</div>
                      <div className="title-md" style={{ color: 'var(--primary)' }}>${med.price}</div>
                    </div>
                  </div>

                  <Link to={`/medicine/${med.id}`} className="btn-primary" style={{ textAlign: 'center', textDecoration: 'none' }}>
                    View Clinical Profile
                  </Link>
                </div>
              </div>
            ))}

            {medicines.length === 0 && !loading && (
               <div className="clinical-card" style={{ gridColumn: 'span 2', textAlign: 'center', padding: '60px' }}>
                  <h3 className="title-md">No results found</h3>
                  <p className="body-md">Try searching for a different name or composition.</p>
               </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchResultPage;
