import React from 'react';
import '../index.css';

function MedicineDetailPage() {
  const medicine = {
    id: 1,
    name: 'Paramin 500mg',
    composition: 'Paracetamol',
    manufacturer: 'Atelier Pharma',
    price: '$5.50',
    type: 'Primary Search',
    status: 'In Stock',
    description: 'A widely used analgesic and antipyretic medication used to treat pain and fever. It is typically used for mild to moderate pain relief.',
    sideEffects: ['Nausea', 'Skin rash', 'Liver damage (in high doses)'],
    dosage: '500mg every 4-6 hours',
    substitutes: [
      { name: 'Crocin 500', price: '$2.00', mfg: 'GSK' },
      { name: 'Dolo 500', price: '$2.50', mfg: 'Micro Labs' },
      { name: 'Panadol', price: '$3.00', mfg: 'Haleon' }
    ]
  };

  return (
    <div className="dashboard-container">
      {/* Detail Header Layer / Breadcrumbs */}
      <div className="hero-header" style={{ paddingBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <span className="label-sm" style={{ cursor: 'pointer' }}>&larr; Back to Results</span>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 className="display-lg hero-header-gradient" style={{ margin: '0 0 8px 0' }}>{medicine.name}</h1>
            <p className="title-md" style={{ color: 'var(--on-surface-variant)', margin: 0 }}>{medicine.composition}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span className="chip chip-success" style={{ marginBottom: '8px' }}>{medicine.status}</span>
            <h2 className="headline-sm" style={{ margin: 0, color: 'var(--on-surface)' }}>{medicine.price}</h2>
            <div className="label-sm">Standard Unit Retail Price</div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="workspace-layer">
        <h2 className="headline-sm" style={{ marginBottom: '24px' }}>Clinical Profile</h2>
        
        {/* Bento Grid - Detail Layout */}
        <div className="bento-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
          
          {/* Top Left - Overview (Width 2/3 roughly depending on screen) */}
          <div className="clinical-card" style={{ gridColumn: 'span 2' }}>
            <h3 className="title-md" style={{ marginBottom: '12px' }}>Overview</h3>
            <p className="body-md" style={{ marginBottom: '24px' }}>{medicine.description}</p>
            
            <div style={{ display: 'flex', gap: '48px' }}>
              <div>
                <div className="label-sm">Manufacturer</div>
                <div className="body-md" style={{ fontWeight: 600, color: 'var(--on-surface)' }}>{medicine.manufacturer}</div>
              </div>
              <div>
                <div className="label-sm">Recommended Dosage</div>
                <div className="body-md" style={{ fontWeight: 600, color: 'var(--on-surface)' }}>{medicine.dosage}</div>
              </div>
            </div>
          </div>

          {/* Top Right - Side Effects Panel */}
          <div className="clinical-card" style={{ backgroundColor: 'var(--secondary-container)' }}>
             <h3 className="title-md" style={{ color: 'var(--on-secondary-container)', marginBottom: '16px' }}>Contraindications & Notes</h3>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
               {medicine.sideEffects.map((effect, idx) => (
                 <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--primary)' }}></span>
                    <span className="body-md" style={{ color: 'var(--on-secondary-container)' }}>{effect}</span>
                 </div>
               ))}
             </div>
          </div>

          {/* Bottom Full Width - Substitute Analysis */}
          <div className="clinical-card" style={{ gridColumn: '1 / -1', marginTop: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 className="title-md">Recommended Substitutes</h3>
              <span className="chip chip-action">{medicine.substitutes.length} Available</span>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              {medicine.substitutes.map((sub, idx) => (
                <div key={idx} style={{ backgroundColor: 'var(--surface)', padding: '24px', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div className="title-md">{sub.name}</div>
                    <div className="title-md" style={{ color: 'var(--primary)' }}>{sub.price}</div>
                  </div>
                  <div className="label-sm" style={{ marginBottom: '16px' }}>{sub.mfg}</div>
                  
                  <button className="btn-primary" style={{ width: '100%', padding: '10px', fontSize: '0.875rem' }}>
                    View Profile
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default MedicineDetailPage;
