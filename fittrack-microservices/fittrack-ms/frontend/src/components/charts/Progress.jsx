import React, { useEffect, useState } from 'react';
import { statsApi } from '../../services/api';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { format, parseISO } from 'date-fns';

const RANGES = [{ label:'7D', days:7 }, { label:'14D', days:14 }, { label:'30D', days:30 }, { label:'90D', days:90 }];

const TOOLTIP_STYLE = {
  backgroundColor: '#14141f',
  border: '1px solid rgba(200,255,0,0.15)',
  borderRadius: 8,
  color: '#f4f4fc',
  fontSize: 11,
  fontFamily: "'DM Mono', monospace",
};

export default function Progress() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState(30);

  useEffect(() => {
    setLoading(true);
    statsApi.getProgress(range).then(raw => {
      setData(raw.map(d => ({
        ...d,
        label: format(parseISO(d.date), range <= 14 ? 'MMM d' : 'MMM d'),
        net: (d.calories||0) - (d.caloriesBurned||0),
      })));
    }).finally(() => setLoading(false));
  }, [range]);

  return (
    <div className="fade-in">
      <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:32 }}>
        <div className="page-header" style={{ marginBottom:0 }}>
          <h1>PROGRESS</h1>
          <p>Visualize your fitness journey over time</p>
        </div>
        <div style={{ display:'flex', gap:6 }}>
          {RANGES.map(r => (
            <button key={r.days} onClick={() => setRange(r.days)}
              className={range === r.days ? 'btn btn-primary' : 'btn btn-ghost'}
              style={{ padding:'7px 14px', fontSize:11 }}>
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="loading-screen"><div className="spinner" /></div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
          {/* Calories consumed vs burned */}
          <div className="card fade-in-up">
            <ChartHeader title="CALORIES: CONSUMED VS BURNED" />
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={data} margin={{ top:10, right:10, left:-15, bottom:0 }}>
                <defs>
                  <linearGradient id="gCal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#c8ff00" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#c8ff00" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gBurn" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff2d78" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#ff2d78" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="label" tick={{ fill:'#50505f', fontSize:10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill:'#50505f', fontSize:10 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Legend wrapperStyle={{ fontSize:11, color:'#9090b0' }} />
                <Area type="monotone" dataKey="calories" name="Consumed (kcal)" stroke="#c8ff00" fill="url(#gCal)" strokeWidth={2} dot={false} />
                <Area type="monotone" dataKey="caloriesBurned" name="Burned (kcal)" stroke="#ff2d78" fill="url(#gBurn)" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="grid-2">
            {/* Protein */}
            <div className="card fade-in-up stagger-1">
              <ChartHeader title="DAILY PROTEIN (g)" />
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={data} margin={{ top:10, right:10, left:-15, bottom:0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="label" tick={{ fill:'#50505f', fontSize:10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill:'#50505f', fontSize:10 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={TOOLTIP_STYLE} />
                  <Bar dataKey="protein" name="Protein (g)" fill="#00e5ff" radius={[3,3,0,0]}
                    style={{ filter:'drop-shadow(0 0 4px rgba(0,229,255,0.4))' }} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Net calories */}
            <div className="card fade-in-up stagger-2">
              <ChartHeader title="NET CALORIES (IN − BURNED)" />
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={data} margin={{ top:10, right:10, left:-15, bottom:0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="label" tick={{ fill:'#50505f', fontSize:10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill:'#50505f', fontSize:10 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={TOOLTIP_STYLE} />
                  <Line type="monotone" dataKey="net" name="Net (kcal)" stroke="#ff6b00" strokeWidth={2}
                    dot={{ fill:'#ff6b00', r:3 }} activeDot={{ r:5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ChartHeader({ title }) {
  return (
    <div style={{ fontFamily:"'Syne', sans-serif", fontSize:12, fontWeight:800, letterSpacing:1.5, color:'#9090b0', textTransform:'uppercase', marginBottom:16 }}>
      {title}
    </div>
  );
}
