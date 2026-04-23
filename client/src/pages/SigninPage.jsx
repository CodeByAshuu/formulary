// client/src/pages/SigninPage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const SigninPage = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="h-screen bg-surface flex relative font-body text-on-surface overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-primary-fixed/30 rounded-full mix-blend-multiply filter blur-[150px] opacity-70 animate-pulse" style={{ animationDuration: '7s' }}></div>
      <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-secondary-fixed/30 rounded-full mix-blend-multiply filter blur-[150px] opacity-70 animate-pulse" style={{ animationDuration: '10s', animationDelay: '1s' }}></div>

      {/* Left Column: Visual/Brand */}
      <div className="hidden lg:flex w-1/2 relative flex-col justify-between px-12 py-10 z-10">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-linear-to-br from-primary to-primary-container flex items-center justify-center shadow-lg">
            <span className="material-symbols-outlined text-white text-xl">clinical_notes</span>
          </div>
          <span className="font-display  text-xl tracking-widest text-primary">Formulary</span>
        </div>

        <div className="space-y-6 max-w-lg">
          <h1 className="font-display text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
            Elevating <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Clinical Care</span>
          </h1>
          <p className="text-on-surface-variant text-base font-medium leading-relaxed max-w-md">
            Experience the pinnacle of medical orchestration. A digital atelier engineered for elite practitioners seeking absolute precision.
          </p>
          
          <div className="pt-4 flex items-center gap-4">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className={`w-10 h-10 rounded-full border-2 border-surface bg-surface-container-high flex items-center justify-center shadow-sm z-[${10-i}]`}>
                  <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User" className="w-full h-full rounded-full object-cover" />
                </div>
              ))}
            </div>
            <div className="text-xs font-bold text-on-surface-variant">
              Trusted by <span className="text-primary">10,000+</span> professionals
            </div>
          </div>
        </div>

        <div className="text-[10px] font-bold uppercase tracking-widest text-outline/60">
          {/* © {new Date().getFullYear()} Formulary Systems. */}
        </div>
      </div>

      {/* Right Column: Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center z-10">
        <div 
          className="w-full max-w-md bg-surface-container-lowest/80 backdrop-blur-xl border border-white/40 p-6 sm:p-10 rounded-[2rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] transition-all duration-500 hover:shadow-[0_30px_60px_-15px_rgba(0,81,63,0.1)] relative group"
          // onMouseEnter={() => setIsHovered(true)}
          // onMouseLeave={() => setIsHovered(false)}
        >
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-container flex items-center justify-center shadow-md">
              <span className="material-symbols-outlined text-white text-lg">clinical_notes</span>
            </div>
             <span className="font-display font-bold text-lg tracking-widest uppercase text-primary">Formulary</span>
          </div>

          <div className="space-y-1 mb-8 text-center lg:text-left">
            <h2 className="font-display text-2xl font-bold text-on-surface">Welcome Back</h2>
            <p className="text-on-surface-variant font-medium text-xs">Enter your clinical credentials to access your workspace.</p>
          </div>

          <form className="space-y-4">
            <div className="space-y-1.5 relative group">
              <label className="text-[0.6rem] uppercase tracking-widest font-bold text-on-surface-variant ml-1" htmlFor="email">Email Address</label>
              <div className="relative flex items-center">
                 <span className="material-symbols-outlined absolute left-4 text-outline group-focus-within:text-primary transition-colors text-lg">alternate_email</span>
                 <input 
                  type="email" 
                  id="email" 
                  className="w-full pl-11 pr-4 py-3.5 bg-surface-container-low border border-transparent rounded-xl focus:bg-white focus:border-primary/30 focus:ring-4 focus:ring-primary/10 transition-all duration-300 outline-none text-sm font-medium"
                  placeholder="doctor@clinic.com"
                />
              </div>
            </div>

            <div className="space-y-1.5 relative group">
              <div className="flex justify-between items-center ml-1 mb-0.5">
                <label className="text-[0.6rem] uppercase tracking-widest font-bold text-on-surface-variant" htmlFor="password">Password</label>
                <Link to="#" className="text-[0.6rem] uppercase tracking-widest font-bold text-primary hover:text-secondary transition-colors">Forgot?</Link>
              </div>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-4 text-outline group-focus-within:text-primary transition-colors text-lg">lock</span>
                <input 
                  type={showPassword ? "text" : "password"}
                  id="password" 
                  className="w-full pl-11 pr-11 py-3.5 bg-surface-container-low border border-transparent rounded-xl focus:bg-white focus:border-primary/30 focus:ring-4 focus:ring-primary/10 transition-all duration-300 outline-none text-sm font-medium"
                  placeholder="••••••••"
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

            <div className="pt-2">
              <button 
                type="submit" 
                className="w-full py-3.5 bg-primary text-white rounded-xl font-bold tracking-wide flex items-center justify-center gap-2 overflow-hidden group shadow-[0_10px_20px_-10px_rgba(0,81,63,0.5)] hover:shadow-[0_15px_25px_-10px_rgba(0,81,63,0.6)] hover:bg-primary-container transition-all hover:-translate-y-0.5 active:translate-y-0 text-sm"
              >
                <span>Access Workspace</span>
                <span className="material-symbols-outlined text-sm transition-transform duration-300 group-hover:translate-x-1">arrow_forward</span>
              </button>
            </div>
          </form>

          <div className="mt-8 text-center text-xs font-medium text-on-surface-variant border-t border-outline-variant/20 pt-6">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary font-bold hover:underline decoration-2 underline-offset-4 transition-all">Request access</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SigninPage;
