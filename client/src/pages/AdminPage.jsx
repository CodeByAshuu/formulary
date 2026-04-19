import React, { useState } from 'react';
import '../index.css';

function AdminPage() {
  const [formData, setFormData] = useState({ name: '', composition: '', manufacturer: '', price: '' });

  const metrics = [
    { label: 'Active Formularies', value: '14,230', status: '+240 this week' },
    { label: 'Pending Substitutes', value: '84', status: 'Requires Review' },
    { label: 'System Health', value: '99.9%', status: 'All systems nominal' }
  ];

  const recentEntries = [
    { id: 1, name: 'Paramin 500mg', date: 'Oct 24, 2024', status: 'Verified' },
    { id: 2, name: 'Aspire 75mg', date: 'Oct 23, 2024', status: 'Verified' },
    { id: 3, name: 'Ibupro 400', date: 'Oct 22, 2024', status: 'Pending' }
  ];

  return (
    <div className="dashboard-container">
      {/* Admin Header */}
      <div className="hero-header" style={{ paddingBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span className="label-sm" style={{ color: 'var(--primary)' }}>Secure Access</span>
            <h1 className="display-lg hero-header-gradient" style={{ margin: '8px 0' }}>Clinical Admin</h1>
            <p className="body-md" style={{ color: 'var(--on-surface-variant)', maxWidth: '500px' }}>
              Manage master formulary datasets, govern substitute linkages, and monitor system performance. Ensure clinical accuracy before publishing to the live search index.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <button className="btn-primary" style={{ background: 'var(--surface-container-high)', color: 'var(--primary)', boxShadow: 'none' }}>
              Export Logs
            </button>
            <button className="btn-primary">
              Publish Updates
            </button>
          </div>
        </div>
      </div>

      <div className="workspace-layer">
        
        {/* Top High-Level Metrics (Bento Grid) */}
        <div className="bento-grid" style={{ marginBottom: '32px' }}>
           {metrics.map((metric, idx) => (
             <div key={idx} className="clinical-card">
                <div className="label-sm">{metric.label}</div>
                <h2 className="display-lg" style={{ color: 'var(--on-surface)', margin: '8px 0' }}>{metric.value}</h2>
                <div className="body-md" style={{ color: 'var(--tertiary)', fontWeight: 600 }}>{metric.status}</div>
             </div>
           ))}
        </div>

        {/* Lower Layout - Split between Entry Form and Recent Activity */}
        <div className="bento-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))' }}>
          
          {/* Data Entry Form */}
          <div className="clinical-card" style={{ gridColumn: 'span 2' }}>
            <h3 className="title-md" style={{ marginBottom: '24px' }}>Add New Formulary Entry</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <div className="ghost-input-container">
                <label className="label-sm" style={{ display: 'block', marginBottom: '8px' }}>Medicine Name</label>
                <input type="text" className="ghost-input" placeholder="e.g., Crocin 500" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
              </div>
              
              <div className="ghost-input-container">
                <label className="label-sm" style={{ display: 'block', marginBottom: '8px' }}>Active Composition</label>
                <input type="text" className="ghost-input" placeholder="e.g., Paracetamol 500mg" value={formData.composition} onChange={(e) => setFormData({...formData, composition: e.target.value})} />
              </div>

              <div className="ghost-input-container">
                <label className="label-sm" style={{ display: 'block', marginBottom: '8px' }}>Manufacturer</label>
                <input type="text" className="ghost-input" placeholder="e.g., GSK" value={formData.manufacturer} onChange={(e) => setFormData({...formData, manufacturer: e.target.value})} />
              </div>

              <div className="ghost-input-container">
                <label className="label-sm" style={{ display: 'block', marginBottom: '8px' }}>Standard Price</label>
                <input type="text" className="ghost-input" placeholder="$0.00" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} />
              </div>
            </div>

            <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn-primary">Commit to Pending Database</button>
            </div>
          </div>

          {/* Audit Trail / Recent Entries */}
          <div className="clinical-card" style={{ backgroundColor: 'var(--secondary-container)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 className="title-md" style={{ color: 'var(--on-secondary-container)' }}>Audit Trail</h3>
              <span className="label-sm" style={{ color: 'var(--primary)' }}>View All</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {recentEntries.map(entry => (
                <div key={entry.id} className="card-line-item" style={{ backgroundColor: 'white', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--outline-variant)' }}>
                  <div>
                    <div className="body-md" style={{ fontWeight: 600, color: 'var(--on-surface)' }}>{entry.name}</div>
                    <div className="label-sm">{entry.date}</div>
                  </div>
                  <span className={`chip ${entry.status === 'Verified' ? 'chip-success' : 'chip-action'}`}>
                    {entry.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

export default AdminPage;
