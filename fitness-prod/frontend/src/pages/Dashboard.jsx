import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserWorkouts, getUserRecommendations } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

export default function Dashboard() {
  const { user } = useAuth();
  const [workouts, setWorkouts] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    Promise.all([
      getUserWorkouts(user.id),
      getUserRecommendations(user.id)
    ]).then(([w, r]) => {
      setWorkouts(w.data || []);
      setRecommendations(r.data || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [user]);

  const totalCalories = workouts.reduce((s, w) => s + (w.caloriesBurned || 0), 0);
  const totalMinutes  = workouts.reduce((s, w) => s + (w.durationMinutes || 0), 0);
  const totalWorkouts = workouts.length;

  // Chart data: last 7 workouts calories
  const chartData = [...workouts].reverse().slice(0, 7).map((w, i) => ({
    name: w.title?.slice(0, 10) || `W${i+1}`,
    calories: w.caloriesBurned || 0,
    minutes: w.durationMinutes || 0
  }));

  // Workout type breakdown
  const typeMap = {};
  workouts.forEach(w => { typeMap[w.type || 'OTHER'] = (typeMap[w.type || 'OTHER'] || 0) + 1; });
  const typeData = Object.entries(typeMap).map(([type, count]) => ({ type, count }));

  const latestWorkouts = [...workouts].slice(0, 4);

  if (loading) return <div className="centered"><div className="spinner" /></div>;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">DASHBOARD</h1>
        <p className="page-subtitle">Welcome back, {user?.firstName || 'Athlete'} 👋 Keep pushing!</p>
      </div>

      {/* Stats */}
      <div className="stat-grid" style={{ marginBottom: 32 }}>
        <div className="stat-card">
          <div className="stat-label">Total Workouts</div>
          <div className="stat-value">{totalWorkouts}</div>
          <div className="stat-sub">sessions logged</div>
        </div>
        <div className="stat-card" style={{ '--accent': 'var(--accent2)' }}>
          <div className="stat-label">Calories Burned</div>
          <div className="stat-value" style={{ color: 'var(--accent2)' }}>{totalCalories.toLocaleString()}</div>
          <div className="stat-sub">total kcal</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Time Trained</div>
          <div className="stat-value">{Math.round(totalMinutes / 60)}h</div>
          <div className="stat-sub">{totalMinutes} minutes total</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">AI Tips</div>
          <div className="stat-value" style={{ color: '#64b5f6' }}>{recommendations.length}</div>
          <div className="stat-sub">recommendations</div>
        </div>
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 32 }}>
        <div className="card">
          <div className="section-title">CALORIES PER WORKOUT</div>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData}>
                <XAxis dataKey="name" tick={{ fill: '#666', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#666', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 8, color: '#f0f0f0' }} />
                <Bar dataKey="calories" fill="#e8ff00" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <div className="empty-state"><div className="empty-icon">📊</div><p>No workout data yet</p></div>}
        </div>

        <div className="card">
          <div className="section-title">WORKOUT DURATION</div>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData}>
                <XAxis dataKey="name" tick={{ fill: '#666', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#666', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 8, color: '#f0f0f0' }} />
                <Line type="monotone" dataKey="minutes" stroke="#ff4d00" strokeWidth={2} dot={{ fill: '#ff4d00', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : <div className="empty-state"><div className="empty-icon">📈</div><p>No workout data yet</p></div>}
        </div>
      </div>

      {/* Recent Workouts */}
      <div className="card">
        <div className="section-title">RECENT WORKOUTS</div>
        {latestWorkouts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🏋️</div>
            <p>No workouts yet — go log your first one!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {latestWorkouts.map(w => (
              <div key={w.id} style={wStyle}>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>{w.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)' }}>
                    {w.durationMinutes}min · {w.caloriesBurned} kcal · {w.exercises?.length || 0} exercises
                  </div>
                </div>
                <span className={`tag tag-${(w.type || 'strength').toLowerCase()}`}>{w.type || 'STRENGTH'}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const wStyle = {
  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  padding: '14px 16px', background: 'var(--bg3)',
  borderRadius: 8, border: '1px solid var(--border)'
};
