import { useState } from 'react';

function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('');

  // Dummy data mimicking a search result
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
      {/* Search Header */}
      <div className="hero-header">
        <h1 className="display-lg hero-header-gradient">Clinical Formulary</h1>
        <p className="body-md" style={{ maxWidth: '400px' }}>
          Search for medicines by name or composition. Identify exact matches, review manufacturers, and find optimized pricing through equivalents.
        </p>

        <div className="ghost-input-container" style={{ marginTop: '24px' }}>
          <input
            type="text"
            className="ghost-input"
            placeholder="Search medicine (e.g., Paracetamol)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* The Workspace Layer */}
      <div className="workspace-layer">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 className="headline-sm">Query Results</h2>
          <span className="label-sm">Displaying high-confidence matches</span>
        </div>

        {/* Bento Grid layout for results */}
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

              {/* Data without dividers, using gap and typography */}
              <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <div className="label-sm">Manufacturer</div>
                    <div className="body-md" style={{ color: 'var(--on-surface)' }}>{med.manufacturer}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div className="label-sm">Current Price</div>
                    <div className="title-md" style={{ color: 'var(--primary)' }}>{med.price}</div>
                  </div>
                </div>

                {/* Substitutes Area */}
                <div style={{ backgroundColor: 'var(--surface)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
                  <div className="label-sm" style={{ marginBottom: '12px' }}>Available Substitutes</div>
                  {med.substitutes.map((sub, idx) => (
                    <div key={idx} className="card-line-item">
                      <div className="body-md" style={{ color: 'var(--on-surface)' }}>{sub.name}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className="body-md">{sub.mfg}</span>
                        <span className="chip chip-tertiary">{sub.price}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ))}
          
          {/* Example of a different sized bento card */}
          <div className="clinical-card" style={{ gridColumn: 'span 1', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'var(--primary-fixed-dim)', border: '1px solid var(--primary-ghost-border)' }}>
             <div style={{ textAlign: 'center' }}>
               <h3 className="title-md" style={{ color: 'var(--primary)' }}>Need more precision?</h3>
               <p className="body-md" style={{ marginTop: '8px', marginBottom: '16px' }}>Use the exact composition ID.</p>
               <button className="btn-primary">Advanced Search</button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchPage;
