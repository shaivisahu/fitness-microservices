import React, { useEffect, useState } from 'react';
import { authApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user } = useAuth();
  const [form, setForm] = useState({ firstName:'', lastName:'', weight:'', height:'', age:'' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    authApi.getProfile().then(p => {
      setForm({ firstName:p.firstName||'', lastName:p.lastName||'', weight:p.weight||'', height:p.height||'', age:p.age||'' });
    }).finally(() => setLoading(false));
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      await authApi.updateProfile({ ...form, weight:form.weight?+form.weight:null, height:form.height?+form.height:null, age:form.age?+form.age:null });
      toast.success('Profile updated');
    } catch { toast.error('Update failed'); } finally { setSaving(false); }
  };

  const bmi = form.weight && form.height ? (form.weight / Math.pow(form.height/100, 2)).toFixed(1) : null;
  const bmiInfo = bmi ? (
    bmi < 18.5 ? { label:'UNDERWEIGHT', color:'#00e5ff' } :
    bmi < 25   ? { label:'NORMAL',      color:'#c8ff00' } :
    bmi < 30   ? { label:'OVERWEIGHT',  color:'#ff6b00' } :
                 { label:'OBESE',       color:'#ff2d78' }
  ) : null;

  const set = k => e => setForm({...form, [k]: e.target.value});

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1>PROFILE</h1>
        <p>Manage your personal information</p>
      </div>

      <div className="grid-2" style={{ alignItems:'start' }}>
        {/* Form */}
        <div className="card">
          <div style={sH}>PERSONAL DETAILS</div>
          <div style={{ display:'flex', flexDirection:'column', gap:14, marginTop:20 }}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              <div className="form-group"><label className="form-label">First Name</label><input className="form-input" placeholder="John" value={form.firstName} onChange={set('firstName')} /></div>
              <div className="form-group"><label className="form-label">Last Name</label><input className="form-input" placeholder="Doe" value={form.lastName} onChange={set('lastName')} /></div>
            </div>
            <div className="form-group" style={{ opacity:0.5 }}>
              <label className="form-label">Username (readonly)</label>
              <input className="form-input" value={user?.username||''} disabled />
            </div>
            <div className="form-group" style={{ opacity:0.5 }}>
              <label className="form-label">Email (readonly)</label>
              <input className="form-input" value={user?.email||''} disabled />
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12 }}>
              <div className="form-group"><label className="form-label">Weight (kg)</label><input className="form-input" type="number" placeholder="70" value={form.weight} onChange={set('weight')} /></div>
              <div className="form-group"><label className="form-label">Height (cm)</label><input className="form-input" type="number" placeholder="175" value={form.height} onChange={set('height')} /></div>
              <div className="form-group"><label className="form-label">Age</label><input className="form-input" type="number" placeholder="25" value={form.age} onChange={set('age')} /></div>
            </div>
            <button className="btn btn-primary" onClick={save} disabled={saving} style={{ alignSelf:'flex-start' }}>
              {saving ? 'SAVING...' : 'SAVE CHANGES'}
            </button>
          </div>
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          {/* BMI Card */}
          {bmi && (
            <div className="card" style={{ textAlign:'center' }}>
              <div style={sH}>BMI CALCULATOR</div>
              <div style={{ marginTop:24, marginBottom:20 }}>
                <div style={{ fontFamily:"'Syne', sans-serif", fontSize:80, fontWeight:800, color:bmiInfo.color, lineHeight:1, letterSpacing:-4, textShadow:`0 0 40px ${bmiInfo.color}44` }}>
                  {bmi}
                </div>
                <div style={{ marginTop:12, display:'inline-block', padding:'4px 14px', background:`${bmiInfo.color}18`, border:`1px solid ${bmiInfo.color}40`, borderRadius:4, fontSize:11, color:bmiInfo.color, fontWeight:600, letterSpacing:1.5 }}>
                  {bmiInfo.label}
                </div>
                <div style={{ fontSize:10, color:'#50505f', marginTop:8 }}>
                  {form.weight}kg · {form.height}cm
                </div>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
                {[
                  { r:'< 18.5', l:'Underweight', c:'#00e5ff' },
                  { r:'18.5 – 24.9', l:'Normal', c:'#c8ff00' },
                  { r:'25 – 29.9', l:'Overweight', c:'#ff6b00' },
                  { r:'≥ 30', l:'Obese', c:'#ff2d78' },
                ].map(item => (
                  <div key={item.l} style={{ display:'flex', justifyContent:'space-between', padding:'7px 0', borderBottom:'1px solid rgba(255,255,255,0.04)', opacity: bmiInfo.label === item.l.toUpperCase() ? 1 : 0.4 }}>
                    <span style={{ fontSize:11, color:item.c, fontWeight: bmiInfo.label===item.l.toUpperCase()?700:400 }}>{item.l}</span>
                    <span style={{ fontSize:11, color:'#50505f' }}>{item.r}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Account info */}
          <div className="card">
            <div style={sH}>ACCOUNT</div>
            <div style={{ marginTop:16, display:'flex', flexDirection:'column', gap:0 }}>
              {[
                { label:'Username', value:user?.username },
                { label:'Email', value:user?.email },
                { label:'Status', value:'Active ●' },
              ].map(row => (
                <div key={row.label} style={{ display:'flex', justifyContent:'space-between', padding:'10px 0', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                  <span style={{ fontSize:10, color:'#50505f', letterSpacing:1, textTransform:'uppercase' }}>{row.label}</span>
                  <span style={{ fontSize:12, fontWeight:500, color: row.label==='Status' ? '#c8ff00' : '#f4f4fc' }}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const sH = { fontFamily:"'Syne', sans-serif", fontSize:12, fontWeight:800, textTransform:'uppercase', letterSpacing:1.5, color:'#f4f4fc' };
