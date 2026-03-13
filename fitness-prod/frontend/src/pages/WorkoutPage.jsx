import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { logWorkout, getUserWorkouts, deleteWorkout, sendWorkoutNotification } from '../services/api';

const emptyExercise = () => ({ name: '', sets: '', reps: '', weightKg: '', durationSeconds: '', muscleGroup: 'CHEST' });

export default function WorkoutPage() {
  const { user } = useAuth();
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    title: '', type: 'STRENGTH', durationMinutes: '', caloriesBurned: '', notes: ''
  });
  const [exercises, setExercises] = useState([emptyExercise()]);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const setEx = (i, k) => (e) => {
    setExercises(ex => ex.map((x, j) => j === i ? { ...x, [k]: e.target.value } : x));
  };

  const fetchWorkouts = async () => {
    try {
      const res = await getUserWorkouts(user.id);
      setWorkouts(res.data || []);
    } catch {} finally { setFetching(false); }
  };

  useEffect(() => { if (user?.id) fetchWorkouts(); }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    setLoading(true);
    try {
      const payload = {
        userId: user.id,
        ...form,
        durationMinutes: Number(form.durationMinutes),
        caloriesBurned: Number(form.caloriesBurned),
        exercises: exercises.filter(ex => ex.name).map(ex => ({
          ...ex,
          sets: Number(ex.sets) || null,
          reps: Number(ex.reps) || null,
          weightKg: Number(ex.weightKg) || null,
          durationSeconds: Number(ex.durationSeconds) || null
        }))
      };
      await logWorkout(payload);
      // send email notification if user has email
      if (user.email) {
        await sendWorkoutNotification(user.id, user.email, form.title).catch(() => {});
      }
      setSuccess('Workout logged successfully! 💪');
      setForm({ title: '', type: 'STRENGTH', durationMinutes: '', caloriesBurned: '', notes: '' });
      setExercises([emptyExercise()]);
      setShowForm(false);
      fetchWorkouts();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to log workout.');
    } finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this workout?')) return;
    await deleteWorkout(id).catch(() => {});
    fetchWorkouts();
  };

  const muscleGroups = ['CHEST','BACK','LEGS','SHOULDERS','ARMS','CORE','FULL_BODY'];

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <h1 className="page-title">WORKOUTS</h1>
          <p className="page-subtitle">Log and track every session</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(s => !s)}>
          {showForm ? '✕ Cancel' : '+ Log Workout'}
        </button>
      </div>

      {error   && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {showForm && (
        <div className="card" style={{ marginBottom: 32 }}>
          <div className="section-title">NEW WORKOUT</div>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Title *</label>
                <input className="form-input" value={form.title} onChange={set('title')} placeholder="Morning Chest Day" required />
              </div>
              <div className="form-group">
                <label className="form-label">Type</label>
                <select className="form-input" value={form.type} onChange={set('type')}>
                  {['STRENGTH','CARDIO','FLEXIBILITY','SPORTS'].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Duration (minutes)</label>
                <input className="form-input" type="number" value={form.durationMinutes} onChange={set('durationMinutes')} placeholder="60" />
              </div>
              <div className="form-group">
                <label className="form-label">Calories Burned</label>
                <input className="form-input" type="number" value={form.caloriesBurned} onChange={set('caloriesBurned')} placeholder="450" />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Notes</label>
              <input className="form-input" value={form.notes} onChange={set('notes')} placeholder="Felt strong today..." />
            </div>

            <hr className="divider" />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div className="section-title" style={{ marginBottom: 0 }}>EXERCISES</div>
              <button type="button" className="btn btn-secondary btn-sm"
                onClick={() => setExercises(ex => [...ex, emptyExercise()])}>+ Add Exercise</button>
            </div>

            {exercises.map((ex, i) => (
              <div key={i} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8, padding: 16, marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                  <span style={{ fontWeight: 600, fontSize: 13 }}>Exercise {i + 1}</span>
                  {exercises.length > 1 && (
                    <button type="button" onClick={() => setExercises(ex => ex.filter((_, j) => j !== i))}
                      style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer', fontSize: 16 }}>✕</button>
                  )}
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Exercise Name</label>
                    <input className="form-input" value={ex.name} onChange={setEx(i, 'name')} placeholder="Bench Press" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Muscle Group</label>
                    <select className="form-input" value={ex.muscleGroup} onChange={setEx(i, 'muscleGroup')}>
                      {muscleGroups.map(m => <option key={m}>{m}</option>)}
                    </select>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
                  {[['sets','Sets'],['reps','Reps'],['weightKg','Weight (kg)'],['durationSeconds','Duration (sec)']].map(([k,l]) => (
                    <div className="form-group" key={k}>
                      <label className="form-label">{l}</label>
                      <input className="form-input" type="number" value={ex[k]} onChange={setEx(i, k)} placeholder="0" />
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <button className="btn btn-primary" type="submit" disabled={loading} style={{ marginTop: 8 }}>
              {loading ? 'Logging...' : '💪 Log Workout'}
            </button>
          </form>
        </div>
      )}

      {/* Workout list */}
      <div className="section-title">ALL WORKOUTS ({workouts.length})</div>
      {fetching ? <div className="centered"><div className="spinner" /></div> : (
        workouts.length === 0 ? (
          <div className="empty-state card">
            <div className="empty-icon">🏋️</div>
            <p>No workouts logged yet. Hit the button above!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {workouts.map(w => (
              <div key={w.id} className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                    <span style={{ fontWeight: 700, fontSize: 16 }}>{w.title}</span>
                    <span className={`tag tag-${(w.type||'strength').toLowerCase()}`}>{w.type}</span>
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--muted)', display: 'flex', gap: 16 }}>
                    <span>⏱ {w.durationMinutes} min</span>
                    <span>🔥 {w.caloriesBurned} kcal</span>
                    <span>🏋️ {w.exercises?.length || 0} exercises</span>
                  </div>
                  {w.notes && <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4, fontStyle: 'italic' }}>"{w.notes}"</div>}
                </div>
                <div style={{ fontSize: 11, color: 'var(--muted)', textAlign: 'right', minWidth: 100 }}>
                  {new Date(w.createdAt).toLocaleDateString()}
                </div>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(w.id)}>Delete</button>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}
