import React, { useState } from 'react';
import { getProfile, updateProfile } from '../api/auth';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

const ProfilePage = () => {
  const { user, logout, refreshUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  // Initialise directly from user — the !user guard below ensures user is
  // always defined by the time this hook result is consumed, so no effect needed.
  const [formData, setFormData] = useState({
    firstName: user?.first_name || '',
    lastName:  user?.last_name  || '',
  });
  const [updateLoading, setUpdateLoading] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });
  const navigate = useNavigate();


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    setMsg({ type: '', text: '' });
    try {
      await updateProfile(formData);
      await refreshUser();
      setMsg({ type: 'success', text: 'Profile updated successfully!' });
      setIsEditing(false);
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.error || 'Failed to update profile.' });
    } finally {
      setUpdateLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#CDEDB3' }}>
        <div className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#084734', borderTopColor: 'transparent' }}></div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen font-body p-6 sm:p-12 relative overflow-hidden"
      style={{ backgroundColor: '#CDEDB3', color: '#084734' }}
    >
      {/* Subtle background blobs using brand palette */}
      <div
        className="absolute top-[-10%] left-[-10%] w-160 h-160 rounded-full pointer-events-none"
        style={{ backgroundColor: 'rgba(8,71,52,0.07)', filter: 'blur(100px)' }}
      ></div>
      <div
        className="absolute bottom-[-10%] right-[-10%] w-160 h-160 rounded-full pointer-events-none"
        style={{ backgroundColor: 'rgba(206,241,123,0.35)', filter: 'blur(100px)' }}
      ></div>

      <div className="max-w-4xl mx-auto relative z-10 space-y-8">

        {/* ── Header ── */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            {/* Avatar */}
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center shadow-lg border-4"
              style={{ background: 'linear-gradient(135deg, #084734 0%, #0d6648 100%)', borderColor: '#CEF17B' }}
            >
              <span className="text-4xl font-bold" style={{ color: '#CEF17B', fontFamily: 'serif' }}>
                {user.first_name?.[0]}{user.last_name?.[0]}
              </span>
            </div>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight" style={{ color: '#084734' }}>
                {user.first_name} {user.last_name}
              </h1>
              <p className="font-medium text-sm flex items-center gap-2 mt-1" style={{ color: '#2a6645' }}>
                <span className="material-symbols-outlined text-sm">verified_user</span>
                Verified Clinical Professional
              </p>
            </div>
          </div>

          <button
            onClick={logout}
            className="px-6 py-2.5 font-medium rounded-full transition-all flex items-center gap-2 group border"
            style={{
              backgroundColor: 'rgba(255,255,255,0.5)',
              borderColor: 'rgba(8,71,52,0.25)',
              color: '#084734',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = '#084734';
              e.currentTarget.style.color = '#CEF17B';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.5)';
              e.currentTarget.style.color = '#084734';
            }}
          >
            <span className="material-symbols-outlined text-lg transition-transform duration-500 group-hover:rotate-180">logout</span>
            Sign Out
          </button>
        </div>

        {/* ── Alert message ── */}
        {msg.text && (
          <div
            className="p-4 rounded-2xl text-xs font-bold uppercase tracking-widest flex items-center gap-3 border"
            style={
              msg.type === 'success'
                ? { backgroundColor: '#e8fcd4', color: '#084734', borderColor: '#CEF17B' }
                : { backgroundColor: '#fde8e8', color: '#9b1c1c', borderColor: '#fca5a5' }
            }
          >
            <span className="material-symbols-outlined text-lg">
              {msg.type === 'success' ? 'check_circle' : 'error'}
            </span>
            {msg.text}
          </div>
        )}

        {/* ── Main grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Card 1 — Clinical Credentials */}
          <div
            className="md:col-span-2 p-8 rounded-[2.5rem] space-y-8 border"
            style={{
              backgroundColor: 'rgba(255,255,255,0.65)',
              backdropFilter: 'blur(16px)',
              borderColor: 'rgba(255,255,255,0.5)',
            }}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold" style={{ color: '#084734' }}>Clinical Credentials</h3>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-xs font-bold uppercase tracking-widest hover:underline"
                  style={{ color: '#084734' }}
                >
                  Edit Info
                </button>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleUpdate} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {['firstName', 'lastName'].map((field, i) => (
                    <div className="space-y-1.5" key={field}>
                      <label className="text-[0.65rem] uppercase tracking-widest font-medium ml-1" style={{ color: '#2a6645' }}>
                        {i === 0 ? 'First Name' : 'Last Name'}
                      </label>
                      <input
                        type="text"
                        name={field}
                        value={formData[field]}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl outline-none transition-all text-sm font-medium border"
                        style={{
                          backgroundColor: 'rgba(205,237,179,0.4)',
                          borderColor: 'rgba(8,71,52,0.15)',
                          color: '#084734',
                        }}
                        onFocus={e => {
                          e.target.style.backgroundColor = '#fff';
                          e.target.style.borderColor = 'rgba(8,71,52,0.4)';
                        }}
                        onBlur={e => {
                          e.target.style.backgroundColor = 'rgba(205,237,179,0.4)';
                          e.target.style.borderColor = 'rgba(8,71,52,0.15)';
                        }}
                        required
                      />
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-4">
                  <button
                    type="submit"
                    disabled={updateLoading}
                    className="px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all disabled:opacity-50"
                    style={{ backgroundColor: '#084734', color: '#CEF17B' }}
                  >
                    {updateLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({ firstName: user.first_name, lastName: user.last_name });
                    }}
                    className="px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all border"
                    style={{
                      backgroundColor: 'rgba(205,237,179,0.4)',
                      borderColor: 'rgba(8,71,52,0.2)',
                      color: '#084734',
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {[
                  { label: 'First Name', value: user.first_name },
                  { label: 'Last Name', value: user.last_name },
                  { label: 'Clinical Email', value: user.email },
                  {
                    label: 'Member Since',
                    value: new Date(user.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long' }),
                  },
                ].map(({ label, value }) => (
                  <div className="space-y-1" key={label}>
                    <span className="text-[0.65rem] uppercase tracking-widest font-medium" style={{ color: '#2a6645' }}>
                      {label}
                    </span>
                    <p className="font-medium" style={{ color: '#084734' }}>{value}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Card 2 — Stats */}
          <div
            className="p-8 rounded-[2.5rem] shadow-xl space-y-8 relative overflow-hidden group"
            style={{ backgroundColor: '#084734' }}
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 transform group-hover:scale-125 transition-transform duration-700">
              <span className="material-symbols-outlined text-8xl" style={{ color: '#CEF17B' }}>clinical_notes</span>
            </div>

            <div className="relative z-10 space-y-6">
              <div
                className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest inline-block border"
                style={{ backgroundColor: 'rgba(206,241,123,0.15)', borderColor: 'rgba(206,241,123,0.3)', color: '#CEF17B' }}
              >
                Active Session
              </div>
              <div className="space-y-2">
                <h4 className="text-3xl font-bold" style={{ color: '#CEF17B' }}>10,240</h4>
                <p className="text-xs font-medium" style={{ color: 'rgba(205,237,179,0.7)' }}>Points Earned</p>
              </div>
              {/* Progress bar */}
              <div className="w-full rounded-full h-1.5 overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}>
                <div className="h-full rounded-full w-[70%]" style={{ backgroundColor: '#CEF17B' }}></div>
              </div>
              <p className="text-[10px] font-medium leading-relaxed" style={{ color: 'rgba(205,237,179,0.6)' }}>
                You are in the top 5% of medical researchers this month. Keep it up!
              </p>
            </div>
          </div>
        </div>

        {/* ── Security & Access ── */}
        <div
          className="p-8 rounded-[2.5rem] space-y-6 border"
          style={{
            backgroundColor: 'rgba(255,255,255,0.45)',
            borderColor: 'rgba(8,71,52,0.1)',
          }}
        >
          <h3 className="text-lg font-semibold flex items-center gap-3" style={{ color: '#084734' }}>
            <span className="material-symbols-outlined" style={{ color: '#084734' }}>security</span>
            Security &amp; Access
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: 'lock_reset', title: 'Change Security Key', sub: 'Update your password' },
              { icon: 'fingerprint', title: 'Biometric Access', sub: 'Enable Face or Touch ID' },
              { icon: 'devices', title: 'Active Stations', sub: 'Manage 2 authorized devices' },
            ].map(({ icon, title, sub }) => (
              <button
                key={title}
                className="flex items-center gap-4 p-4 rounded-2xl transition-all text-left border"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.7)',
                  borderColor: 'rgba(8,71,52,0.08)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.backgroundColor = '#CEF17B';
                  e.currentTarget.style.borderColor = '#084734';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.7)';
                  e.currentTarget.style.borderColor = 'rgba(8,71,52,0.08)';
                }}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(205,237,179,0.6)' }}
                >
                  <span className="material-symbols-outlined text-xl" style={{ color: '#084734' }}>{icon}</span>
                </div>
                <div>
                  <div className="text-xs font-semibold" style={{ color: '#084734' }}>{title}</div>
                  <div className="text-[10px] mt-0.5" style={{ color: '#2a6645' }}>{sub}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProfilePage;