import { useState, useEffect } from 'react';
import { getAllUsers, deleteUser, getAllWorkouts, getAllRecommendations } from '../../services/adminApi';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [tab, setTab] = useState('overview');
    const [users, setUsers] = useState([]);
    const [workouts, setWorkouts] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [deletingId, setDeletingId] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(null);

    useEffect(() => {
        fetchAll();
    }, []);

    const fetchAll = async () => {
        setLoading(true);
        setError('');
        try {
            const [u, w, r] = await Promise.all([
                getAllUsers(),
                getAllWorkouts(),
                getAllRecommendations()
            ]);
            setUsers(u.data || []);
            setWorkouts(w.data || []);
            setRecommendations(r.data || []);
        } catch (err) {
            setError('Failed to load data. Make sure all services are running.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (userId) => {
        setDeletingId(userId);
        try {
            await deleteUser(userId);
            setUsers(prev => prev.filter(u => u.id !== userId));
            setConfirmDelete(null);
        } catch (err) {
            setError('Failed to delete user.');
        } finally {
            setDeletingId(null);
        }
    };

    const handleLogout = () => { logout(); navigate('/'); };

    const tabs = [
        { id: 'overview', label: 'Overview', icon: '◈' },
        { id: 'users', label: 'Users', icon: '◉', count: users.length },
        { id: 'workouts', label: 'Workouts', icon: '◎', count: workouts.length },
        { id: 'ai', label: 'AI Insights', icon: '◆', count: recommendations.length },
    ];

    return (
        <div style={S.root}>
            {/* Sidebar */}
            <div style={S.sidebar}>
                <div style={S.logo}>
                    <div style={S.logoIcon}>FT</div>
                    <div>
                        <div style={S.logoText}>FitTrack</div>
                        <div style={S.logoBadge}>ADMIN</div>
                    </div>
                </div>

                <nav style={S.nav}>
                    {tabs.map(t => (
                        <button key={t.id} onClick={() => setTab(t.id)}
                            style={{ ...S.navBtn, ...(tab === t.id ? S.navBtnActive : {}) }}>
                            <span style={S.navIcon}>{t.icon}</span>
                            <span style={{ flex: 1 }}>{t.label}</span>
                            {t.count !== undefined && (
                                <span style={{ ...S.badge, ...(tab === t.id ? S.badgeActive : {}) }}>{t.count}</span>
                            )}
                        </button>
                    ))}
                </nav>

                <div style={S.sideFooter}>
                    <div style={S.adminChip}>
                        <div style={S.adminAvatar}>{user?.firstName?.[0]}{user?.lastName?.[0]}</div>
                        <div>
                            <div style={S.adminName}>{user?.firstName} {user?.lastName}</div>
                            <div style={S.adminRole}>Administrator</div>
                        </div>
                    </div>
                    <button onClick={handleLogout} style={S.logoutBtn}>Sign out</button>
                </div>
            </div>

            {/* Main */}
            <div style={S.main}>
                {/* Header */}
                <div style={S.header}>
                    <div>
                        <h1 style={S.pageTitle}>
                            {tab === 'overview' && 'Dashboard Overview'}
                            {tab === 'users' && 'User Management'}
                            {tab === 'workouts' && 'All Workouts'}
                            {tab === 'ai' && 'AI Recommendations'}
                        </h1>
                        <p style={S.pageSubtitle}>FitTrack Admin Panel · Real-time data</p>
                    </div>
                    <button onClick={fetchAll} style={S.refreshBtn}>↻ Refresh</button>
                </div>

                {error && <div style={S.errorBanner}>{error}</div>}

                {loading ? (
                    <div style={S.loadingWrap}>
                        <div style={S.spinner}></div>
                        <p style={{ color: '#94a3b8', marginTop: 16 }}>Loading data...</p>
                    </div>
                ) : (
                    <div style={S.content}>

                        {/* OVERVIEW TAB */}
                        {tab === 'overview' && (
                            <div>
                                <div style={S.statsGrid}>
                                    <div style={{ ...S.statCard, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                                        <div style={S.statIcon}>👥</div>
                                        <div style={S.statValue}>{users.length}</div>
                                        <div style={S.statLabel}>Total Users</div>
                                    </div>
                                    <div style={{ ...S.statCard, background: 'linear-gradient(135deg, #f59e0b, #ef4444)' }}>
                                        <div style={S.statIcon}>💪</div>
                                        <div style={S.statValue}>{workouts.length}</div>
                                        <div style={S.statLabel}>Total Workouts</div>
                                    </div>
                                    <div style={{ ...S.statCard, background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                                        <div style={S.statIcon}>🤖</div>
                                        <div style={S.statValue}>{recommendations.length}</div>
                                        <div style={S.statLabel}>AI Recommendations</div>
                                    </div>
                                    <div style={{ ...S.statCard, background: 'linear-gradient(135deg, #0ea5e9, #6366f1)' }}>
                                        <div style={S.statIcon}>🔥</div>
                                        <div style={S.statValue}>
                                            {workouts.reduce((sum, w) => sum + (w.caloriesBurned || 0), 0).toLocaleString()}
                                        </div>
                                        <div style={S.statLabel}>Total Calories Burned</div>
                                    </div>
                                </div>

                                <div style={S.twoCol}>
                                    <div style={S.panel}>
                                        <div style={S.panelHeader}>Recent Users</div>
                                        {users.slice(0, 5).map(u => (
                                            <div key={u.id} style={S.listItem}>
                                                <div style={{ ...S.avatar, background: `hsl(${u.email.length * 30}, 70%, 60%)` }}>
                                                    {u.firstName?.[0]}{u.lastName?.[0] || ''}
                                                </div>
                                                <div>
                                                    <div style={S.itemName}>{u.firstName} {u.lastName}</div>
                                                    <div style={S.itemSub}>{u.email}</div>
                                                </div>
                                                <span style={{ ...S.pill, background: u.role === 'ADMIN' ? 'rgba(99,102,241,0.15)' : 'rgba(16,185,129,0.15)', color: u.role === 'ADMIN' ? '#818cf8' : '#34d399' }}>
                                                    {u.role}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                    <div style={S.panel}>
                                        <div style={S.panelHeader}>Recent Workouts</div>
                                        {workouts.slice(0, 5).map(w => (
                                            <div key={w.id} style={S.listItem}>
                                                <div style={{ ...S.avatar, background: 'linear-gradient(135deg,#f59e0b,#ef4444)' }}>💪</div>
                                                <div style={{ flex: 1 }}>
                                                    <div style={S.itemName}>{w.title}</div>
                                                    <div style={S.itemSub}>{w.durationMinutes} min · {w.caloriesBurned} kcal</div>
                                                </div>
                                                <span style={{ ...S.pill, background: 'rgba(245,158,11,0.15)', color: '#fbbf24' }}>{w.type}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* USERS TAB */}
                        {tab === 'users' && (
                            <div style={S.panel}>
                                <div style={S.panelHeader}>All Registered Users ({users.length})</div>
                                <table style={S.table}>
                                    <thead>
                                        <tr>
                                            {['User', 'Email', 'Goal', 'Age', 'Role', 'Actions'].map(h => (
                                                <th key={h} style={S.th}>{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map(u => (
                                            <tr key={u.id} style={S.tr}>
                                                <td style={S.td}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                        <div style={{ ...S.avatar, background: `hsl(${u.email.length * 30}, 70%, 55%)`, fontSize: 12 }}>
                                                            {u.firstName?.[0]}{u.lastName?.[0] || ''}
                                                        </div>
                                                        <span style={{ color: '#e2e8f0', fontWeight: 500 }}>{u.firstName} {u.lastName}</span>
                                                    </div>
                                                </td>
                                                <td style={{ ...S.td, color: '#94a3b8' }}>{u.email}</td>
                                                <td style={S.td}>
                                                    <span style={{ ...S.pill, background: 'rgba(14,165,233,0.15)', color: '#38bdf8' }}>
                                                        {u.fitnessGoal?.replace('_', ' ') || '—'}
                                                    </span>
                                                </td>
                                                <td style={{ ...S.td, color: '#94a3b8' }}>{u.age || '—'}</td>
                                                <td style={S.td}>
                                                    <span style={{ ...S.pill, background: u.role === 'ADMIN' ? 'rgba(99,102,241,0.2)' : 'rgba(16,185,129,0.15)', color: u.role === 'ADMIN' ? '#818cf8' : '#34d399' }}>
                                                        {u.role}
                                                    </span>
                                                </td>
                                                <td style={S.td}>
                                                    {u.role !== 'ADMIN' && (
                                                        confirmDelete === u.id ? (
                                                            <div style={{ display: 'flex', gap: 6 }}>
                                                                <button onClick={() => handleDelete(u.id)} style={S.confirmBtn} disabled={deletingId === u.id}>
                                                                    {deletingId === u.id ? '...' : 'Confirm'}
                                                                </button>
                                                                <button onClick={() => setConfirmDelete(null)} style={S.cancelBtn}>Cancel</button>
                                                            </div>
                                                        ) : (
                                                            <button onClick={() => setConfirmDelete(u.id)} style={S.deleteBtn}>🗑 Delete</button>
                                                        )
                                                    )}
                                                    {u.role === 'ADMIN' && <span style={{ color: '#475569', fontSize: 12 }}>Protected</span>}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {users.length === 0 && <div style={S.empty}>No users registered yet.</div>}
                            </div>
                        )}

                        {/* WORKOUTS TAB */}
                        {tab === 'workouts' && (
                            <div style={S.panel}>
                                <div style={S.panelHeader}>All Workouts ({workouts.length})</div>
                                <table style={S.table}>
                                    <thead>
                                        <tr>
                                            {['Workout', 'User ID', 'Type', 'Duration', 'Calories', 'Status'].map(h => (
                                                <th key={h} style={S.th}>{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {workouts.map(w => (
                                            <tr key={w.id} style={S.tr}>
                                                <td style={{ ...S.td, color: '#e2e8f0', fontWeight: 500 }}>{w.title}</td>
                                                <td style={{ ...S.td, color: '#94a3b8', fontSize: 11 }}>{w.userId?.slice(0, 12)}...</td>
                                                <td style={S.td}>
                                                    <span style={{ ...S.pill, background: 'rgba(245,158,11,0.15)', color: '#fbbf24' }}>{w.type || '—'}</span>
                                                </td>
                                                <td style={{ ...S.td, color: '#94a3b8' }}>{w.durationMinutes ? `${w.durationMinutes} min` : '—'}</td>
                                                <td style={{ ...S.td, color: '#f87171' }}>{w.caloriesBurned ? `${w.caloriesBurned} kcal` : '—'}</td>
                                                <td style={S.td}>
                                                    <span style={{ ...S.pill, background: 'rgba(16,185,129,0.15)', color: '#34d399' }}>{w.status}</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {workouts.length === 0 && <div style={S.empty}>No workouts logged yet.</div>}
                            </div>
                        )}

                        {/* AI TAB */}
                        {tab === 'ai' && (
                            <div>
                                <div style={S.panelHeader}>All AI Recommendations ({recommendations.length})</div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 12 }}>
                                    {recommendations.map(r => (
                                        <div key={r.id} style={S.aiCard}>
                                            <div style={S.aiCardHeader}>
                                                <div style={S.aiIcon}>🤖</div>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ color: '#e2e8f0', fontWeight: 600, fontSize: 14 }}>
                                                        AI Recommendation
                                                    </div>
                                                    <div style={{ color: '#64748b', fontSize: 11, marginTop: 2 }}>
                                                        User: {r.userId?.slice(0, 16)}... · Workout: {r.workoutId?.slice(0, 12)}...
                                                    </div>
                                                </div>
                                                <span style={{ ...S.pill, background: 'rgba(99,102,241,0.15)', color: '#818cf8' }}>AI GENERATED</span>
                                            </div>
                                            <div style={S.aiText}>{r.recommendation || r.content || 'No content available'}</div>
                                        </div>
                                    ))}
                                    {recommendations.length === 0 && <div style={S.empty}>No AI recommendations generated yet.</div>}
                                </div>
                            </div>
                        )}

                    </div>
                )}
            </div>

            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
                ::-webkit-scrollbar { width: 6px; }
                ::-webkit-scrollbar-track { background: #0f172a; }
                ::-webkit-scrollbar-thumb { background: #334155; border-radius: 3px; }
            `}</style>
        </div>
    );
}

const S = {
    root: { display: 'flex', minHeight: '100vh', background: '#0f172a', fontFamily: 'system-ui, -apple-system, sans-serif', color: '#e2e8f0' },
    sidebar: { width: 240, background: '#1e293b', borderRight: '1px solid #334155', display: 'flex', flexDirection: 'column', flexShrink: 0 },
    logo: { display: 'flex', alignItems: 'center', gap: 12, padding: '24px 20px', borderBottom: '1px solid #334155' },
    logoIcon: { width: 40, height: 40, borderRadius: 10, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 14, color: '#fff' },
    logoText: { fontWeight: 700, fontSize: 16, color: '#f1f5f9' },
    logoBadge: { fontSize: 9, fontWeight: 700, letterSpacing: 2, color: '#818cf8', background: 'rgba(99,102,241,0.15)', padding: '2px 6px', borderRadius: 4, display: 'inline-block', marginTop: 2 },
    nav: { flex: 1, padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: 4 },
    navBtn: { display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 8, border: 'none', background: 'transparent', color: '#64748b', fontSize: 13, fontWeight: 500, cursor: 'pointer', width: '100%', textAlign: 'left', transition: 'all 0.15s' },
    navBtnActive: { background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.2))', color: '#a5b4fc', borderLeft: '3px solid #6366f1' },
    navIcon: { fontSize: 16, width: 18, textAlign: 'center' },
    badge: { background: '#334155', color: '#94a3b8', fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 10 },
    badgeActive: { background: 'rgba(99,102,241,0.3)', color: '#a5b4fc' },
    sideFooter: { padding: '16px 12px', borderTop: '1px solid #334155' },
    adminChip: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 },
    adminAvatar: { width: 34, height: 34, borderRadius: 8, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#fff', flexShrink: 0 },
    adminName: { fontSize: 12, fontWeight: 600, color: '#e2e8f0' },
    adminRole: { fontSize: 10, color: '#818cf8' },
    logoutBtn: { width: '100%', padding: '8px', border: '1px solid #334155', borderRadius: 7, background: 'transparent', color: '#64748b', fontSize: 12, cursor: 'pointer' },
    main: { flex: 1, overflow: 'auto', padding: '28px 32px' },
    header: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 },
    pageTitle: { fontSize: 26, fontWeight: 700, color: '#f1f5f9', marginBottom: 4 },
    pageSubtitle: { fontSize: 12, color: '#475569' },
    refreshBtn: { padding: '8px 16px', background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 8, color: '#818cf8', fontSize: 13, cursor: 'pointer' },
    errorBanner: { background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '12px 16px', color: '#f87171', fontSize: 13, marginBottom: 20 },
    loadingWrap: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 300 },
    spinner: { width: 40, height: 40, border: '3px solid #334155', borderTop: '3px solid #6366f1', borderRadius: '50%', animation: 'spin 0.8s linear infinite' },
    content: {},
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 },
    statCard: { borderRadius: 14, padding: '20px', color: '#fff', position: 'relative', overflow: 'hidden' },
    statIcon: { fontSize: 24, marginBottom: 12 },
    statValue: { fontSize: 32, fontWeight: 800, lineHeight: 1 },
    statLabel: { fontSize: 12, opacity: 0.8, marginTop: 6 },
    twoCol: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 },
    panel: { background: '#1e293b', border: '1px solid #334155', borderRadius: 14, padding: '20px', marginBottom: 16 },
    panelHeader: { fontSize: 13, fontWeight: 700, color: '#94a3b8', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 16 },
    listItem: { display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid #1e293b' },
    avatar: { width: 34, height: 34, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#fff', flexShrink: 0 },
    itemName: { fontSize: 13, fontWeight: 600, color: '#e2e8f0' },
    itemSub: { fontSize: 11, color: '#64748b', marginTop: 1 },
    pill: { padding: '3px 9px', borderRadius: 20, fontSize: 10, fontWeight: 700, letterSpacing: 0.5, whiteSpace: 'nowrap' },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#64748b', letterSpacing: 1, textTransform: 'uppercase', padding: '0 12px 12px 0', borderBottom: '1px solid #334155' },
    tr: { borderBottom: '1px solid #1e293b' },
    td: { padding: '13px 12px 13px 0', fontSize: 13, verticalAlign: 'middle' },
    deleteBtn: { padding: '5px 12px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 6, color: '#f87171', fontSize: 11, cursor: 'pointer' },
    confirmBtn: { padding: '5px 10px', background: 'rgba(239,68,68,0.2)', border: '1px solid #ef4444', borderRadius: 6, color: '#f87171', fontSize: 11, cursor: 'pointer' },
    cancelBtn: { padding: '5px 10px', background: '#334155', border: 'none', borderRadius: 6, color: '#94a3b8', fontSize: 11, cursor: 'pointer' },
    empty: { textAlign: 'center', color: '#475569', padding: '40px 0', fontSize: 14 },
    aiCard: { background: '#1e293b', border: '1px solid #334155', borderRadius: 12, padding: '16px' },
    aiCardHeader: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 },
    aiIcon: { width: 36, height: 36, borderRadius: 8, background: 'rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 },
    aiText: { fontSize: 13, color: '#94a3b8', lineHeight: 1.7, background: '#0f172a', borderRadius: 8, padding: '12px 14px' },
};
