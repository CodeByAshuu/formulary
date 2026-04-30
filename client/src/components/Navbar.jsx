// client/src/components/Navbar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const location = useLocation();
  const { user, isAdmin, logout } = useAuth();

  const navLinks = [
    { name: 'Search', path: '/' },
    ...(isAdmin ? [{ name: 'Dashboard', path: '/admin' }] : []),
    ...(user ? [{ name: 'Profile', path: '/profile' }] : []),
  ];

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 60,
      width: '100%',
      background: '#084734',
      borderBottom: '1px solid rgba(206,241,123,0.15)',
      backdropFilter: 'blur(12px)',
      padding: '0 28px',
      height: '60px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      fontFamily: "'DM Sans', sans-serif",
      transition: 'all 0.3s',
    }}>

      {/* Left */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '36px' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}
          className="group">
          <div style={{
            width: 34, height: 34, borderRadius: '50%',
            background: '#CEF17B',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, transition: 'transform 0.2s',
          }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#084734' }}>clinical_notes</span>
          </div>
          <span style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: '1.1rem', letterSpacing: '0.12em', color: '#ffffff',
          }}>Formulary</span>
        </Link>

        {/* Desktop links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }} className="hidden md:flex">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                style={{
                  fontSize: '0.7rem', fontWeight: 500,
                  textTransform: 'uppercase', letterSpacing: '0.12em',
                  color: isActive ? '#CEF17B' : 'rgba(205,237,179,0.65)',
                  textDecoration: 'none',
                  paddingBottom: '2px',
                  borderBottom: isActive ? '2px solid #CEF17B' : '2px solid transparent',
                  transition: 'color 0.2s, border-color 0.2s',
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = '#CEF17B'; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = 'rgba(205,237,179,0.65)'; }}
              >
                {link.name}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Right */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        {!user ? (
          <>
            <Link to="/signin" style={{
              fontSize: '0.7rem', fontWeight: 500,
              textTransform: 'uppercase', letterSpacing: '0.12em',
              color: 'rgba(205,237,179,0.65)', textDecoration: 'none',
              transition: 'color 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.color = '#CEF17B'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(205,237,179,0.65)'}
            >Sign In</Link>

            <Link to="/signup" style={{
              background: '#CEF17B', color: '#084734',
              fontSize: '0.7rem', fontWeight: 600,
              textTransform: 'uppercase', letterSpacing: '0.1em',
              padding: '8px 20px', borderRadius: '100px',
              textDecoration: 'none', whiteSpace: 'nowrap',
              transition: 'background 0.2s, transform 0.15s',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = '#d8f789'; e.currentTarget.style.transform = 'scale(1.03)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#CEF17B'; e.currentTarget.style.transform = 'scale(1)'; }}
            >Create Account</Link>
          </>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{
              fontSize: '0.62rem', fontWeight: 600,
              textTransform: 'uppercase', letterSpacing: '0.14em',
              color: 'rgba(205,237,179,0.45)',
            }}>
              {user.role === 'admin' ? 'Administrator' : 'Practitioner'}
            </span>
            <button onClick={logout} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: '0.7rem', fontWeight: 500,
              textTransform: 'uppercase', letterSpacing: '0.12em',
              color: 'rgba(205,237,179,0.65)', transition: 'color 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.color = '#f87171'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(205,237,179,0.65)'}
            >Log Out</button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;