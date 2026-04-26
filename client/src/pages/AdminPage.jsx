import React, { useState } from 'react';
import { addMedicine, bulkUploadMedicines } from '../api/medicine';
import '../index.css';

function AdminPage() {
  const [formData, setFormData] = useState({ name: '', composition: '', manufacturer: '', price: '' });
  const [csvData, setCsvData] = useState('');
  const [fileName, setFileName] = useState('');
  const [status, setStatus] = useState(null);
  const [summary, setSummary] = useState(null);

  const handleSingleSubmit = async () => {
    try {
      setStatus({ type: 'loading', message: 'Committing to database...' });
      await addMedicine({
        ...formData,
        price: parseFloat(formData.price)
      });
      setStatus({ type: 'success', message: 'Medicine added and substitutes auto-linked.' });
      setFormData({ name: '', composition: '', manufacturer: '', price: '' });
    } catch (err) {
      setStatus({ type: 'error', message: err.response?.data?.error || 'Failed to add medicine.' });
    }
  };

  const handleBulkUpload = async () => {
    try {
      setStatus({ type: 'loading', message: 'Processing molecular batch...' });
      const result = await bulkUploadMedicines(csvData);
      setSummary(result);
      setStatus({ type: 'success', message: 'Batch upload complete.' });
      setCsvData('');
      setFileName('');
    } catch (err) {
      setStatus({ type: 'error', message: err.response?.data?.error || 'Bulk upload failed.' });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        setCsvData(event.target.result);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="hero-header" style={{ paddingBottom: '24px' }}>
        <h1 className="display-lg hero-header-gradient" style={{ margin: '8px 0' }}>Clinical Admin</h1>
        <p className="body-md" style={{ color: 'var(--on-surface-variant)', maxWidth: '500px' }}>
          Govern master formulary datasets and molecular linkages. Automate substitute discovery through batch synchronization.
        </p>

        {status && (
          <div className={`chip ${status.type === 'error' ? 'chip-danger' : 'chip-success'}`} style={{ marginTop: '16px', padding: '12px 24px', borderRadius: 'var(--radius-md)' }}>
             <span className="material-symbols-outlined" style={{ verticalAlign: 'middle', marginRight: '8px' }}>
               {status.type === 'error' ? 'error' : (status.type === 'loading' ? 'speed' : 'check_circle')}
             </span>
             {status.message}
          </div>
        )}
      </div>

      <div className="workspace-layer">
        <div className="bento-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))' }}>
          
          {/* Section 1: Single Entry */}
          <div className="clinical-card">
            <h3 className="title-md" style={{ marginBottom: '24px' }}>Single Formulary Entry</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div className="ghost-input-container">
                <label className="label-sm">Medicine Name</label>
                <input type="text" className="ghost-input" placeholder="e.g., Crocin 500" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="ghost-input-container">
                <label className="label-sm">Active Composition</label>
                <input type="text" className="ghost-input" placeholder="e.g., Paracetamol" value={formData.composition} onChange={(e) => setFormData({...formData, composition: e.target.value})} />
              </div>
              <div className="ghost-input-container">
                <label className="label-sm">Manufacturer</label>
                <input type="text" className="ghost-input" placeholder="e.g., GSK" value={formData.manufacturer} onChange={(e) => setFormData({...formData, manufacturer: e.target.value})} />
              </div>
              <div className="ghost-input-container">
                <label className="label-sm">Retail Price ($)</label>
                <input type="text" className="ghost-input" placeholder="0.00" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} />
              </div>
              <button 
                className="btn-primary" 
                onClick={handleSingleSubmit} 
                disabled={status?.type === 'loading'}
                style={{ marginTop: 'auto' }}
              >
                Sync with Repository
              </button>
            </div>
          </div>

          {/* Section 2: Bulk Upload */}
          <div className="clinical-card" style={{ backgroundColor: 'var(--secondary-container)', border: '1px solid var(--outline-variant)' }}>
            <h3 className="title-md" style={{ color: 'var(--on-secondary-container)', marginBottom: '8px' }}>Bulk Molecular Sync</h3>
            <p className="body-sm" style={{ color: 'var(--on-secondary-container)', marginBottom: '24px' }}>
              Upload CSV data (name, composition, manufacturer, price). System will automatically discover and link all pharmacological substitutes.
            </p>
            
            <label 
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '240px',
                border: '2px dashed var(--outline-variant)',
                borderRadius: 'var(--radius-lg)',
                backgroundColor: 'var(--surface)',
                cursor: 'pointer',
                transition: 'border-color 0.2s',
                padding: '24px',
                textAlign: 'center'
              }}
              onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
              onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--outline-variant)'}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '48px', color: 'var(--primary)', marginBottom: '16px' }}>
                cloud_upload
              </span>
              <span className="title-md" style={{ color: 'var(--on-surface)', marginBottom: '8px' }}>
                {fileName ? 'File Selected' : 'Select CSV File'}
              </span>
              <span className="body-sm" style={{ color: 'var(--tertiary)' }}>
                {fileName ? fileName : 'Browse your computer to upload'}
              </span>
              <input 
                type="file" 
                accept=".csv" 
                style={{ display: 'none' }} 
                onChange={handleFileChange}
              />
            </label>

            <button 
              className="btn-primary" 
              style={{ width: '100%', marginTop: '24px' }}
              onClick={handleBulkUpload}
              disabled={status?.type === 'loading' || !csvData.trim()}
            >
              Parse & Automate Linkages
            </button>

            {summary && (
              <div style={{ marginTop: '24px', padding: '16px', background: 'white', borderRadius: 'var(--radius-md)', border: '1px solid var(--outline-variant)' }}>
                 <div className="label-sm" style={{ marginBottom: '12px', fontWeight: 700 }}>Processing Summary</div>
                 <div style={{ display: 'flex', gap: '16px' }}>
                   <div><span className="label-sm">Total:</span> <span className="title-md">{summary.total}</span></div>
                   <div><span className="label-sm">Synced:</span> <span className="title-md" style={{ color: 'var(--primary)' }}>{summary.inserted}</span></div>
                   <div><span className="label-sm">Failed:</span> <span className="title-md" style={{ color: 'red' }}>{summary.failed}</span></div>
                 </div>
                 {summary.errors.length > 0 && (
                   <div style={{ marginTop: '12px', fontSize: '0.75rem', color: 'red', maxHeight: '100px', overflowY: 'auto' }}>
                     {summary.errors.map((err, i) => <div key={i}>{err.record}: {err.error}</div>)}
                   </div>
                 )}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default AdminPage;
