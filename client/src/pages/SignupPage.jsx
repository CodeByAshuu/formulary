// client/src/pages/SignupPage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center relative font-body text-on-surface selection:bg-primary-fixed">
      {/* Animated Mesh Gradient Background */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-30%] left-[-10%] w-[70vw] h-[70vw] rounded-full bg-primary-fixed/20 blur-[100px] animate-pulse" style={{ animationDuration: '8s' }}></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-secondary-fixed/20 blur-[120px] animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }}></div>
      </div>

      <div className="w-full max-w-5xl bg-surface-container-lowest/70 backdrop-blur-2xl rounded-[2rem] shadow-[0_40px_80px_-20px_rgba(11,28,48,0.08)] border border-white/60 relative z-10 flex flex-col md:flex-row transition-all duration-700 hover:shadow-[0_50px_100px_-20px_rgba(11,28,48,0.12)]">
        
        {/* Left Side: Information / Branding */}
        <div className="w-full md:w-5/12 bg-primary p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/noise-pattern-with-subtle-cross-lines.png')] mix-blend-overlay opacity-20 pointer-events-none"></div>
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10">
            <Link to="/" className="inline-flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/30 transition-colors border border-white/20">
                <span className="material-symbols-outlined text-white text-lg font-light">clinical_notes</span>
              </div>
              <span className="font-display font-bold text-lg tracking-widest uppercase text-white/90">Formulary</span>
            </Link>

            <div className="mt-12 space-y-4">
              <h2 className="font-display text-3xl font-bold leading-tight">Join the Elite Medical Network.</h2>
              <p className="text-primary-fixed-dim text-base leading-relaxed font-medium">
                Streamline prescriptions, optimize workflows, and deliver unmatched care.
              </p>
            </div>
          </div>

          <div className="relative z-10 mt-12 space-y-3 hidden sm:block">
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-3.5 rounded-xl border border-white/10">
              <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-lg">security</span>
              </div>
              <div>
                <div className="font-bold text-xs">Enterprise Security</div>
                <div className="text-[10px] text-primary-fixed-dim">HIPAA Compliant</div>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-3.5 rounded-xl border border-white/10">
              <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-lg">speed</span>
              </div>
              <div>
                <div className="font-bold text-xs">Lightning Fast</div>
                <div className="text-[10px] text-primary-fixed-dim">99.9% Uptime</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full md:w-7/12 p-6 sm:p-10 lg:p-12 flex flex-col justify-center">
          <div className="mb-6 text-center sm:text-left">
            <h3 className="font-display text-2xl font-bold mb-1 text-on-surface">Create Account</h3>
            <p className="text-on-surface-variant text-[11px] font-medium tracking-wide">Establish your clinical credentials below.</p>
          </div>

          <form className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <div className="space-y-1.5 relative group">
                <label className="text-[0.6rem] uppercase tracking-widest font-bold text-on-surface-variant ml-1" htmlFor="firstName">First Name</label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-4 text-outline group-focus-within:text-primary transition-colors text-lg font-light">person</span>
                  <input 
                    type="text" 
                    id="firstName" 
                    className="w-full pl-11 pr-4 py-3.5 bg-surface-container-low border border-transparent rounded-xl focus:bg-white focus:border-primary/30 focus:ring-4 focus:ring-primary/10 transition-all duration-300 outline-none text-sm font-medium"
                    placeholder="Julian"
                  />
                </div>
              </div>
               <div className="space-y-1.5 relative group">
                <label className="text-[0.6rem] uppercase tracking-widest font-bold text-on-surface-variant ml-1" htmlFor="lastName">Last Name</label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-4 text-outline group-focus-within:text-primary transition-colors text-lg font-light">person</span>
                  <input 
                    type="text" 
                    id="lastName" 
                    className="w-full pl-11 pr-4 py-3.5 bg-surface-container-low border border-transparent rounded-xl focus:bg-white focus:border-primary/30 focus:ring-4 focus:ring-primary/10 transition-all duration-300 outline-none text-sm font-medium"
                    placeholder="Vane"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5 relative group">
              <label className="text-[0.6rem] uppercase tracking-widest font-bold text-on-surface-variant ml-1" htmlFor="email">Email</label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-4 text-outline group-focus-within:text-primary transition-colors text-lg font-light">mail</span>
                <input 
                  type="email" 
                  id="email" 
                  className="w-full pl-11 pr-4 py-3.5 bg-surface-container-low border border-transparent rounded-xl focus:bg-white focus:border-primary/30 focus:ring-4 focus:ring-primary/10 transition-all duration-300 outline-none text-sm font-medium"
                  placeholder="dr.vane@hospital.org"
                />
              </div>
            </div>

            <div className="space-y-1.5 relative group">
              <label className="text-[0.6rem] uppercase tracking-widest font-bold text-on-surface-variant ml-1" htmlFor="password">Secure Password</label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-4 text-outline group-focus-within:text-primary transition-colors text-lg font-light">lock</span>
                <input 
                   type={showPassword ? "text" : "password"}
                  id="password" 
                  className="w-full pl-11 pr-11 py-3.5 bg-surface-container-low border border-transparent rounded-xl focus:bg-white focus:border-primary/30 focus:ring-4 focus:ring-primary/10 transition-all duration-300 outline-none text-sm font-medium"
                  placeholder="••••••••••••"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 text-outline hover:text-primary transition-colors focus:outline-none"
                >
                  <span className="material-symbols-outlined text-lg">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

             <div className="flex items-start gap-3 mt-2">
              <div className="flex items-center h-5">
                 <input id="terms" type="checkbox" className="w-4 h-4 border border-outline-variant rounded bg-surface-container-low text-primary focus:ring-primary focus:ring-2 transition-all cursor-pointer accent-primary" />
              </div>
              <label htmlFor="terms" className="text-[10px] text-on-surface-variant font-medium leading-normal cursor-pointer">
                I agree to the <Link to="#" className="text-primary font-bold hover:underline">Terms</Link> and <Link to="#" className="text-primary font-bold hover:underline">Privacy Policy</Link>.
              </label>
            </div>

            <div className="pt-2">
               <button 
                type="submit" 
                className="w-full py-3.5 bg-primary text-white rounded-xl font-bold tracking-wide flex items-center justify-center gap-2 overflow-hidden shadow-[0_10px_20px_-10px_rgba(0,81,63,0.4)] hover:shadow-[0_15px_25px_-10px_rgba(0,81,63,0.5)] hover:bg-primary-container transition-all hover:-translate-y-0.5 active:translate-y-0 text-sm"
              >
                Create Account
              </button>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-outline-variant/20 text-center text-[11px] font-medium text-on-surface-variant">
            Already verified?{' '}
            <Link to="/signin" className="text-primary font-bold hover:underline decoration-2 underline-offset-4 transition-all">Sign in here</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
