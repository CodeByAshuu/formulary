import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getMedicineDetails, getMedicineSubstitutes } from '../api/medicine';
import '../index.css';

function MedicineDetailPage() {
  const { id } = useParams();
  const [medicine, setMedicine] = useState(null);
  const [substitutesCount, setSubstitutesCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [medData, subData] = await Promise.all([
          getMedicineDetails(id),
          getMedicineSubstitutes(id)
        ]);
        setMedicine(medData);
        setSubstitutesCount(subData.length);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="animate-spin" style={{ width: '48px', height: '48px', border: '5px solid var(--primary)', borderTopColor: 'transparent', borderRadius: '50%' }}></div>
      </div>
    );
  }

  if (!medicine) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center gap-4">
        <h2 className="title-md">Clinical profile not found</h2>
        <Link to="/" className="btn-primary">Back to Search</Link>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Detail Header Layer / Breadcrumbs */}
      <div className="hero-header" style={{ paddingBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <button onClick={() => navigate(-1)} className="label-sm" style={{ cursor: 'pointer', background: 'transparent', border: 'none', color: 'inherit' }}>&larr; Back to Results</button>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 className="display-lg hero-header-gradient" style={{ margin: '0 0 8px 0' }}>{medicine.name}</h1>
            <p className="title-md" style={{ color: 'var(--on-surface-variant)', margin: 0 }}>{medicine.composition}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span className="chip chip-success" style={{ marginBottom: '8px' }}>Active Molecular Profile</span>
            <h2 className="headline-sm" style={{ margin: 0, color: 'var(--on-surface)' }}>${medicine.price}</h2>
            <div className="label-sm">Standard Unit Retail Price</div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="workspace-layer">
        <h2 className="headline-sm" style={{ marginBottom: '24px' }}>Clinical Profile</h2>
        
        {/* Bento Grid - Detail Layout */}
        <div className="bento-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
          
          {/* Overview */}
          <div className="clinical-card" style={{ gridColumn: 'span 2' }}>
            <h3 className="title-md" style={{ marginBottom: '12px' }}>Pharmacological Overview</h3>
            <p className="body-md" style={{ marginBottom: '24px', lineHeight: '1.6' }}>
              {medicine.description || `This molecular profile for ${medicine.name} (${medicine.composition}) provides verified manufacturer data and pricing strategy. For full contraindications, consult the clinical repository.`}
            </p>
            
            <div style={{ display: 'flex', gap: '48px' }}>
              <div>
                <div className="label-sm">Manufacturer</div>
                <div className="body-md" style={{ fontWeight: 600, color: 'var(--on-surface)' }}>{medicine.manufacturer}</div>
              </div>
              <div>
                <div className="label-sm">Composition Status</div>
                <div className="body-md" style={{ fontWeight: 600, color: 'var(--on-surface)' }}>Exact Molecular Match</div>
              </div>
            </div>
          </div>

          {/* Action Card */}
          <div className="clinical-card" style={{ backgroundColor: 'var(--primary-fixed-dim)', border: '1px solid var(--primary-ghost-border)' }}>
             <h3 className="title-md" style={{ color: 'var(--primary)', marginBottom: '16px' }}>Optimization Analysis</h3>
             <p className="body-md" style={{ marginBottom: '24px' }}>
               We have identified <span style={{ fontWeight: 700 }}>{substitutesCount}</span> pharmacological equivalents with varying cost structures.
             </p>
             <Link to={`/substitutes/${medicine.id}`} className="btn-primary" style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}>
               Compare Price Strategy
             </Link>
          </div>

          {/* Bottom Card - Composition Details */}
          <div className="clinical-card" style={{ gridColumn: '1 / -1' }}>
             <h3 className="title-md" style={{ marginBottom: '16px' }}>Molecular Repository</h3>
             <div className="body-md">
               Manufacturer of Record: <span style={{ fontWeight: 700 }}>{medicine.manufacturer}</span> | 
               Indexed ID: <span style={{ fontWeight: 700 }}>MED-{medicine.id.toString().padStart(5, '0')}</span> | 
               Price Verification Index: <span style={{ fontWeight: 700 }}>{new Date().toLocaleDateString()}</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MedicineDetailPage;
