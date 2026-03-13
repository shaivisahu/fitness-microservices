import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser, loginUser } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function AuthPage() {
    const [mode, setMode] = useState('register');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});
    const { login } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({ email:'',password:'',firstName:'',lastName:'',weightKg:'',heightCm:'',age:'',fitnessGoal:'LOSE_WEIGHT' });
    const [loginForm, setLoginForm] = useState({ email:'',password:'' });

    const validate = () => {
        const e = {};
        if (!form.email) e.email = 'Required';
        else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email';
        if (!form.password) e.password = 'Required';
        else if (form.password.length < 6) e.password = 'Min 6 characters';
        if (!form.firstName) e.firstName = 'Required';
        setFieldErrors(e);
        return Object.keys(e).length === 0;
    };

    const set = (k) => (e) => { setForm(f => ({...f,[k]:e.target.value})); setFieldErrors(p=>({...p,[k]:''})); };

    const handleRegister = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setError(''); setSuccess(''); setLoading(true);
        try {
            const res = await registerUser({ ...form, weightKg:Number(form.weightKg)||null, heightCm:Number(form.heightCm)||null, age:Number(form.age)||null });
            login(res.data);
            setSuccess('Account created! Redirecting...');
            setTimeout(() => navigate('/dashboard'), 800);
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally { setLoading(false); }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(''); setLoading(true);
        try {
            const res = await loginUser(loginForm);
            login(res.data);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid email or password.');
        } finally { setLoading(false); }
    };

    return (
        <div style={S.page}>
            <div style={S.left}>
                <h1 style={S.brand}>FIT<br/>TRACK</h1>
                <p style={S.tagline}>Your AI-powered fitness companion. Track workouts, unlock insights, crush goals.</p>
                <div style={S.pills}>
                    {['💪 Workout Tracking','🤖 AI Recommendations','🔔 Smart Notifications','📊 Progress Analytics'].map(p=>(
                        <span key={p} style={S.pill}>{p}</span>
                    ))}
                </div>
            </div>
            <div style={S.right}>
                <div style={S.card}>
                    <div style={S.tabs}>
                        {['register','login'].map(m=>(
                            <button key={m} onClick={()=>{setMode(m);setError('');setFieldErrors({});}} style={{...S.tab,...(mode===m?S.tabActive:{})}}>
                                {m==='register'?'Sign Up':'Sign In'}
                            </button>
                        ))}
                    </div>
                    {error   && <div className="alert alert-error">{error}</div>}
                    {success && <div className="alert alert-success">{success}</div>}
                    {mode==='register' ? (
                        <form onSubmit={handleRegister}>
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">First Name *</label>
                                    <input className="form-input" value={form.firstName} onChange={set('firstName')} placeholder="Shaivi"/>
                                    {fieldErrors.firstName && <span style={S.err}>{fieldErrors.firstName}</span>}
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Last Name</label>
                                    <input className="form-input" value={form.lastName} onChange={set('lastName')} placeholder="Sahu"/>
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Email *</label>
                                <input className="form-input" type="email" value={form.email} onChange={set('email')} placeholder="you@example.com"/>
                                {fieldErrors.email && <span style={S.err}>{fieldErrors.email}</span>}
                            </div>
                            <div className="form-group">
                                <label className="form-label">Password *</label>
                                <input className="form-input" type="password" value={form.password} onChange={set('password')} placeholder="Min 6 characters"/>
                                {fieldErrors.password && <span style={S.err}>{fieldErrors.password}</span>}
                            </div>
                            <div className="form-row">
                                <div className="form-group"><label className="form-label">Age</label><input className="form-input" type="number" value={form.age} onChange={set('age')} placeholder="21"/></div>
                                <div className="form-group"><label className="form-label">Weight (kg)</label><input className="form-input" type="number" value={form.weightKg} onChange={set('weightKg')} placeholder="65"/></div>
                            </div>
                            <div className="form-row">
                                <div className="form-group"><label className="form-label">Height (cm)</label><input className="form-input" type="number" value={form.heightCm} onChange={set('heightCm')} placeholder="170"/></div>
                                <div className="form-group">
                                    <label className="form-label">Fitness Goal</label>
                                    <select className="form-input" value={form.fitnessGoal} onChange={set('fitnessGoal')}>
                                        <option value="LOSE_WEIGHT">Lose Weight</option>
                                        <option value="BUILD_MUSCLE">Build Muscle</option>
                                        <option value="STAY_FIT">Stay Fit</option>
                                        <option value="ENDURANCE">Endurance</option>
                                    </select>
                                </div>
                            </div>
                            <button className="btn btn-primary" type="submit" disabled={loading} style={{width:'100%',justifyContent:'center',marginTop:8}}>
                                {loading ? '⏳ Creating Account...' : 'Create Account →'}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleLogin}>
                            <div className="form-group">
                                <label className="form-label">Email *</label>
                                <input className="form-input" type="email" value={loginForm.email} onChange={e=>setLoginForm(f=>({...f,email:e.target.value}))} placeholder="you@example.com" required/>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Password *</label>
                                <input className="form-input" type="password" value={loginForm.password} onChange={e=>setLoginForm(f=>({...f,password:e.target.value}))} placeholder="Your password" required/>
                            </div>
                            <button className="btn btn-primary" type="submit" disabled={loading} style={{width:'100%',justifyContent:'center'}}>
                                {loading ? '⏳ Signing in...' : 'Sign In →'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}

const S = {
    page:{display:'flex',minHeight:'100vh',background:'var(--bg)'},
    left:{flex:1,padding:'60px 56px',display:'flex',flexDirection:'column',justifyContent:'center',background:'var(--bg2)',borderRight:'1px solid var(--border)'},
    brand:{fontFamily:'var(--font-head)',fontSize:'7rem',letterSpacing:'4px',color:'var(--accent)',lineHeight:0.9,marginBottom:24},
    tagline:{fontSize:'1.1rem',color:'var(--muted)',maxWidth:340,lineHeight:1.7,marginBottom:32},
    pills:{display:'flex',flexDirection:'column',gap:10},
    pill:{display:'inline-flex',alignItems:'center',gap:8,padding:'10px 16px',background:'var(--bg3)',border:'1px solid var(--border)',borderRadius:8,fontSize:14,color:'var(--text)',width:'fit-content'},
    right:{width:480,display:'flex',alignItems:'center',justifyContent:'center',padding:40},
    card:{width:'100%',background:'var(--bg2)',border:'1px solid var(--border)',borderRadius:16,padding:32},
    tabs:{display:'flex',gap:8,marginBottom:24,background:'var(--bg3)',padding:4,borderRadius:10},
    tab:{flex:1,padding:'10px',border:'none',borderRadius:8,cursor:'pointer',fontFamily:'var(--font-body)',fontSize:14,fontWeight:600,background:'transparent',color:'var(--muted)',transition:'all 0.15s'},
    tabActive:{background:'var(--accent)',color:'#000'},
    err:{display:'block',fontSize:11,color:'var(--error)',marginTop:4}
};
