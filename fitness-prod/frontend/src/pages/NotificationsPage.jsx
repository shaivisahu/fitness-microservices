import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserNotifications } from '../services/api';

const typeIcon  = { WORKOUT_LOGGED: '💪', RECOMMENDATION_READY: '🤖', REMINDER: '⏰' };
const typeColor = { WORKOUT_LOGGED: 'var(--success)', RECOMMENDATION_READY: '#64b5f6', REMINDER: 'var(--accent2)' };
const typeBg    = { WORKOUT_LOGGED: 'rgba(0,230,118,0.08)', RECOMMENDATION_READY: 'rgba(100,181,246,0.08)', REMINDER: 'rgba(255,77,0,0.08)' };

export default function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    if (!user?.id) return;
    getUserNotifications(user.id)
      .then(res => setNotifications(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  const types = ['ALL', 'WORKOUT_LOGGED', 'RECOMMENDATION_READY', 'REMINDER'];
  const filtered = filter === 'ALL' ? notifications : notifications.filter(n => n.type === filter);
  const sentCount   = notifications.filter(n => n.sent).length;
  const pendingCount = notifications.filter(n => !n.sent).length;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">NOTIFICATIONS</h1>
        <p className="page-subtitle">Your activity alerts and email history</p>
      </div>

      {/* Stats row */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 28 }}>
        {[
          { label: 'Total', value: notifications.length, color: 'var(--accent)' },
          { label: 'Sent', value: sentCount, color: 'var(--success)' },
          { label: 'Pending', value: pendingCount, color: 'var(--accent2)' }
        ].map(s => (
          <div key={s.label} style={{
            flex: 1, background: 'var(--bg2)', border: '1px solid var(--border)',
            borderRadius: 10, padding: '16px 20px', textAlign: 'center'
          }}>
            <div style={{ fontFamily: 'var(--font-head)', fontSize: '2rem', color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 12, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {types.map(t => (
          <button key={t} onClick={() => setFilter(t)} className="btn btn-sm"
            style={{
              background: filter === t ? 'var(--accent)' : 'var(--bg3)',
              color: filter === t ? '#000' : 'var(--muted)',
              border: `1px solid ${filter === t ? 'var(--accent)' : 'var(--border)'}`,
              fontSize: 11, letterSpacing: 1
            }}>
            {typeIcon[t] || '📋'} {t.replace('_', ' ')}
          </button>
        ))}
      </div>

      {loading ? <div className="centered"><div className="spinner" /></div> : (
        filtered.length === 0 ? (
          <div className="empty-state card">
            <div className="empty-icon">🔔</div>
            <p>No notifications yet. They appear when you log workouts or get AI recommendations!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filtered.map(n => (
              <div key={n.id} className="card" style={{ borderColor: `${typeColor[n.type]}22` }}>
                <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 10, flexShrink: 0,
                    background: typeBg[n.type] || 'var(--bg3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20
                  }}>
                    {typeIcon[n.type] || '📢'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <div style={{ fontWeight: 700, fontSize: 15 }}>{n.subject}</div>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
                        <span style={{
                          padding: '2px 8px', borderRadius: 20, fontSize: 10, fontWeight: 700,
                          letterSpacing: 1, textTransform: 'uppercase',
                          background: n.sent ? 'rgba(0,230,118,0.1)' : 'rgba(255,77,0,0.1)',
                          color: n.sent ? 'var(--success)' : 'var(--accent2)'
                        }}>
                          {n.sent ? '✓ Sent' : '⏳ Pending'}
                        </span>
                      </div>
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 8, lineHeight: 1.5 }}>
                      {n.message?.slice(0, 120)}{n.message?.length > 120 ? '...' : ''}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--muted)', display: 'flex', gap: 16 }}>
                      <span>📧 {n.userEmail}</span>
                      <span>🕐 {new Date(n.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}
