import React from 'react';
import '../index.css';

function SearchResultPage() {
  const query = "Paracetamol";
  
  // Dummy data mimicking a search result based on the Atelier Design System
  const mockMedicines = [
    {
      id: 1,
      name: 'Paramin 500mg',
      composition: 'Paracetamol',
      manufacturer: 'Atelier Pharma',
      price: '$5.50',
      isExactMatch: true,
      type: 'Primary Search',
      substitutes: [
        { name: 'Crocin 500', price: '$2.00', mfg: 'GSK' },
        { name: 'Dolo 500', price: '$2.50', mfg: 'Micro Labs' },
        { name: 'Panadol', price: '$3.00', mfg: 'Haleon' }
      ]
    },
    {
      id: 2,
      name: 'Aspire 75mg',
      composition: 'Aspirin',
      manufacturer: 'Vitality Meds',
      price: '$4.20',
      isExactMatch: false,
      type: 'Related Composition',
      substitutes: [
        { name: 'Disprin 75', price: '$1.00', mfg: 'Reckitt Benckiser' }
      ]
    }
  ];

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
            defaultValue={query}
            placeholder="Search medicine (e.g., Paracetamol)..."
          />
        </div>
      </div>

      {/* Results Layer */}
      <div className="workspace-layer">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h2 className="headline-sm" style={{ margin: 0 }}>Results for "{query}"</h2>
            <p className="body-md" style={{ margin: '4px 0 0 0' }}>Found {mockMedicines.length} clinical profiles with matching parameters.</p>
          </div>
          <button className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.875rem' }}>Filters</button>
        </div>

        {/* Bento Grid */}
        <div className="bento-grid">
          {mockMedicines.map((med) => (
            <div key={med.id} className="clinical-card">
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 className="title-md" style={{ margin: '0 0 4px 0' }}>{med.name}</h3>
                  <div className="body-md">{med.composition}</div>
                </div>
                <span className={`chip ${med.isExactMatch ? 'chip-success' : 'chip-action'}`}>
                  {med.type}
                </span>
              </div>

              <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <div className="label-sm">Manufacturer</div>
                    <div className="body-md" style={{ color: 'var(--on-surface)' }}>{med.manufacturer}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div className="label-sm">Average Price</div>
                    <div className="title-md" style={{ color: 'var(--primary)' }}>{med.price}</div>
                  </div>
                </div>

                {/* Substitutes Area in nested surface container */}
                <div style={{ backgroundColor: 'var(--surface)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
                  <div className="label-sm" style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between' }}>
                    <span>Recommended Substitutes</span>
                    <span style={{ color: 'var(--primary)' }}>{med.substitutes.length} matches</span>
                  </div>
                  {med.substitutes.map((sub, idx) => (
                    <div key={idx} className="card-line-item">
                      <div className="body-md" style={{ color: 'var(--on-surface)' }}>{sub.name}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className="body-md">{sub.mfg}</span>
                        <span className="chip chip-tertiary">{sub.price}</span>
                      </div>
                    </div>
                  ))}
                  <button className="btn-primary" style={{ width: '100%', marginTop: '16px', padding: '8px', background: 'transparent', color: 'var(--primary)', boxShadow: 'none', border: '1px solid var(--primary-ghost-border)' }}>
                    Analyze Composition
                  </button>
                </div>
              </div>

            </div>
          ))}

          {/* Educational or Action Card in the Bento Grid */}
          <div className="clinical-card" style={{ gridColumn: 'span 1', backgroundColor: 'var(--secondary-container)' }}>
             <h3 className="title-md" style={{ color: 'var(--on-secondary-container)', marginBottom: '8px' }}>Active Filters</h3>
             <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
               <span className="chip chip-success">In Stock</span>
               <span className="chip chip-success">Cost &lt; $5.00</span>
               <span className="chip chip-action" style={{ background: 'white' }}>Exclude Generic</span>
             </div>
             
             <div style={{ marginTop: 'auto', paddingTop: '24px' }}>
               <p className="body-md" style={{ color: 'var(--on-secondary-container)' }}>Showing top recommended substitutes prioritizing lowest cost matched with exact pharmacological structure.</p>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default SearchResultPage;
