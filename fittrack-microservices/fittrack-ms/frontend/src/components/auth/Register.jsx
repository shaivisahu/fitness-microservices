import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../services/api';
import toast from 'react-hot-toast';

export default function Register() {
  const [form, setForm] = useState({ username:'', email:'', password:'', firstName:'', lastName:'', weight:'', height:'', age:'' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async e => {
    e.preventDefault(); setLoading(true);
    try {
      const data = await authApi.register({ ...form, weight: form.weight ? +form.weight : null, height: form.height ? +form.height : null, age: form.age ? +form.age : null });
      login(data); toast.success("Let's get to work 💪"); navigate('/dashboard');
    } catch (err) { toast.error(err.response?.data?.message || 'Registration failed'); }
    finally { setLoading(false); }
  };

  const set = k => e => setForm({...form, [k]: e.target.value});

  return (
    <div style={S.page}>
      <div style={S.bg} />
      <div style={S.card}>
        <div style={S.cardLeft}>
          <div style={S.logoMark}>FT</div>
          <h1 style={S.headline}>START YOUR<br />JOURNEY.</h1>
          <p style={S.sub}>Join FitTrack and get AI-powered coaching personalised to your goals.</p>
        </div>
        <div style={S.cardRight}>
          <div style={S.formTitle}>CREATE ACCOUNT</div>
          <div style={S.formSub}>Fill in your details below</div>

          <form onSubmit={submit} style={S.form}>
            <div style={S.row}>
              <div className="form-group">
                <label className="form-label">First Name</label>
                <input className="form-input" placeholder="John" value={form.firstName} onChange={set('firstName')} />
              </div>
              <div className="form-group">
                <label className="form-label">Last Name</label>
                <input className="form-input" placeholder="Doe" value={form.lastName} onChange={set('lastName')} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Username *</label>
              <input className="form-input" placeholder="johndoe" value={form.username} onChange={set('username')} required />
            </div>
            <div className="form-group">
              <label className="form-label">Email *</label>
              <input className="form-input" type="email" placeholder="john@example.com" value={form.email} onChange={set('email')} required />
            </div>
            <div className="form-group">
              <label className="form-label">Password *</label>
              <input className="form-input" type="password" placeholder="Min 6 characters" value={form.password} onChange={set('password')} required minLength={6} />
            </div>
            <div style={S.row}>
              <div className="form-group">
                <label className="form-label">Weight (kg)</label>
                <input className="form-input" type="number" placeholder="70" value={form.weight} onChange={set('weight')} />
              </div>
              <div className="form-group">
                <label className="form-label">Height (cm)</label>
                <input className="form-input" type="number" placeholder="175" value={form.height} onChange={set('height')} />
              </div>
              <div className="form-group">
                <label className="form-label">Age</label>
                <input className="form-input" type="number" placeholder="25" value={form.age} onChange={set('age')} />
              </div>
            </div>
            <button className="btn btn-primary" type="submit" disabled={loading}
              style={{ width:'100%', justifyContent:'center', padding:'13px', fontSize:13, marginTop:4 }}>
              {loading ? 'CREATING...' : 'CREATE ACCOUNT →'}
            </button>
          </form>
          <p style={S.footer}>Already have an account?{' '}<Link to="/login" style={{ color:'#c8ff00' }}>Sign in</Link></p>
        </div>
      </div>
    </div>
  );
}

const S = {
  page: { minHeight:'100vh', background:'#080810', display:'flex', alignItems:'center', justifyContent:'center', padding:20, position:'relative' },
  bg: { position:'fixed', inset:0, backgroundImage:'linear-gradient(rgba(200,255,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(200,255,0,0.03) 1px, transparent 1px)', backgroundSize:'60px 60px', pointerEvents:'none' },
  card: { position:'relative', display:'flex', width:'100%', maxWidth:900, background:'#0f0f1a', border:'1px solid rgba(255,255,255,0.07)', borderRadius:16, overflow:'hidden', boxShadow:'0 40px 100px rgba(0,0,0,0.6)' },
  cardLeft: { flex:1, padding:'48px 40px', display:'flex', flexDirection:'column', justifyContent:'center', gap:16, borderRight:'1px solid rgba(255,255,255,0.06)', background:'linear-gradient(145deg, rgba(200,255,0,0.04), transparent)' },
  logoMark: { width:44, height:44, background:'#c8ff00', color:'#000', fontFamily:"'Syne', sans-serif", fontWeight:800, fontSize:16, display:'flex', alignItems:'center', justifyContent:'center', borderRadius:8 },
  headline: { fontFamily:"'Syne', sans-serif", fontSize:44, fontWeight:800, letterSpacing:-2, lineHeight:1.05, color:'#f4f4fc' },
  sub: { fontSize:12, color:'#9090b0', lineHeight:1.7, maxWidth:260 },
  cardRight: { width:400, padding:'40px 36px', overflowY:'auto' },
  formTitle: { fontFamily:"'Syne', sans-serif", fontSize:24, fontWeight:800, letterSpacing:2, color:'#f4f4fc', marginBottom:4 },
  formSub: { fontSize:11, color:'#50505f', letterSpacing:0.5, marginBottom:24 },
  form: { display:'flex', flexDirection:'column', gap:13, marginBottom:16 },
  row: { display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(90px, 1fr))', gap:10 },
  footer: { fontSize:11, color:'#50505f', textAlign:'center' },
};
