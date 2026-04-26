import React, { useState, useEffect } from 'react';
import { 
  addMedicine, 
  bulkUploadMedicines, 
  getAdminMetrics, 
  getAllMedicines, 
  updateMedicine, 
  deleteMedicine,
  getMedicineSubstitutes,
  removeSubstituteLink
} from '../api/medicine';
import '../index.css';

function AdminPage() {
  // --- State ---
  const [metrics, setMetrics] = useState(null);
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(null);

  // Add form
  const [formData, setFormData] = useState({ name: '', composition: '', manufacturer: '', price: '' });
  
  // Bulk upload
  const [csvData, setCsvData] = useState('');
  const [fileName, setFileName] = useState('');
  const [summary, setSummary] = useState(null);

  // Edit modal
  const [editModal, setEditModal] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', composition: '', manufacturer: '', price: '' });

  // Substitute modal
  const [subModal, setSubModal] = useState(null);
  const [subs, setSubs] = useState([]);
  const [subsLoading, setSubsLoading] = useState(false);

  // Active tab
  const [activeTab, setActiveTab] = useState('table');

  // Search / filter
  const [searchFilter, setSearchFilter] = useState('');

  // --- Data Fetching ---
  const fetchDashboard = async () => {
    try {
      const [m, all] = await Promise.all([getAdminMetrics(), getAllMedicines()]);
      setMetrics(m);
      setMedicines(all);
    } catch (err) {
      console.error('Dashboard fetch failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDashboard(); }, []);

  // --- Handlers ---
  const clearStatus = () => setTimeout(() => setStatus(null), 4000);

  const handleSingleSubmit = async () => {
    if (!formData.name || !formData.composition || !formData.manufacturer || !formData.price) {
      setStatus({ type: 'error', message: 'All fields are required.' }); clearStatus(); return;
    }
    try {
      setStatus({ type: 'loading', message: 'Syncing...' });
      await addMedicine({ ...formData, price: parseFloat(formData.price) });
      setStatus({ type: 'success', message: 'Medicine added & substitutes auto-linked.' }); clearStatus();
      setFormData({ name: '', composition: '', manufacturer: '', price: '' });
      fetchDashboard();
    } catch (err) {
      setStatus({ type: 'error', message: err.response?.data?.error || 'Failed.' }); clearStatus();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => setCsvData(event.target.result);
      reader.readAsText(file);
    }
  };

  const handleBulkUpload = async () => {
    try {
      setStatus({ type: 'loading', message: 'Processing batch...' });
      const result = await bulkUploadMedicines(csvData);
      setSummary(result);
      setStatus({ type: 'success', message: `Batch complete. ${result.inserted} synced, ${result.failed} failed.` }); clearStatus();
      setCsvData(''); setFileName('');
      fetchDashboard();
    } catch (err) {
      setStatus({ type: 'error', message: err.response?.data?.error || 'Bulk upload failed.' }); clearStatus();
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Permanently delete "${name}"? This will also remove all its substitute links.`)) return;
    try {
      await deleteMedicine(id);
      setStatus({ type: 'success', message: `"${name}" deleted.` }); clearStatus();
      fetchDashboard();
    } catch (err) {
      setStatus({ type: 'error', message: err.response?.data?.error || 'Delete failed.' }); clearStatus();
    }
  };

  const openEditModal = (med) => {
    setEditForm({ name: med.name, composition: med.composition, manufacturer: med.manufacturer, price: med.price });
    setEditModal(med);
  };

  const handleEditSubmit = async () => {
    try {
      await updateMedicine(editModal.id, { ...editForm, price: parseFloat(editForm.price) });
      setStatus({ type: 'success', message: `"${editForm.name}" updated.` }); clearStatus();
      setEditModal(null);
      fetchDashboard();
    } catch (err) {
      setStatus({ type: 'error', message: err.response?.data?.error || 'Update failed.' }); clearStatus();
    }
  };

  const openSubModal = async (med) => {
    setSubModal(med);
    setSubsLoading(true);
    try {
      const data = await getMedicineSubstitutes(med.id);
      setSubs(data);
    } catch { setSubs([]); }
    finally { setSubsLoading(false); }
  };

  const handleRemoveSub = async (subId) => {
    try {
      await removeSubstituteLink(subModal.id, subId);
      setSubs(subs.filter(s => s.id !== subId));
      setStatus({ type: 'success', message: 'Link removed.' }); clearStatus();
      fetchDashboard();
    } catch (err) {
      setStatus({ type: 'error', message: 'Failed to remove link.' }); clearStatus();
    }
  };

  const filteredMedicines = medicines.filter(m =>
    m.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
    m.composition.toLowerCase().includes(searchFilter.toLowerCase()) ||
    m.manufacturer.toLowerCase().includes(searchFilter.toLowerCase())
  );

  // --- Loading State ---
  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'var(--surface)' }}>
        <div style={{ width: 48, height: 48, border: '4px solid var(--primary)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      </div>
    );
  }

  // --- Render ---
  return (
    <div className="dashboard-container">

      {/* ─── HEADER ─── */}
      <div className="hero-header" style={{ paddingBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 className="display-lg hero-header-gradient" style={{ margin: '8px 0' }}>Clinical Admin</h1>
            <p className="body-md" style={{ color: 'var(--on-surface-variant)', maxWidth: '500px' }}>
              Govern master formulary datasets, molecular linkages, and system analytics.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className={`btn-primary`} style={{ background: activeTab === 'table' ? '' : 'var(--surface-container-high)', color: activeTab === 'table' ? 'white' : 'var(--primary)', boxShadow: activeTab === 'table' ? '' : 'none' }} onClick={() => setActiveTab('table')}>
              <span className="material-symbols-outlined" style={{ fontSize: '18px', verticalAlign: 'middle', marginRight: '6px' }}>medication</span>
              Medicines
            </button>
            <button className={`btn-primary`} style={{ background: activeTab === 'actions' ? '' : 'var(--surface-container-high)', color: activeTab === 'actions' ? 'white' : 'var(--primary)', boxShadow: activeTab === 'actions' ? '' : 'none' }} onClick={() => setActiveTab('actions')}>
              <span className="material-symbols-outlined" style={{ fontSize: '18px', verticalAlign: 'middle', marginRight: '6px' }}>add_circle</span>
              Add / Upload
            </button>
          </div>
        </div>

        {status && (
          <div style={{ marginTop: '16px', padding: '12px 20px', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '8px',
            background: status.type === 'error' ? '#fdecea' : status.type === 'success' ? '#e8f5e9' : 'var(--surface-container-high)',
            color: status.type === 'error' ? '#c62828' : status.type === 'success' ? '#2e7d32' : 'var(--on-surface)',
            border: `1px solid ${status.type === 'error' ? '#ef9a9a' : status.type === 'success' ? '#a5d6a7' : 'var(--outline-variant)'}` }}>
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
              {status.type === 'error' ? 'error' : status.type === 'loading' ? 'speed' : 'check_circle'}
            </span>
            <span className="body-md" style={{ fontWeight: 600 }}>{status.message}</span>
          </div>
        )}
      </div>

      <div className="workspace-layer">
        
        {/* ─── METRICS ROW ─── */}
        {metrics && (
          <div className="bento-grid" style={{ marginBottom: '32px', gridTemplateColumns: 'repeat(4, 1fr)' }}>
            <div className="clinical-card" style={{ textAlign: 'center' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '32px', color: 'var(--primary)', marginBottom: '8px' }}>medication</span>
              <h2 className="display-lg" style={{ color: 'var(--on-surface)', margin: '4px 0' }}>{metrics.total_medicines}</h2>
              <div className="label-sm">Total Medicines</div>
            </div>
            <div className="clinical-card" style={{ textAlign: 'center' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '32px', color: 'var(--tertiary)', marginBottom: '8px' }}>trending_up</span>
              <h2 className="display-lg" style={{ color: 'var(--on-surface)', margin: '4px 0' }}>{metrics.added_this_week}</h2>
              <div className="label-sm">Added This Week</div>
            </div>
            <div className="clinical-card" style={{ textAlign: 'center' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '32px', color: '#e65100', marginBottom: '8px' }}>warning</span>
              <h2 className="display-lg" style={{ color: 'var(--on-surface)', margin: '4px 0' }}>{metrics.no_substitutes}</h2>
              <div className="label-sm">No Substitutes</div>
            </div>
            <div className="clinical-card" style={{ textAlign: 'center' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '32px', color: 'var(--primary)', marginBottom: '8px' }}>hub</span>
              <h2 className="display-lg" style={{ color: 'var(--on-surface)', margin: '4px 0' }}>{metrics.total_links}</h2>
              <div className="label-sm">Substitute Links</div>
            </div>
          </div>
        )}

        {/* ─── TAB: MEDICINES TABLE ─── */}
        {activeTab === 'table' && (
          <div className="clinical-card" style={{ padding: 0, overflow: 'hidden' }}>
            {/* Table Header Bar */}
            <div style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--outline-variant)' }}>
              <h3 className="title-md" style={{ margin: 0 }}>Medicines Master Registry</h3>
              <div className="ghost-input-container" style={{ margin: 0, maxWidth: '300px' }}>
                <input
                  type="text"
                  className="ghost-input"
                  placeholder="Filter by name, composition, manufacturer..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  style={{ padding: '8px 12px', fontSize: '0.8125rem' }}
                />
              </div>
            </div>

            {/* Table */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ background: 'var(--surface-container-low)', textAlign: 'left' }}>
                    <th style={{ padding: '12px 24px', fontWeight: 600, color: 'var(--on-surface-variant)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Name</th>
                    <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--on-surface-variant)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Composition</th>
                    <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--on-surface-variant)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Manufacturer</th>
                    <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--on-surface-variant)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Price</th>
                    <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--on-surface-variant)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Subs</th>
                    <th style={{ padding: '12px 24px', fontWeight: 600, color: 'var(--on-surface-variant)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMedicines.length === 0 ? (
                    <tr><td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: 'var(--on-surface-variant)' }}>No medicines match your filter.</td></tr>
                  ) : (
                    filteredMedicines.map((med, idx) => (
                      <tr key={med.id} style={{ borderBottom: '1px solid var(--outline-variant)', background: idx % 2 === 0 ? 'var(--surface)' : 'var(--surface-container-lowest, #fff)' }}>
                        <td style={{ padding: '14px 24px', fontWeight: 600, color: 'var(--on-surface)' }}>{med.name}</td>
                        <td style={{ padding: '14px 16px', color: 'var(--on-surface-variant)' }}>{med.composition}</td>
                        <td style={{ padding: '14px 16px', color: 'var(--on-surface-variant)' }}>{med.manufacturer}</td>
                        <td style={{ padding: '14px 16px', color: 'var(--on-surface)', fontWeight: 600 }}>${med.price}</td>
                        <td style={{ padding: '14px 16px' }}>
                          <span className="chip chip-action" style={{ cursor: 'pointer', padding: '4px 10px', fontSize: '0.75rem' }} onClick={() => openSubModal(med)}>
                            {med.substitute_count} links
                          </span>
                        </td>
                        <td style={{ padding: '14px 24px', textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                            <button onClick={() => openEditModal(med)} style={{ background: 'none', border: '1px solid var(--outline-variant)', borderRadius: 'var(--radius-sm)', padding: '6px 8px', cursor: 'pointer', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem' }}>
                              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>edit</span>Edit
                            </button>
                            <button onClick={() => handleDelete(med.id, med.name)} style={{ background: 'none', border: '1px solid #ef9a9a', borderRadius: 'var(--radius-sm)', padding: '6px 8px', cursor: 'pointer', color: '#c62828', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem' }}>
                              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>delete</span>Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ─── TAB: ADD / UPLOAD ─── */}
        {activeTab === 'actions' && (
          <div className="bento-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))' }}>
            
            {/* Single Entry */}
            <div className="clinical-card">
              <h3 className="title-md" style={{ marginBottom: '24px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '20px', verticalAlign: 'middle', marginRight: '8px', color: 'var(--primary)' }}>add_circle</span>
                Single Formulary Entry
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
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
                <button className="btn-primary" onClick={handleSingleSubmit} disabled={status?.type === 'loading'}>
                  Sync with Repository
                </button>
              </div>
            </div>

            {/* Bulk Upload */}
            <div className="clinical-card" style={{ backgroundColor: 'var(--secondary-container)', border: '1px solid var(--outline-variant)' }}>
              <h3 className="title-md" style={{ color: 'var(--on-secondary-container)', marginBottom: '8px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '20px', verticalAlign: 'middle', marginRight: '8px', color: 'var(--primary)' }}>cloud_upload</span>
                Bulk Molecular Sync
              </h3>
              <p className="body-sm" style={{ color: 'var(--on-secondary-container)', marginBottom: '24px' }}>
                Upload a CSV file. System auto-discovers and links pharmacological substitutes.
              </p>
              
              <label style={{
                display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
                height: '200px', border: '2px dashed var(--outline-variant)', borderRadius: 'var(--radius-lg)',
                backgroundColor: 'var(--surface)', cursor: 'pointer', transition: 'border-color 0.2s', padding: '24px', textAlign: 'center'
              }}
              onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
              onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--outline-variant)'}>
                <span className="material-symbols-outlined" style={{ fontSize: '48px', color: 'var(--primary)', marginBottom: '12px' }}>cloud_upload</span>
                <span className="title-md" style={{ color: 'var(--on-surface)', marginBottom: '4px' }}>{fileName ? 'File Selected' : 'Select CSV File'}</span>
                <span className="body-sm" style={{ color: 'var(--on-surface-variant)' }}>{fileName || 'name, composition, manufacturer, price'}</span>
                <input type="file" accept=".csv" style={{ display: 'none' }} onChange={handleFileChange} />
              </label>

              <button className="btn-primary" style={{ width: '100%', marginTop: '20px' }} onClick={handleBulkUpload} disabled={status?.type === 'loading' || !csvData.trim()}>
                Parse & Automate Linkages
              </button>

              {summary && (
                <div style={{ marginTop: '20px', padding: '16px', background: 'white', borderRadius: 'var(--radius-md)', border: '1px solid var(--outline-variant)' }}>
                  <div className="label-sm" style={{ marginBottom: '12px', fontWeight: 700 }}>Processing Summary</div>
                  <div style={{ display: 'flex', gap: '24px' }}>
                    <div><span className="label-sm">Total: </span><span className="title-md">{summary.total}</span></div>
                    <div><span className="label-sm">Synced: </span><span className="title-md" style={{ color: 'var(--primary)' }}>{summary.inserted}</span></div>
                    <div><span className="label-sm">Failed: </span><span className="title-md" style={{ color: '#c62828' }}>{summary.failed}</span></div>
                  </div>
                  {summary.errors?.length > 0 && (
                    <div style={{ marginTop: '12px', fontSize: '0.75rem', color: '#c62828', maxHeight: '80px', overflowY: 'auto' }}>
                      {summary.errors.map((err, i) => <div key={i}>{err.record}: {err.error}</div>)}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

      </div>

      {/* ─── EDIT MODAL ─── */}
      {editModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }} onClick={() => setEditModal(null)}>
          <div className="clinical-card" style={{ width: '480px', maxWidth: '90vw', position: 'relative' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 className="title-md">Edit Medicine</h3>
              <button onClick={() => setEditModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--on-surface-variant)' }}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="ghost-input-container">
                <label className="label-sm">Name</label>
                <input type="text" className="ghost-input" value={editForm.name} onChange={(e) => setEditForm({...editForm, name: e.target.value})} />
              </div>
              <div className="ghost-input-container">
                <label className="label-sm">Composition</label>
                <input type="text" className="ghost-input" value={editForm.composition} onChange={(e) => setEditForm({...editForm, composition: e.target.value})} />
              </div>
              <div className="ghost-input-container">
                <label className="label-sm">Manufacturer</label>
                <input type="text" className="ghost-input" value={editForm.manufacturer} onChange={(e) => setEditForm({...editForm, manufacturer: e.target.value})} />
              </div>
              <div className="ghost-input-container">
                <label className="label-sm">Price ($)</label>
                <input type="text" className="ghost-input" value={editForm.price} onChange={(e) => setEditForm({...editForm, price: e.target.value})} />
              </div>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button onClick={() => setEditModal(null)} className="btn-primary" style={{ background: 'var(--surface-container-high)', color: 'var(--primary)', boxShadow: 'none' }}>Cancel</button>
                <button onClick={handleEditSubmit} className="btn-primary">Save Changes</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── SUBSTITUTE MODAL ─── */}
      {subModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }} onClick={() => setSubModal(null)}>
          <div className="clinical-card" style={{ width: '520px', maxWidth: '90vw', maxHeight: '80vh', display: 'flex', flexDirection: 'column', position: 'relative' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 className="title-md">
                <span className="material-symbols-outlined" style={{ fontSize: '20px', verticalAlign: 'middle', marginRight: '8px', color: 'var(--primary)' }}>hub</span>
                Substitutes for {subModal.name}
              </h3>
              <button onClick={() => setSubModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--on-surface-variant)' }}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {subsLoading ? (
                <div style={{ padding: '40px', textAlign: 'center', color: 'var(--on-surface-variant)' }}>Loading...</div>
              ) : subs.length === 0 ? (
                <div style={{ padding: '40px', textAlign: 'center', color: 'var(--on-surface-variant)' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '48px', display: 'block', marginBottom: '12px', color: 'var(--outline-variant)' }}>link_off</span>
                  No substitute links found.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {subs.map(sub => (
                    <div key={sub.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'var(--surface-container-low)', borderRadius: 'var(--radius-md)', border: '1px solid var(--outline-variant)' }}>
                      <div>
                        <div className="body-md" style={{ fontWeight: 600, color: 'var(--on-surface)' }}>{sub.name}</div>
                        <div className="label-sm">{sub.manufacturer} · ${sub.price}</div>
                      </div>
                      <button onClick={() => handleRemoveSub(sub.id)} style={{ background: 'none', border: '1px solid #ef9a9a', borderRadius: 'var(--radius-sm)', padding: '6px 10px', cursor: 'pointer', color: '#c62828', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>link_off</span>Unlink
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default AdminPage;
