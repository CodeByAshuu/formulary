import React, { useState, useEffect } from 'react';
import {
  addMedicine, bulkUploadMedicines, getAdminMetrics,
  getAllMedicines, updateMedicine, deleteMedicine,
  getMedicineSubstitutes, removeSubstituteLink
} from '../api/medicine';

function AdminPage() {
  const [metrics, setMetrics]       = useState(null);
  const [medicines, setMedicines]   = useState([]);
  const [loading, setLoading]       = useState(true);
  const [status, setStatus]         = useState(null);
  const [formData, setFormData]     = useState({ name: '', composition: '', manufacturer: '', price: '' });
  const [csvData, setCsvData]       = useState('');
  const [fileName, setFileName]     = useState('');
  const [summary, setSummary]       = useState(null);
  const [editModal, setEditModal]   = useState(null);
  const [editForm, setEditForm]     = useState({ name: '', composition: '', manufacturer: '', price: '' });
  const [subModal, setSubModal]     = useState(null);
  const [subs, setSubs]             = useState([]);
  const [subsLoading, setSubsLoading] = useState(false);
  const [activeTab, setActiveTab]   = useState('table');
  const [searchFilter, setSearchFilter] = useState('');

  const fetchDashboard = async () => {
    try {
      const [m, all] = await Promise.all([getAdminMetrics(), getAllMedicines()]);
      setMetrics(m); setMedicines(all);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };
  useEffect(() => { (async () => { await fetchDashboard(); })(); }, []);


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
    } catch (err) { setStatus({ type: 'error', message: err.response?.data?.error || 'Failed.' }); clearStatus(); }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (ev) => setCsvData(ev.target.result);
      reader.readAsText(file);
    }
  };

  const handleBulkUpload = async () => {
    try {
      setStatus({ type: 'loading', message: 'Processing batch...' });
      const result = await bulkUploadMedicines(csvData);
      setSummary(result);
      setStatus({ type: 'success', message: `Batch complete. ${result.inserted} synced, ${result.failed} failed.` }); clearStatus();
      setCsvData(''); setFileName(''); fetchDashboard();
    } catch (err) { setStatus({ type: 'error', message: err.response?.data?.error || 'Bulk upload failed.' }); clearStatus(); }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Permanently delete "${name}"?`)) return;
    try {
      await deleteMedicine(id);
      setStatus({ type: 'success', message: `"${name}" deleted.` }); clearStatus(); fetchDashboard();
    } catch (err) { setStatus({ type: 'error', message: 'Delete failed.' }); clearStatus(); }
  };

  const openEditModal = (med) => {
    setEditForm({ name: med.name, composition: med.composition, manufacturer: med.manufacturer, price: med.price });
    setEditModal(med);
  };

  const handleEditSubmit = async () => {
    try {
      await updateMedicine(editModal.id, { ...editForm, price: parseFloat(editForm.price) });
      setStatus({ type: 'success', message: `"${editForm.name}" updated.` }); clearStatus();
      setEditModal(null); fetchDashboard();
    } catch (err) { setStatus({ type: 'error', message: 'Update failed.' }); clearStatus(); }
  };

  const openSubModal = async (med) => {
    setSubModal(med); setSubsLoading(true);
    try { const data = await getMedicineSubstitutes(med.id); setSubs(data); }
    catch { setSubs([]); }
    finally { setSubsLoading(false); }
  };

  const handleRemoveSub = async (subId) => {
    try {
      await removeSubstituteLink(subModal.id, subId);
      setSubs(subs.filter(s => s.id !== subId));
      setStatus({ type: 'success', message: 'Link removed.' }); clearStatus(); fetchDashboard();
    } catch { setStatus({ type: 'error', message: 'Failed to remove link.' }); clearStatus(); }
  };

  const filteredMedicines = medicines.filter(m =>
    m.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
    m.composition.toLowerCase().includes(searchFilter.toLowerCase()) ||
    m.manufacturer.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');

  :root {
    --primary: #084734;
    --accent: #CEF17B;
    --bg-soft: #CDEDB3;
    --bg-page: #f0f9ea;
    --text-main: #0c2e22;
    --text-muted: #3a6652;
    --border: rgba(8,71,52,0.12);
  }
    .hero-title {
      font-family: 'DM Serif Display', serif;
      font-size: clamp(2.8rem, 6vw, 4.2rem);
      color: #ffffff; line-height: 1.05;
      position: relative; z-index: 1; margin-bottom: 20px;
    }
    .hero-title em { font-style: italic; color: var(--accent); }
  `;

  // ── Shared input style ──
  const inputCls = `w-full bg-white border border-[rgba(8,71,52,0.2)] rounded-xl px-4 py-2.5 text-sm text-[#0c2e22]
    placeholder-[#3a6652]/50 outline-none focus:border-[#084734] focus:ring-2 focus:ring-[rgba(8,71,52,0.1)] transition-all`;

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#CDEDB3]">
      <div className="w-12 h-12 rounded-full border-4 border-[rgba(8,71,52,0.15)] border-t-[#084734] animate-spin" />
    </div>
  );

  return (
    <>
    <style>{styles}</style>

    <div className="min-h-screen bg-[#CDEDB3]">

      {/* ── Hero Header ── */}
      <div className="relative bg-[#084734] px-8 pt-8 pb-14 overflow-hidden">
        <div className="absolute -top-28 -right-16 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(206,241,123,0.13) 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 left-0 right-0 h-12 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, transparent, #CDEDB3)' }} />

        <div className="relative z-10 flex flex-wrap items-start justify-between gap-4 mb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 mb-6 px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-widest text-[#CEF17B] border border-[rgba(206,241,123,0.35)] bg-[rgba(206,241,123,0.15)]">
              {/* <span className="material-symbols-outlined" style={{ fontSize: 12 }}>admin_panel_settings</span> */}
              Administrator
            </div>
            <h1 className="hero-title">Clini<em className="font-light text-[#CEF17B]">cal</em> Admin</h1>
            <p className="text-sm text-[rgba(205,237,179,0.75)] font-light max-w-md">
              Govern master formulary datasets, molecular linkages, and system analytics.
            </p>
          </div>

          {/* Tab switcher */}
          <div className="flex gap-2 relative z-10">
            {[
              { id: 'table',   icon: 'medication',   label: 'Medicines' },
              { id: 'actions', icon: 'add_circle',    label: 'Add / Upload' },
            ].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-widest transition-all
                  ${activeTab === tab.id
                    ? 'bg-[#CEF17B] text-[#084734]'
                    : 'bg-white/10 text-[rgba(205,237,179,0.75)] hover:bg-white/20 border border-[rgba(206,241,123,0.2)]'}`}>
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Status banner */}
        {status && (
          <div className={`relative z-10 mt-3 flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold border
            ${status.type === 'error'   ? 'bg-red-50 text-red-700 border-red-200' :
              status.type === 'success' ? 'bg-[#e8f5e9] text-[#2e7d32] border-[#a5d6a7]' :
                                          'bg-white/10 text-white border-white/20'}`}>
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
              {status.type === 'error' ? 'error' : status.type === 'loading' ? 'speed' : 'check_circle'}
            </span>
            {status.message}
          </div>
        )}
      </div>

      {/* ── Main ── */}
      <div className="max-w-8xl mx-auto px-8 pb-16">

        {/* Metrics */}
        {metrics && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { icon: 'medication',   color: '#084734', label: 'Total Medicines',  value: metrics.total_medicines },
              { icon: 'trending_up',  color: '#0a5c44', label: 'Added This Week',  value: metrics.added_this_week },
              { icon: 'warning',      color: '#b45309', label: 'No Substitutes',   value: metrics.no_substitutes },
              { icon: 'hub',          color: '#084734', label: 'Substitute Links', value: metrics.total_links },
            ].map(({ icon, color, label, value }) => (
              <div key={label} className="bg-white border border-[rgba(8,71,52,0.1)] rounded-2xl p-6 text-center shadow-sm">
                <span className="material-symbols-outlined" style={{ fontSize: 32, color, marginBottom: 8, display: 'block' }}>{icon}</span>
                <div className="font-serif text-3xl text-[#084734] my-1">{value}</div>
                <div className="text-[10px] font-semibold uppercase tracking-widest text-[#3a6652]">{label}</div>
              </div>
            ))}
          </div>
        )}

        {/* ── TAB: Table ── */}
        {activeTab === 'table' && (
          <div className="bg-white border border-[rgba(8,71,52,0.1)] rounded-2xl overflow-hidden shadow-sm">
            {/* Table top bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-b border-[rgba(8,71,52,0.08)]">
              <h3 className="font-serif text-lg text-[#084734]">Medicines Master Registry</h3>
              <input
                type="text"
                placeholder="Filter by name, composition, manufacturer..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className={`${inputCls} max-w-xs`}
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#CDEDB3]/40 text-left">
                    {['Name', 'Composition', 'Manufacturer', 'Price', 'Subs', 'Actions'].map((h, i) => (
                      <th key={h} className={`px-6 py-3 text-[10px] font-semibold uppercase tracking-widest text-[#3a6652] ${i === 5 ? 'text-right' : ''}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredMedicines.length === 0 ? (
                    <tr><td colSpan={6} className="py-12 text-center text-[#3a6652] text-sm">No medicines match your filter.</td></tr>
                  ) : filteredMedicines.map((med, idx) => (
                    <tr key={med.id} className={`border-t border-[rgba(8,71,52,0.06)] hover:bg-[#CDEDB3]/20 transition-colors ${idx % 2 === 1 ? 'bg-[#f7fbf4]' : ''}`}>
                      <td className="px-6 py-3.5 font-semibold text-[#084734]">{med.name}</td>
                      <td className="px-6 py-3.5 text-[#3a6652]">{med.composition}</td>
                      <td className="px-6 py-3.5 text-[#3a6652]">{med.manufacturer}</td>
                      <td className="px-6 py-3.5 font-semibold text-[#084734]">${med.price}</td>
                      <td className="px-6 py-3.5">
                        <button onClick={() => openSubModal(med)}
                          className="px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wide bg-[rgba(8,71,52,0.08)] text-[#084734] hover:bg-[#CEF17B] transition-colors">
                          {med.substitute_count} links
                        </button>
                      </td>
                      <td className="px-6 py-3.5">
                        <div className="flex gap-2 justify-end">
                          <button onClick={() => openEditModal(med)}
                            className="flex items-center gap-1 px-3 py-1.5 text-[11px] font-medium rounded-lg border border-[rgba(8,71,52,0.2)] text-[#084734] hover:bg-[#CDEDB3] transition-colors">
                            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>edit</span>Edit
                          </button>
                          <button onClick={() => handleDelete(med.id, med.name)}
                            className="flex items-center gap-1 px-3 py-1.5 text-[11px] font-medium rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors">
                            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>delete</span>Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── TAB: Add / Upload ── */}
        {activeTab === 'actions' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Single Entry */}
            <div className="bg-white border border-[rgba(8,71,52,0.1)] rounded-2xl p-7 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-9 h-9 rounded-xl bg-[#CDEDB3] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#084734]" style={{ fontSize: 20 }}>add_circle</span>
                </div>
                <h3 className="font-serif text-lg text-[#084734]">Single Formulary Entry</h3>
              </div>
              <div className="flex flex-col gap-4">
                {[
                  { label: 'Medicine Name',      key: 'name',         placeholder: 'e.g., Crocin 500' },
                  { label: 'Active Composition',  key: 'composition',  placeholder: 'e.g., Paracetamol' },
                  { label: 'Manufacturer',        key: 'manufacturer', placeholder: 'e.g., GSK' },
                  { label: 'Retail Price ($)',    key: 'price',        placeholder: '0.00' },
                ].map(({ label, key, placeholder }) => (
                  <div key={key}>
                    <label className="block text-[10px] font-semibold uppercase tracking-widest text-[#3a6652] mb-1.5">{label}</label>
                    <input type="text" placeholder={placeholder} value={formData[key]}
                      onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                      className={inputCls} />
                  </div>
                ))}
                <button onClick={handleSingleSubmit} disabled={status?.type === 'loading'}
                  className="mt-2 w-full bg-[#084734] text-[#CEF17B] text-xs font-semibold uppercase tracking-widest py-3 rounded-xl hover:bg-[#0a5c44] disabled:opacity-50 transition-colors">
                  Sync with Repository
                </button>
              </div>
            </div>

            {/* Bulk Upload */}
            <div className="bg-[#f0fbe8] border border-[rgba(8,71,52,0.12)] rounded-2xl p-7 shadow-sm flex flex-col gap-5">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-[#CDEDB3] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#084734]" style={{ fontSize: 20 }}>cloud_upload</span>
                </div>
                <h3 className="font-serif text-lg text-[#084734]">Bulk Molecular Sync</h3>
              </div>
              <p className="text-xs text-[#3a6652] -mt-2 leading-relaxed">
                Upload a CSV file. System auto-discovers and links pharmacological substitutes.
              </p>

              <label className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-[rgba(8,71,52,0.2)] rounded-2xl bg-white cursor-pointer hover:border-[#084734] hover:bg-[#CDEDB3]/20 transition-all text-center px-6">
                <span className="material-symbols-outlined text-[#084734] mb-2" style={{ fontSize: 40 }}>cloud_upload</span>
                <span className="text-sm font-semibold text-[#084734]">{fileName ? 'File Selected' : 'Select CSV File'}</span>
                <span className="text-xs text-[#3a6652] mt-1">{fileName || 'name, composition, manufacturer, price'}</span>
                <input type="file" accept=".csv" className="hidden" onChange={handleFileChange} />
              </label>

              <button onClick={handleBulkUpload} disabled={status?.type === 'loading' || !csvData.trim()}
                className="w-full bg-[#084734] text-[#CEF17B] text-xs font-semibold uppercase tracking-widest py-3 rounded-xl hover:bg-[#0a5c44] disabled:opacity-40 transition-colors">
                Parse & Automate Linkages
              </button>

              {summary && (
                <div className="bg-white border border-[rgba(8,71,52,0.1)] rounded-xl p-4">
                  <div className="text-[10px] font-semibold uppercase tracking-widest text-[#3a6652] mb-3">Processing Summary</div>
                  <div className="flex gap-6">
                    {[
                      { label: 'Total',  value: summary.total,    color: '#084734' },
                      { label: 'Synced', value: summary.inserted, color: '#084734' },
                      { label: 'Failed', value: summary.failed,   color: '#dc2626' },
                    ].map(({ label, value, color }) => (
                      <div key={label}>
                        <div className="text-[10px] text-[#3a6652] uppercase tracking-wide">{label}</div>
                        <div className="font-serif text-2xl" style={{ color }}>{value}</div>
                      </div>
                    ))}
                  </div>
                  {summary.errors?.length > 0 && (
                    <div className="mt-3 text-xs text-red-600 max-h-20 overflow-y-auto">
                      {summary.errors.map((err, i) => <div key={i}>{err.record}: {err.error}</div>)}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── Edit Modal ── */}
      {editModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4" onClick={() => setEditModal(null)}>
          <div className="bg-white rounded-2xl p-7 w-full max-w-md shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-serif text-lg text-[#084734]">Edit Medicine</h3>
              <button onClick={() => setEditModal(null)} className="text-[#3a6652] hover:text-[#084734] transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="flex flex-col gap-4">
              {['name', 'composition', 'manufacturer', 'price'].map((key) => (
                <div key={key}>
                  <label className="block text-[10px] font-semibold tracking-widest text-[#3a6652] mb-1.5 capitalize">{key}</label>
                  <input type="text" value={editForm[key]}
                    onChange={(e) => setEditForm({ ...editForm, [key]: e.target.value })}
                    className={inputCls} />
                </div>
              ))}
              <div className="flex gap-3 justify-end mt-2">
                <button onClick={() => setEditModal(null)}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-widest border border-[rgba(8,71,52,0.2)] text-[#084734] hover:bg-[#CDEDB3] transition-colors">
                  Cancel
                </button>
                <button onClick={handleEditSubmit}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-widest bg-[#084734] text-[#CEF17B] hover:bg-[#0a5c44] transition-colors">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Substitute Modal ── */}
      {subModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4" onClick={() => setSubModal(null)}>
          <div className="bg-white rounded-2xl p-7 w-full max-w-lg max-h-[80vh] flex flex-col shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#084734]" style={{ fontSize: 20 }}>hub</span>
                <h3 className="font-serif text-lg text-[#084734]">Substitutes for {subModal.name}</h3>
              </div>
              <button onClick={() => setSubModal(null)} className="text-[#3a6652] hover:text-[#084734] transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {subsLoading ? (
                <div className="py-12 text-center text-[#3a6652] text-sm">Loading...</div>
              ) : subs.length === 0 ? (
                <div className="py-12 text-center">
                  <span className="material-symbols-outlined text-[#CDEDB3] block mb-3" style={{ fontSize: 48 }}>link_off</span>
                  <p className="text-sm text-[#3a6652]">No substitute links found.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {subs.map(sub => (
                    <div key={sub.id} className="flex items-center justify-between px-4 py-3 bg-[#f7fbf4] border border-[rgba(8,71,52,0.08)] rounded-xl">
                      <div>
                        <div className="text-sm font-semibold text-[#084734]">{sub.name}</div>
                        <div className="text-[11px] text-[#3a6652]">{sub.manufacturer} · ${sub.price}</div>
                      </div>
                      <button onClick={() => handleRemoveSub(sub.id)}
                        className="flex items-center gap-1 px-3 py-1.5 text-[11px] font-medium rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors">
                        <span className="material-symbols-outlined" style={{ fontSize: 14 }}>link_off</span>Unlink
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
    </>
  );
}

export default AdminPage;