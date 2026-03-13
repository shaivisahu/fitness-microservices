import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserWorkouts, getUserRecommendations, generateRecommendation } from '../services/api';

export default function AIPage() {
  const { user } = useAuth();
  const [workouts, setWorkouts] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [selectedWorkout, setSelectedWorkout] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!user?.id) return;
    Promise.all([getUserWorkouts(user.id), getUserRecommendations(user.id)])
      .then(([w, r]) => {
        setWorkouts(w.data || []);
        setRecommendations(r.data || []);
      }).catch(() => {}).finally(() => setFetching(false));
  }, [user]);

  const handleGenerate = async () => {
    if (!selectedWorkout) { setError('Please select a workout first.'); return; }
    setError(''); setSuccess('');
    setLoading(true);
    try {
      await generateRecommendation(user.id, selectedWorkout);
      setSuccess('AI recommendation generated! 🤖');
      const res = await getUserRecommendations(user.id);
      setRecommendations(res.data || []);
      setSelectedWorkout('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate recommendation. Check AI service and Gemini API key.');
    } finally { setLoading(false); }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">AI COACH</h1>
        <p className="page-subtitle">Powered by Google Gemini — get personalized fitness advice</p>
      </div>

      {/* Generate panel */}
      <div className="card" style={{ marginBottom: 32, borderColor: 'rgba(100,181,246,0.3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <span style={{ fontSize: 28 }}>🤖</span>
          <div>
            <div className="section-title" style={{ marginBottom: 0 }}>GENERATE RECOMMENDATION</div>
            <div style={{ fontSize: 13, color: 'var(--muted)' }}>Select a workout and get AI-powered feedback</div>
          </div>
        </div>

        {error   && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
          <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
            <label className="form-label">Select Workout</label>
            <select className="form-input" value={selectedWorkout} onChange={e => setSelectedWorkout(e.target.value)}>
              <option value="">-- Choose a workout --</option>
              {workouts.map(w => (
                <option key={w.id} value={w.id}>{w.title} ({w.type} · {w.durationMinutes}min)</option>
              ))}
            </select>
          </div>
          <button className="btn btn-primary" onClick={handleGenerate} disabled={loading || !selectedWorkout}
            style={{ padding: '11px 24px', whiteSpace: 'nowrap' }}>
            {loading ? '⏳ Generating...' : '✨ Get AI Advice'}
          </button>
        </div>

        {workouts.length === 0 && (
          <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 12 }}>
            💡 Log a workout first, then come back here for AI recommendations!
          </p>
        )}
      </div>

      {/* Recommendations list */}
      <div className="section-title">YOUR RECOMMENDATIONS ({recommendations.length})</div>

      {fetching ? <div className="centered"><div className="spinner" /></div> : (
        recommendations.length === 0 ? (
          <div className="empty-state card">
            <div className="empty-icon">🧠</div>
            <p>No recommendations yet. Generate your first one above!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {recommendations.map(rec => (
              <div key={rec.id} className="card" style={{ borderColor: 'rgba(100,181,246,0.2)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 22 }}>🤖</span>
                    <div>
                      <div style={{ fontWeight: 700 }}>AI Recommendation</div>
                      <div style={{ fontSize: 12, color: 'var(--muted)' }}>
                        {new Date(rec.createdAt).toLocaleDateString()} · Workout ID: {rec.workoutId?.slice(0, 8)}...
                      </div>
                    </div>
                  </div>
                  <span className="tag" style={{ background: 'rgba(100,181,246,0.1)', color: '#64b5f6' }}>AI GENERATED</span>
                </div>

                <div style={{ background: 'var(--bg3)', borderRadius: 8, padding: 16, marginBottom: 12 }}>
                  <div style={{ fontSize: 13, lineHeight: 1.8, whiteSpace: 'pre-wrap', color: 'var(--text)' }}>
                    {rec.aiRecommendation}
                  </div>
                </div>

                {rec.suggestedExercises?.length > 0 && (
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--muted)', marginBottom: 8 }}>
                      Quick Tips
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {rec.suggestedExercises.map((tip, i) => (
                        <span key={i} style={{
                          padding: '6px 12px', background: 'rgba(232,255,0,0.08)',
                          border: '1px solid rgba(232,255,0,0.2)', borderRadius: 20,
                          fontSize: 12, color: 'var(--accent)'
                        }}>✓ {tip}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}
