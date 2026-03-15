// Workouts.jsx
import React, { useEffect, useState } from 'react';
import { workoutApi } from '../../services/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const TYPES = ['STRENGTH','CARDIO','HIIT','YOGA','FLEXIBILITY','SPORTS','OTHER'];

export function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const load = () => workoutApi.getAll().then(setWorkouts).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  return (
    <div className="fade-in">
      <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:32 }}>
        <div className="page-header" style={{ marginBottom:0 }}>
          <h1>WORKOUTS</h1>
          <p>Log and review your training sessions</p>
        </div>
        <button className="btn btn-primary" onClick={() => setModal(true)}>+ LOG WORKOUT</button>
      </div>
      {loading ? <div className="loading-screen"><div className="spinner" /></div>
        : workouts.length === 0 ? (
          <div className="empty-state"><span className="empty-icon">◎</span><h3>No workouts yet</h3><p>Log your first session to begin tracking</p></div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {workouts.map(w => <WorkoutCard key={w.id} w={w} onDelete={() => workoutApi.delete(w.id).then(() => { toast.success('Deleted'); load(); })} />)}
          </div>
        )}
      {modal && <WorkoutModal onClose={() => setModal(false)} onSave={() => { setModal(false); load(); }} />}
    </div>
  );
}

function WorkoutCard({ w, onDelete }) {
  const [open, setOpen] = useState(false);
  const type = w.workoutType?.toLowerCase() || 'other';
  return (
    <div className="card" style={{ cursor:'pointer' }}>
      <div style={{ display:'flex', alignItems:'center', gap:14 }} onClick={() => setOpen(!open)}>
        <div style={{ flex:1 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:4 }}>
            <h3 style={{ fontFamily:"'Syne', sans-serif", fontSize:16, fontWeight:700 }}>{w.workoutName}</h3>
            <span className={`badge badge-${type}`}>{w.workoutType}</span>
          </div>
          <div style={{ display:'flex', gap:16, fontSize:11, color:'#50505f', letterSpacing:0.3 }}>
            <span>{w.workoutDate}</span>
            {w.durationMinutes && <span>{w.durationMinutes} min</span>}
            {w.caloriesBurned && <span>{w.caloriesBurned} kcal</span>}
            {w.exercises?.length > 0 && <span>{w.exercises.length} exercises</span>}
          </div>
        </div>
        <button className="btn btn-danger" style={{ padding:'5px 10px', fontSize:10 }} onClick={e => { e.stopPropagation(); if(window.confirm('Delete?')) onDelete(); }}>DEL</button>
        <span style={{ color:'#50505f', fontSize:12 }}>{open ? '▲' : '▼'}</span>
      </div>
      {open && w.exercises?.length > 0 && (
        <div style={{ marginTop:14, paddingTop:14, borderTop:'1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ fontSize:9, letterSpacing:1.5, color:'#30303f', marginBottom:10 }}>EXERCISES</div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(180px, 1fr))', gap:8 }}>
            {w.exercises.map((e, i) => (
              <div key={i} style={{ background:'#1a1a28', borderRadius:7, padding:'10px 12px' }}>
                <div style={{ fontSize:12, fontWeight:600, marginBottom:4 }}>{e.name}</div>
                <div style={{ fontSize:11, color:'#50505f' }}>
                  {e.sets && e.reps && <span>{e.sets}×{e.reps}</span>}
                  {e.weight && <span> @ {e.weight}kg</span>}
                  {e.distanceKm && <span>{e.distanceKm}km</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function WorkoutModal({ onClose, onSave }) {
  const [form, setForm] = useState({ workoutName:'', workoutType:'STRENGTH', workoutDate:format(new Date(),'yyyy-MM-dd'), durationMinutes:'', caloriesBurned:'', notes:'' });
  const [exs, setExs] = useState([]);
  const [loading, setLoading] = useState(false);
  const set = k => e => setForm({ ...form, [k]: e.target.value });
  const addEx = () => setExs([...exs, { name:'', sets:'', reps:'', weight:'', distanceKm:'' }]);
  const updEx = (i,k,v) => setExs(exs.map((e,j) => j===i ? {...e,[k]:v} : e));

  const save = async () => {
    if (!form.workoutName.trim()) return toast.error('Name required');
    setLoading(true);
    try {
      await workoutApi.create({ ...form, durationMinutes: form.durationMinutes ? +form.durationMinutes : null, caloriesBurned: form.caloriesBurned ? +form.caloriesBurned : null,
        exercises: exs.filter(e => e.name).map(e => ({ name:e.name, sets:e.sets?+e.sets:null, reps:e.reps?+e.reps:null, weight:e.weight?+e.weight:null, distanceKm:e.distanceKm?+e.distanceKm:null })) });
      toast.success('Workout logged!'); onSave();
    } catch { toast.error('Save failed'); } finally { setLoading(false); }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header"><h2>LOG WORKOUT</h2><button className="modal-close" onClick={onClose}>✕</button></div>
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          <div className="form-group"><label className="form-label">Workout Name *</label><input className="form-input" placeholder="Upper Body Push" value={form.workoutName} onChange={set('workoutName')} /></div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            <div className="form-group"><label className="form-label">Type</label><select className="form-input" value={form.workoutType} onChange={set('workoutType')}>{TYPES.map(t=><option key={t}>{t}</option>)}</select></div>
            <div className="form-group"><label className="form-label">Date</label><input className="form-input" type="date" value={form.workoutDate} onChange={set('workoutDate')} /></div>
            <div className="form-group"><label className="form-label">Duration (min)</label><input className="form-input" type="number" placeholder="60" value={form.durationMinutes} onChange={set('durationMinutes')} /></div>
            <div className="form-group"><label className="form-label">Calories Burned</label><input className="form-input" type="number" placeholder="400" value={form.caloriesBurned} onChange={set('caloriesBurned')} /></div>
          </div>
          <div className="form-group"><label className="form-label">Notes</label><input className="form-input" placeholder="How did it go?" value={form.notes} onChange={set('notes')} /></div>
          <div>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
              <span style={{ fontSize:10, letterSpacing:1.2, color:'#50505f' }}>EXERCISES</span>
              <button className="btn btn-ghost" style={{ padding:'4px 10px', fontSize:10 }} onClick={addEx}>+ ADD</button>
            </div>
            {exs.map((ex,i) => (
              <div key={i} style={{ background:'#1a1a28', borderRadius:8, padding:12, marginBottom:8 }}>
                <div style={{ display:'flex', gap:8, marginBottom:8, alignItems:'center' }}>
                  <input className="form-input" style={{ flex:1 }} placeholder="Exercise name" value={ex.name} onChange={e => updEx(i,'name',e.target.value)} />
                  <button onClick={() => setExs(exs.filter((_,j) => j!==i))} style={{ background:'none', border:'none', color:'#ff2d78', fontSize:14, cursor:'pointer' }}>✕</button>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:6 }}>
                  {[['sets','Sets'],['reps','Reps'],['weight','kg'],['distanceKm','km']].map(([k,p]) => (
                    <input key={k} className="form-input" style={{ fontSize:11, padding:'6px 8px' }} type="number" placeholder={p} value={ex[k]} onChange={e => updEx(i,k,e.target.value)} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>CANCEL</button>
          <button className="btn btn-primary" onClick={save} disabled={loading}>{loading ? 'SAVING...' : 'SAVE WORKOUT'}</button>
        </div>
      </div>
    </div>
  );
}
