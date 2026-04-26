import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMedicineDetails, getMedicineSubstitutes } from '../api/medicine';
import '../index.css';

function SubstituteComparisonPage() {
  const { id } = useParams();
  const [referenceMedicine, setReferenceMedicine] = useState(null);
  const [substitutes, setSubstitutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [refData, subData] = await Promise.all([
          getMedicineDetails(id),
          getMedicineSubstitutes(id)
        ]);
        setReferenceMedicine(refData);
        
        // Sort substitutes by price to easily find the cheapest
        const sortedSubs = [...subData].sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        setSubstitutes(sortedSubs);
      } catch (err) {
        console.error('Failed to fetch comparison data:', err);
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

  if (!referenceMedicine) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center gap-4">
        <h2 className="title-md">Pharmacological reference not found</h2>
        <button onClick={() => navigate(-1)} className="btn-primary">Go Back</button>
      </div>
    );
  }

  const cheapestPrice = substitutes.length > 0 ? parseFloat(substitutes[0].price) : null;

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="hero-header" style={{ paddingBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <button onClick={() => navigate(-1)} className="label-sm" style={{ cursor: 'pointer', background: 'transparent', border: 'none', color: 'inherit' }}>&larr; Back to Detail</button>
        </div>
        
        <div>
          <h1 className="display-lg hero-header-gradient" style={{ margin: '0 0 8px 0' }}>Substitute Analysis</h1>
          <p className="title-md" style={{ color: 'var(--on-surface-variant)', margin: 0 }}>
            Comparing cost-effective alternatives for <span style={{ color: 'var(--on-surface)', fontWeight: 700 }}>{referenceMedicine.name}</span>
          </p>
        </div>
      </div>

      <div className="workspace-layer">
        
        {/* Bento Grid Header / Reference Card */}
        <div className="bento-grid" style={{ gridTemplateColumns: 'minmax(250px, 300px) 1fr' }}>
          
          {/* Reference Column (Left Side Anchor) */}
          <div className="clinical-card" style={{ border: '2px solid var(--primary)', backgroundColor: 'var(--surface-container-low)', boxShadow: 'none' }}>
             <span className="chip chip-action" style={{ alignSelf: 'flex-start', background: 'var(--primary)', color: 'white', marginBottom: '8px' }}>Reference Drug</span>
             <h3 className="title-md" style={{ margin: '0 0 16px 0', fontSize: '1.25rem' }}>{referenceMedicine.name}</h3>
             
             <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
               <div>
                 <div className="label-sm">Active Ingredients</div>
                 <div className="body-md" style={{ color: 'var(--on-surface)', fontWeight: 600 }}>{referenceMedicine.composition}</div>
               </div>
               <div>
                 <div className="label-sm">Manufacturer</div>
                 <div className="body-md" style={{ color: 'var(--on-surface)' }}>{referenceMedicine.manufacturer}</div>
               </div>
               <div>
                 <div className="label-sm">Pharmacological Status</div>
                 <div className="body-md" style={{ color: 'var(--on-surface)' }}>Verified Molecule</div>
               </div>
               <div style={{ marginTop: '16px', borderTop: '1px solid var(--outline-variant)', paddingTop: '16px' }}>
                 <div className="label-sm">Standard Cost</div>
                 <h2 className="headline-sm" style={{ margin: 0, color: 'var(--on-surface)' }}>${referenceMedicine.price}</h2>
               </div>
             </div>
          </div>

          {/* Comparison Cards Area (Right Side) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
             {substitutes.length === 0 ? (
               <div className="clinical-card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px' }}>
                  <h3 className="title-md">No substitutes found</h3>
                  <p className="body-md">No molecular matches are currently in the clinical repository for this compound.</p>
               </div>
             ) : (
               substitutes.map((sub, idx) => {
                 const isCheapest = parseFloat(sub.price) === cheapestPrice;
                 const savings = Math.round(((parseFloat(referenceMedicine.price) - parseFloat(sub.price)) / parseFloat(referenceMedicine.price)) * 100);

                 return (
                   <div key={sub.id} className="clinical-card" style={{ position: 'relative', border: isCheapest ? '2px solid var(--primary)' : '1px solid var(--outline-variant)' }}>
                     
                     {isCheapest && (
                       <span className="chip chip-success" style={{ position: 'absolute', top: '-12px', left: '24px', boxShadow: 'var(--shadow-ambient)', background: 'var(--primary)', color: 'white' }}>
                         Best Price Strategy
                       </span>
                     )}

                     <div style={{ marginTop: isCheapest ? '12px' : '0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                       <h3 className="title-md" style={{ margin: 0 }}>{sub.name}</h3>
                       <span className="label-sm" style={{ color: 'var(--primary)', fontWeight: 700 }}>100% Match</span>
                     </div>

                     <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
                        <div>
                          <div className="label-sm">Manufacturer</div>
                          <div className="body-md" style={{ color: 'var(--on-surface)' }}>{sub.manufacturer}</div>
                        </div>
                        <div>
                          <div className="label-sm">Molecule Index</div>
                          <div className="body-md" style={{ color: 'var(--on-surface)' }}>Pharmacological Equivalent</div>
                        </div>
                        
                        <div style={{ marginTop: 'auto', backgroundColor: isCheapest ? 'var(--primary-fixed-dim)' : 'var(--surface-container-low)', padding: '16px', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                           <div>
                             <div className="label-sm">Retail Cost</div>
                             <h2 className="title-md" style={{ margin: 0, color: 'var(--on-surface)' }}>${sub.price}</h2>
                           </div>
                           <div style={{ textAlign: 'right' }}>
                             <span className="chip chip-action" style={{ background: isCheapest ? 'var(--primary)' : 'var(--primary-fixed-dim)', color: isCheapest ? 'white' : 'var(--primary)', fontWeight: 700 }}>
                               Save {savings}%
                             </span>
                           </div>
                        </div>
                     </div>
                     
                     <button 
                        onClick={() => navigate(`/medicine/${sub.id}`)}
                        className="btn-primary" 
                        style={{ width: '100%', marginTop: '16px', background: isCheapest ? 'linear-gradient(135deg, var(--primary), var(--primary-container))' : 'var(--surface-container-high)', color: isCheapest ? 'white' : 'var(--primary)', border: 'none', boxShadow: isCheapest ? 'var(--shadow-ambient)' : 'none' }}>
                       View Clinical Profile
                     </button>

                   </div>
                 );
               })
             )}
          </div>

        </div>

      </div>
    </div>
  );
}

export default SubstituteComparisonPage;
