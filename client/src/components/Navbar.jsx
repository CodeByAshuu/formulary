// client/src/components/Navbar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  // Hide Navbar on Signin and Signup pages if desired, 
  // but usually users want it everywhere or have a special one.
  // The user says "Fix the navbar", which implies it should look good.
  
  const navLinks = [
    { name: 'Search', path: '/' },
    { name: 'Dashboard', path: '/admin' },
  ];

  return (
    <nav className="sticky top-0 z-[60] w-full bg-surface/80 backdrop-blur-md border-b border-outline-variant/30 px-6 py-3 flex items-center justify-between font-body transition-all duration-300">
      <div className="flex items-center gap-10">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-primary-container flex items-center justify-center shadow-lg transition-transform group-hover:scale-110">
            <span className="material-symbols-outlined text-white text-xl">clinical_notes</span>
          </div>
          <span className="font-display font-bold text-lg tracking-[0.1em] uppercase text-primary transition-colors group-hover:text-secondary">
            Formulary
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`text-xs font-bold uppercase tracking-widest transition-all duration-300 hover:text-primary ${
                location.pathname === link.path ? 'text-primary border-b-2 border-primary pb-1' : 'text-on-surface-variant'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-6">
        <Link 
          to="/signin" 
          className="text-xs font-bold uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors"
        >
          Sign In
        </Link>
        <Link 
          to="/signup" 
          className="bg-primary text-white text-xs font-bold uppercase tracking-widest px-6 py-2.5 rounded-full shadow-[0_8px_16px_-4px_rgba(0,81,63,0.3)] hover:bg-primary-container hover:shadow-[0_12px_24px_-4px_rgba(0,81,63,0.4)] transition-all active:scale-95"
        >
          Create Account
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
