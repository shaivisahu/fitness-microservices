import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../services/api';
import toast from 'react-hot-toast';

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async e => {
    e.preventDefault(); setLoading(true);
    try { login(await authApi.login(form)); toast.success('Welcome back'); navigate('/dashboard'); }
    catch (err) { toast.error(err.response?.data?.message || 'Invalid credentials'); }
    finally { setLoading(false); }
  };

  return (
    <div style={S.page}>
      {/* Animated background */}
      <div style={S.bgGrid} />
      <div style={S.bgGlow1} />
      <div style={S.bgGlow2} />

      <div style={S.container}>
        {/* Left panel — branding */}
        <div style={S.left}>
          <div style={S.logoMark}>FT</div>
          <h1 style={S.headline}>TRAIN<br />SMARTER.</h1>
          <p style={S.tagline}>AI-powered fitness tracking for athletes who want results.</p>
          <div style={S.pills}>
            {['AI Coach', 'Workout Logs', 'Nutrition', 'Progress Charts'].map(t => (
              <span key={t} style={S.pill}>{t}</span>
            ))}
          </div>
        </div>

        {/* Right panel — form */}
        <div style={S.right}>
          <div style={S.formCard}>
            <div style={S.formHeader}>
              <div style={S.formTitle}>SIGN IN</div>
              <div style={S.formSub}>Continue your journey</div>
            </div>

            <form onSubmit={submit} style={S.form}>
              <div className="form-group">
                <label className="form-label">Username</label>
                <input className="form-input" placeholder="johndoe" value={form.username}
                  onChange={e => setForm({...form, username: e.target.value})} required />
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <input className="form-input" type="password" placeholder="••••••••" value={form.password}
                  onChange={e => setForm({...form, password: e.target.value})} required />
              </div>
              <button className="btn btn-primary" type="submit" disabled={loading}
                style={{ width: '100%', justifyContent: 'center', padding: '13px', fontSize: 13, marginTop: 4 }}>
                {loading ? 'SIGNING IN...' : 'SIGN IN →'}
              </button>
            </form>

            <p style={S.switchText}>
              New here?{' '}
              <Link to="/register" style={{ color: '#c8ff00', fontWeight: 500 }}>Create account</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const S = {
  page: {
    minHeight: '100vh', background: '#080810', display: 'flex', alignItems: 'center',
    justifyContent: 'center', padding: 20, position: 'relative', overflow: 'hidden',
  },
  bgGrid: {
    position: 'fixed', inset: 0,
    backgroundImage: 'linear-gradient(rgba(200,255,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(200,255,0,0.03) 1px, transparent 1px)',
    backgroundSize: '60px 60px', pointerEvents: 'none',
  },
  bgGlow1: {
    position: 'fixed', top: '-20%', left: '-10%', width: '50vw', height: '50vw',
    borderRadius: '50%', background: 'rgba(200,255,0,0.04)', filter: 'blur(80px)', pointerEvents: 'none',
  },
  bgGlow2: {
    position: 'fixed', bottom: '-20%', right: '-10%', width: '40vw', height: '40vw',
    borderRadius: '50%', background: 'rgba(155,89,255,0.06)', filter: 'blur(80px)', pointerEvents: 'none',
  },
  container: {
    position: 'relative', display: 'flex', width: '100%', maxWidth: 900,
    minHeight: 560, gap: 0,
    background: '#0f0f1a', border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 16, overflow: 'hidden', boxShadow: '0 40px 100px rgba(0,0,0,0.6)',
  },
  left: {
    flex: 1, padding: '56px 48px', display: 'flex', flexDirection: 'column',
    justifyContent: 'center', gap: 20,
    borderRight: '1px solid rgba(255,255,255,0.06)',
    background: 'linear-gradient(145deg, rgba(200,255,0,0.04), transparent)',
  },
  logoMark: {
    width: 48, height: 48, background: '#c8ff00', color: '#000',
    fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 17, letterSpacing: 1,
    display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 10,
  },
  headline: {
    fontFamily: "'Syne', sans-serif", fontSize: 52, fontWeight: 800,
    letterSpacing: -2, lineHeight: 1.05, color: '#f4f4fc',
  },
  tagline: { fontSize: 13, color: '#9090b0', lineHeight: 1.7, maxWidth: 280 },
  pills: { display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 },
  pill: {
    padding: '5px 12px', background: 'rgba(200,255,0,0.08)',
    color: '#c8ff00', borderRadius: 4, fontSize: 10,
    fontWeight: 500, letterSpacing: 0.8,
  },
  right: {
    width: 360, display: 'flex', alignItems: 'center',
    justifyContent: 'center', padding: 40,
  },
  formCard: { width: '100%' },
  formHeader: { marginBottom: 32 },
  formTitle: {
    fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 800,
    letterSpacing: 2, color: '#f4f4fc',
  },
  formSub: { fontSize: 11, color: '#50505f', marginTop: 6, letterSpacing: 0.5 },
  form: { display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 20 },
  switchText: { fontSize: 12, color: '#50505f', textAlign: 'center' },
};
