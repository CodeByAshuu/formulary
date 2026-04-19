import React from 'react';
import '../index.css';

function SubstituteComparisonPage() {
  const referenceMedicine = {
    name: 'Paramin 500mg',
    price: '$5.50',
    manufacturer: 'Atelier Pharma',
    form: 'Tablet',
    activeIngredients: 'Paracetamol 500mg',
  };

  const substitutes = [
    {
      id: 1,
      name: 'Crocin 500',
      price: '$2.00',
      manufacturer: 'GSK',
      form: 'Tablet',
      activeIngredients: 'Paracetamol 500mg',
      matchScore: '100%',
      savings: '63%',
      isRecommended: true
    },
    {
      id: 2,
      name: 'Dolo 500',
      price: '$2.50',
      manufacturer: 'Micro Labs',
      form: 'Tablet',
      activeIngredients: 'Paracetamol 500mg',
      matchScore: '100%',
      savings: '54%',
      isRecommended: false
    },
    {
      id: 3,
      name: 'Panadol',
      price: '$3.00',
      manufacturer: 'Haleon',
      form: 'Caplet',
      activeIngredients: 'Paracetamol 500mg',
      matchScore: '98%',
      savings: '45%',
      isRecommended: false
    }
  ];

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="hero-header" style={{ paddingBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <span className="label-sm" style={{ cursor: 'pointer' }}>&larr; Back to Detail</span>
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
                 <div className="body-md" style={{ color: 'var(--on-surface)', fontWeight: 600 }}>{referenceMedicine.activeIngredients}</div>
               </div>
               <div>
                 <div className="label-sm">Manufacturer</div>
                 <div className="body-md" style={{ color: 'var(--on-surface)' }}>{referenceMedicine.manufacturer}</div>
               </div>
               <div>
                 <div className="label-sm">Form Factor</div>
                 <div className="body-md" style={{ color: 'var(--on-surface)' }}>{referenceMedicine.form}</div>
               </div>
               <div style={{ marginTop: '16px', borderTop: '1px solid var(--outline-variant)', paddingTop: '16px' }}>
                 <div className="label-sm">Current Cost</div>
                 <h2 className="headline-sm" style={{ margin: 0, color: 'var(--on-surface)' }}>{referenceMedicine.price}</h2>
               </div>
             </div>
          </div>

          {/* Comparison Cards Area (Right Side) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
             {substitutes.map(sub => (
                <div key={sub.id} className="clinical-card" style={{ position: 'relative' }}>
                  
                  {sub.isRecommended && (
                    <span className="chip chip-success" style={{ position: 'absolute', top: '-12px', left: '24px', boxShadow: 'var(--shadow-ambient)' }}>
                      Top Recommendation
                    </span>
                  )}

                  <div style={{ marginTop: sub.isRecommended ? '12px' : '0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <h3 className="title-md" style={{ margin: 0 }}>{sub.name}</h3>
                    <span className="label-sm" style={{ color: 'var(--tertiary)', fontWeight: 700 }}>{sub.matchScore} Match</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
                     <div>
                       <div className="label-sm">Manufacturer</div>
                       <div className="body-md" style={{ color: 'var(--on-surface)' }}>{sub.manufacturer}</div>
                     </div>
                     <div>
                       <div className="label-sm">Form Factor</div>
                       <div className="body-md" style={{ color: 'var(--on-surface)' }}>{sub.form}</div>
                     </div>
                     
                     <div style={{ marginTop: 'auto', backgroundColor: 'var(--surface)', padding: '16px', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div className="label-sm">Cost</div>
                          <h2 className="title-md" style={{ margin: 0, color: 'var(--on-surface)' }}>{sub.price}</h2>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <span className="chip chip-action" style={{ background: 'var(--primary-fixed-dim)', color: 'var(--primary)', fontWeight: 700 }}>
                            Save {sub.savings}
                          </span>
                        </div>
                     </div>
                  </div>
                  
                  <button className="btn-primary" style={{ width: '100%', marginTop: '16px', background: sub.isRecommended ? 'linear-gradient(135deg, var(--primary), var(--primary-container))' : 'var(--surface-container-high)', color: sub.isRecommended ? 'white' : 'var(--primary)', border: 'none', boxShadow: sub.isRecommended ? 'var(--shadow-ambient)' : 'none' }}>
                    Select Substitute
                  </button>

                </div>
             ))}
          </div>

        </div>

      </div>
    </div>
  );
}

export default SubstituteComparisonPage;
