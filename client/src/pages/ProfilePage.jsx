import React, { useState, useEffect } from 'react';
import { getProfile, updateProfile } from '../api/auth';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
  const { user, logout, refreshUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ firstName: '', lastName: '' });
  const [updateLoading, setUpdateLoading] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setFormData({ firstName: user.first_name || '', lastName: user.last_name || '' });
    }
  }, [user]);

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
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface font-body text-on-surface p-6 sm:p-12 relative overflow-hidden">
      {/* Background Blobs */}
       <div className="absolute top-[-10%] left-[-10%] w-150 h-150 bg-primary-fixed/20 rounded-full blur-[120px] pointer-events-none"></div>
       <div className="absolute bottom-[-10%] right-[-10%] w-150 h-150 bg-secondary-fixed/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto relative z-10 space-y-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary-container flex items-center justify-center shadow-2xl border-4 border-white">
              <span className="font-display text-4xl text-white font-bold">{user.first_name?.[0]}{user.last_name?.[0]}</span>
            </div>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">{user.first_name} {user.last_name}</h1>
              <p className="text-on-surface-variant font-medium text-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">verified_user</span>
                Verified Clinical Professional
              </p>
            </div>
          </div>
          <button 
            onClick={logout}
            className="px-6 py-2.5 bg-surface-container-high text-on-surface font-medium rounded-full hover:bg-red-50 hover:text-red-600 border border-outline-variant/30 transition-all flex items-center gap-2 group"
          >
            <span className="material-symbols-outlined text-lg group-hover:rotate-180 transition-transform duration-500">logout</span>
            Sign Out
          </button>
        </div>

        {msg.text && (
          <div className={`p-4 rounded-2xl text-xs font-bold uppercase tracking-widest flex items-center gap-3 ${msg.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
            <span className="material-symbols-outlined text-lg">{msg.type === 'success' ? 'check_circle' : 'error'}</span>
            {msg.text}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Account Details */}
          <div className="md:col-span-2 bg-white/70 backdrop-blur-xl border border-white/40 p-8 rounded-[2.5rem] shadow-sm space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Clinical Credentials</h3>
              {!isEditing && (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="text-primary text-xs font-bold uppercase tracking-widest hover:underline"
                >
                  Edit Info
                </button>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleUpdate} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[0.65rem] uppercase tracking-widest font-medium text-outline ml-1">First Name</label>
                    <input 
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-surface-container-low border border-transparent rounded-xl focus:bg-white focus:border-primary/30 outline-none transition-all text-sm font-medium"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[0.65rem] uppercase tracking-widest font-medium text-outline ml-1">Last Name</label>
                    <input 
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-surface-container-low border border-transparent rounded-xl focus:bg-white focus:border-primary/30 outline-none transition-all text-sm font-medium"
                      required
                    />
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <button 
                    type="submit"
                    disabled={updateLoading}
                    className="px-8 py-3 bg-primary text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg hover:shadow-primary/20 transition-all disabled:opacity-50"
                  >
                    {updateLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button 
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({ firstName: user.first_name, lastName: user.last_name });
                    }}
                    className="px-8 py-3 bg-surface-container-high text-on-surface rounded-xl font-bold text-xs uppercase tracking-widest transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-1">
                  <span className="text-[0.65rem] uppercase tracking-widest font-medium text-outline">First Name</span>
                  <p className="font-medium text-on-surface">{user.first_name}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[0.65rem] uppercase tracking-widest font-medium text-outline">Last Name</span>
                  <p className="font-medium text-on-surface">{user.last_name}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[0.65rem] uppercase tracking-widest font-medium text-outline">Clinical Email</span>
                  <p className="font-medium text-on-surface">{user.email}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[0.65rem] uppercase tracking-widest font-medium text-outline">Member Since</span>
                  <p className="font-medium text-on-surface">{new Date(user.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long' })}</p>
                </div>
              </div>
            )}
          </div>

          {/* Card 2: Status / Stats */}
          <div className="bg-primary/95 text-white p-8 rounded-[2.5rem] shadow-xl space-y-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-20 transform group-hover:scale-125 transition-transform duration-700">
               <span className="material-symbols-outlined text-8xl">clinical_notes</span>
            </div>
            
            <div className="relative z-10 space-y-6">
               <div className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest inline-block border border-white/20">
                Active Session
               </div>
               <div className="space-y-2">
                 <h4 className="text-3xl font-display font-bold">10,240</h4>
                 <p className="text-primary-fixed-dim text-xs font-medium">Points Earned</p>
               </div>
               <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-primary-fixed w-[70%] h-full"></div>
               </div>
               <p className="text-[10px] font-medium text-primary-fixed-dim leading-relaxed">
                 You are in the top 5% of medical researchers this month. Keep it up!
               </p>
            </div>
          </div>
        </div>

        <div className="bg-surface-container-low/50 border border-outline-variant/10 p-8 rounded-[2.5rem] space-y-6">
           <h3 className="text-lg font-semibold flex items-center gap-3">
             <span className="material-symbols-outlined text-primary">security</span>
             Security & Access
           </h3>
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <button className="flex items-center gap-4 p-4 bg-white rounded-2xl hover:bg-primary/5 transition-all text-left">
                 <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center">
                    <span className="material-symbols-outlined text-xl">lock_reset</span>
                 </div>
                 <div>
                   <div className="text-xs font-semibold">Change Security Key</div>
                   <div className="text-[10px] text-outline mt-0.5">Update your password</div>
                 </div>
              </button>
              <button className="flex items-center gap-4 p-4 bg-white rounded-2xl hover:bg-primary/5 transition-all text-left">
                 <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center">
                    <span className="material-symbols-outlined text-xl">fingerprint</span>
                 </div>
                 <div>
                   <div className="text-xs font-semibold">Biometric Access</div>
                   <div className="text-[10px] text-outline mt-0.5">Enable Face or Touch ID</div>
                 </div>
              </button>
              <button className="flex items-center gap-4 p-4 bg-white rounded-2xl hover:bg-primary/5 transition-all text-left">
                 <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center">
                    <span className="material-symbols-outlined text-xl">devices</span>
                 </div>
                 <div>
                   <div className="text-xs font-semibold">Active Stations</div>
                   <div className="text-[10px] text-outline mt-0.5">Manage 2 authorized devices</div>
                 </div>
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
