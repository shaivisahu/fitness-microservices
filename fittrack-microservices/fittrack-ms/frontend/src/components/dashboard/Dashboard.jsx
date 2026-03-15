import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { statsApi } from '../../services/api';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { statsApi.getDashboard().then(setStats).finally(() => setLoading(false)); }, []);

  if (loading) return <div className="loading-screen"><div className="spinner" /><span style={{ fontSize:11, color:'#50505f', letterSpacing:2 }}>LOADING</span></div>;

  const net = (stats?.todayCaloriesConsumed || 0) - (stats?.todayCaloriesBurned || 0);
  const macroTotal = (stats?.todayProtein || 0) + (stats?.todayCarbs || 0) + (stats?.todayFat || 0);

  return (
    <div className="fade-in">
      {/* Header */}
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:32 }}>
        <div>
          <div style={{ fontSize:10, color:'#50505f', letterSpacing:2, marginBottom:8 }}>{format(new Date(), 'EEEE · MMMM d, yyyy').toUpperCase()}</div>
          <h1 style={{ fontFamily:"'Syne', sans-serif", fontSize:clamp(36,48), fontWeight:800, letterSpacing:-1, lineHeight:1, textTransform:'uppercase' }}>
            Hey, <span style={{ color:'#c8ff00' }}>{user?.username}</span>
          </h1>
          <p style={{ color:'#50505f', fontSize:11, marginTop:6, letterSpacing:0.5 }}>Here's your fitness snapshot for today.</p>
        </div>
        <Link to="/ai" style={{ textDecoration:'none' }}>
          <button className="btn btn-ai" style={{ fontSize:11, padding:'10px 18px' }}>✦ ASK AI COACH</button>
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid-4 fade-in-up" style={{ marginBottom:24 }}>
        <StatCard label="CALORIES IN" value={Math.round(stats?.todayCaloriesConsumed || 0)} unit="kcal" color="#c8ff00" delay={0} />
        <StatCard label="CALORIES BURNED" value={stats?.todayCaloriesBurned || 0} unit="kcal" color="#ff2d78" delay={50} />
        <StatCard label="NET BALANCE" value={Math.round(net)} unit="kcal" color={net > 0 ? '#ff6b00' : '#00e5ff'} delay={100} />
        <StatCard label="TOTAL SESSIONS" value={stats?.totalWorkouts || 0} unit="workouts" color="#9b59ff" delay={150} />
      </div>

      <div className="grid-2" style={{ marginBottom:24 }}>
        {/* Macros */}
        <div className="card fade-in-up stagger-2">
          <div style={cardHeader}>TODAY'S MACROS</div>
          <div style={{ marginTop:18, display:'flex', flexDirection:'column', gap:16 }}>
            <MacroRow label="PROTEIN" value={stats?.todayProtein || 0} total={macroTotal} color="#00e5ff" />
            <MacroRow label="CARBS" value={stats?.todayCarbs || 0} total={macroTotal} color="#c8ff00" />
            <MacroRow label="FAT" value={stats?.todayFat || 0} total={macroTotal} color="#ff2d78" />
          </div>
        </div>

        {/* Weekly */}
        <div className="card fade-in-up stagger-3">
          <div style={cardHeader}>WEEKLY OVERVIEW</div>
          <div style={{ marginTop:18, display:'flex', flexDirection:'column', gap:14 }}>
            <StatRow label="Active minutes" value={`${stats?.weeklyWorkoutMinutes || 0} min`} />
            <StatRow label="Calorie deficit" value={`${Math.abs(Math.round(net))} kcal`} />
            <StatRow label="Protein today" value={`${Math.round(stats?.todayProtein || 0)}g`} />
            <StatRow label="Sessions logged" value={stats?.totalWorkouts || 0} />
          </div>

          {/* AI nudge */}
          <div style={{ marginTop:20, padding:'12px 14px', background:'rgba(155,89,255,0.08)', borderRadius:8, border:'1px solid rgba(155,89,255,0.15)' }}>
            <div style={{ fontSize:10, color:'#9b59ff', letterSpacing:1, marginBottom:4 }}>✦ AI COACH</div>
            <div style={{ fontSize:11, color:'#9090b0', lineHeight:1.6 }}>
              Get personalized workout plans, nutrition tips & recovery advice based on your actual data.
            </div>
            <Link to="/ai" style={{ textDecoration:'none' }}>
              <button className="btn btn-ai" style={{ padding:'6px 14px', fontSize:10, marginTop:10 }}>Generate Suggestions →</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, unit, color, delay }) {
  return (
    <div className="stat-card fade-in-up" style={{ animationDelay: `${delay}ms` }}>
      <div className="stat-glow" style={{ background: color }} />
      <div className="stat-label">{label}</div>
      <div className="stat-value" style={{ color }}>{value.toLocaleString()}</div>
      <div className="stat-unit">{unit}</div>
    </div>
  );
}

function MacroRow({ label, value, total, color }) {
  const pct = total > 0 ? Math.min(100, (value / total) * 100) : 0;
  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
        <span style={{ fontSize:10, color:'#50505f', letterSpacing:1 }}>{label}</span>
        <span style={{ fontSize:12, fontWeight:500, color }}>{Math.round(value)}g</span>
      </div>
      <div style={{ height:3, background:'rgba(255,255,255,0.05)', borderRadius:2 }}>
        <div style={{ height:'100%', width:`${pct}%`, background:color, borderRadius:2, transition:'width 1s ease', boxShadow:`0 0 8px ${color}55` }} />
      </div>
    </div>
  );
}

function StatRow({ label, value }) {
  return (
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'8px 0', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
      <span style={{ fontSize:10, color:'#50505f', letterSpacing:0.8 }}>{label.toUpperCase()}</span>
      <span style={{ fontSize:14, fontFamily:"'Syne', sans-serif", fontWeight:700 }}>{value}</span>
    </div>
  );
}

const cardHeader = { fontFamily:"'Syne', sans-serif", fontSize:13, fontWeight:800, textTransform:'uppercase', letterSpacing:1.5, color:'#f4f4fc' };
function clamp(min, max) { return `clamp(${min}px, 4vw, ${max}px)`; }
