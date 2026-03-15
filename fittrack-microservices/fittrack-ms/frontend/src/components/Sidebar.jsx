import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const nav = [
  { path: '/dashboard', icon: '◈', label: 'Dashboard' },
  { path: '/workouts', icon: '◎', label: 'Workouts' },
  { path: '/diet', icon: '◇', label: 'Nutrition' },
  { path: '/progress', icon: '▲', label: 'Progress' },
  { path: '/ai', icon: '✦', label: 'AI Coach' },
  { path: '/profile', icon: '○', label: 'Profile' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(null);

  return (
    <aside style={S.root}>
      {/* Decorative vertical line */}
      <div style={S.line} />

      {/* Logo */}
      <div style={S.logo}>
        <div style={S.logoMark}>FT</div>
        <div>
          <div style={S.logoText}>FITTRACK</div>
          <div style={S.logoSub}>v2.0 · AI POWERED</div>
        </div>
      </div>

      {/* User chip */}
      <div style={S.userChip}>
        <div style={S.avatar}>{user?.username?.[0]?.toUpperCase()}</div>
        <div style={{ overflow: 'hidden' }}>
          <div style={S.userName}>{user?.username}</div>
          <div style={S.userEmail}>{user?.email?.split('@')[0]}@···</div>
        </div>
        <div style={S.onlineDot} />
      </div>

      {/* Nav */}
      <nav style={S.nav}>
        <div style={S.navLabel}>NAVIGATION</div>
        {nav.map((item, i) => (
          <NavLink
            key={item.path}
            to={item.path}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            style={({ isActive }) => ({
              ...S.navItem,
              ...(isActive ? S.navActive : {}),
              ...(hovered === i && !isActive ? S.navHover : {}),
            })}
          >
            <span style={{ ...S.navIcon, color: hovered === i || document.location.pathname === item.path ? '#c8ff00' : '#50505f' }}>
              {item.icon}
            </span>
            <span style={{ letterSpacing: '0.8px' }}>{item.label}</span>
            {item.path === '/ai' && <span style={S.aiBadge}>NEW</span>}
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div style={S.bottom}>
        <div style={S.divider} />
        <button onClick={() => { logout(); navigate('/login'); }} style={S.logout}>
          <span>⊗</span> SIGN OUT
        </button>
      </div>
    </aside>
  );
}

const S = {
  root: {
    position: 'fixed', top: 0, left: 0, bottom: 0, width: 260,
    background: '#0a0a14',
    borderRight: '1px solid rgba(255,255,255,0.05)',
    display: 'flex', flexDirection: 'column',
    padding: '0 0 24px', zIndex: 100, overflow: 'hidden',
  },
  line: {
    position: 'absolute', top: 0, right: 0, width: 1, height: '100%',
    background: 'linear-gradient(to bottom, transparent, rgba(200,255,0,0.15) 40%, rgba(200,255,0,0.05) 80%, transparent)',
  },
  logo: {
    display: 'flex', alignItems: 'center', gap: 12,
    padding: '28px 24px 20px',
    borderBottom: '1px solid rgba(255,255,255,0.04)',
  },
  logoMark: {
    width: 38, height: 38, background: '#c8ff00',
    color: '#000', fontFamily: "'Syne', sans-serif",
    fontWeight: 800, fontSize: 14, letterSpacing: 1,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    borderRadius: 6, flexShrink: 0,
  },
  logoText: {
    fontFamily: "'Syne', sans-serif", fontSize: 15,
    fontWeight: 800, letterSpacing: 2, color: '#f4f4fc',
  },
  logoSub: { fontSize: 9, color: '#50505f', letterSpacing: 1.5, marginTop: 2 },
  userChip: {
    display: 'flex', alignItems: 'center', gap: 10,
    margin: '16px 16px 8px',
    padding: '10px 12px',
    background: 'rgba(255,255,255,0.03)',
    borderRadius: 8, position: 'relative',
  },
  avatar: {
    width: 34, height: 34, borderRadius: 6,
    background: 'rgba(200,255,0,0.12)',
    border: '1px solid rgba(200,255,0,0.2)',
    color: '#c8ff00', fontFamily: "'Syne', sans-serif",
    fontWeight: 800, fontSize: 13,
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  userName: { fontSize: 12, fontWeight: 500, color: '#f4f4fc', letterSpacing: 0.3 },
  userEmail: { fontSize: 10, color: '#50505f', marginTop: 1 },
  onlineDot: {
    width: 6, height: 6, background: '#c8ff00',
    borderRadius: '50%', position: 'absolute', top: 10, right: 12,
    boxShadow: '0 0 6px rgba(200,255,0,0.6)',
  },
  nav: { flex: 1, padding: '12px 12px 0' },
  navLabel: { fontSize: 9, letterSpacing: 2, color: '#30303f', padding: '8px 12px', marginBottom: 4 },
  navItem: {
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '10px 14px', borderRadius: 7, fontSize: 11,
    fontWeight: 500, color: '#9090b0', letterSpacing: 0.8,
    textDecoration: 'none', marginBottom: 2, transition: 'all 0.15s',
    position: 'relative',
  },
  navActive: {
    background: 'rgba(200,255,0,0.08)',
    color: '#c8ff00',
    borderLeft: '2px solid #c8ff00',
    paddingLeft: 12,
  },
  navHover: { background: 'rgba(255,255,255,0.03)', color: '#f4f4fc' },
  navIcon: { fontSize: 14, width: 18, textAlign: 'center', transition: 'color 0.15s' },
  aiBadge: {
    marginLeft: 'auto', background: 'rgba(155,89,255,0.2)', color: '#9b59ff',
    fontSize: 8, padding: '2px 6px', borderRadius: 3, letterSpacing: 1,
  },
  bottom: { padding: '0 12px' },
  divider: { height: 1, background: 'rgba(255,255,255,0.05)', margin: '0 0 12px' },
  logout: {
    width: '100%', padding: '9px 14px',
    background: 'transparent',
    border: '1px solid rgba(255,45,120,0.15)',
    borderRadius: 7, color: 'rgba(255,45,120,0.6)',
    fontSize: 10, fontWeight: 500, letterSpacing: 1.5,
    cursor: 'pointer', display: 'flex', alignItems: 'center',
    gap: 8, transition: 'all 0.15s',
  },
};
