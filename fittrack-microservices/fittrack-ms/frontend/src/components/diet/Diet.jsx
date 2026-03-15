import React, { useEffect, useState } from 'react';
import { dietApi } from '../../services/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const MEALS = ['BREAKFAST','LUNCH','DINNER','SNACK'];
const MEAL_ICONS = { BREAKFAST:'☀️', LUNCH:'🌤️', DINNER:'🌙', SNACK:'⚡' };
const MEAL_COLORS = { BREAKFAST:'#ff6b00', LUNCH:'#c8ff00', DINNER:'#9b59ff', SNACK:'#00e5ff' };

export default function Diet() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  const load = () => {
    setLoading(true);
    dietApi.getByDate(date).then(setEntries).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, [date]);

  const del = async (id) => { await dietApi.delete(id); toast.success('Removed'); load(); };

  const totals = entries.reduce((a, e) => ({
    cal: a.cal + (e.calories||0), prot: a.prot + (e.protein||0),
    carbs: a.carbs + (e.carbohydrates||0), fat: a.fat + (e.fat||0),
  }), { cal:0, prot:0, carbs:0, fat:0 });

  const grouped = MEALS.reduce((a,m) => ({ ...a, [m]: entries.filter(e => e.mealType===m) }), {});

  return (
    <div className="fade-in">
      <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:32 }}>
        <div className="page-header" style={{ marginBottom:0 }}>
          <h1>NUTRITION</h1>
          <p>Track your daily food intake</p>
        </div>
        <div style={{ display:'flex', gap:10, alignItems:'center' }}>
          <input className="form-input" type="date" value={date} onChange={e => setDate(e.target.value)} style={{ width:160 }} />
          <button className="btn btn-primary" onClick={() => setModal(true)}>+ ADD FOOD</button>
        </div>
      </div>

      {/* Totals bar */}
      <div className="grid-4 fade-in-up" style={{ marginBottom:24 }}>
        {[
          { label:'CALORIES', value:Math.round(totals.cal), unit:'kcal', color:'#c8ff00' },
          { label:'PROTEIN', value:Math.round(totals.prot), unit:'g', color:'#00e5ff' },
          { label:'CARBS', value:Math.round(totals.carbs), unit:'g', color:'#ff6b00' },
          { label:'FAT', value:Math.round(totals.fat), unit:'g', color:'#ff2d78' },
        ].map((s,i) => (
          <div key={s.label} className="stat-card fade-in-up" style={{ animationDelay:`${i*50}ms` }}>
            <div className="stat-glow" style={{ background:s.color }} />
            <div className="stat-label">{s.label}</div>
            <div className="stat-value" style={{ color:s.color, fontSize:36 }}>{s.value}</div>
            <div className="stat-unit">{s.unit}</div>
          </div>
        ))}
      </div>

      {loading ? <div style={{ textAlign:'center', padding:40 }}><div className="spinner" style={{ margin:'0 auto' }} /></div> : (
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          {MEALS.map(meal => (
            <div key={meal} className="card fade-in-up">
              <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom: grouped[meal].length ? 16 : 0 }}>
                <div style={{ width:36, height:36, background:`${MEAL_COLORS[meal]}15`, border:`1px solid ${MEAL_COLORS[meal]}30`, borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16 }}>
                  {MEAL_ICONS[meal]}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontFamily:"'Syne', sans-serif", fontSize:14, fontWeight:800, letterSpacing:1 }}>{meal}</div>
                  {grouped[meal].length === 0 && <div style={{ fontSize:10, color:'#30303f', marginTop:2 }}>No entries</div>}
                </div>
                {grouped[meal].length > 0 && (
                  <div style={{ fontSize:13, fontWeight:600, color:MEAL_COLORS[meal], fontFamily:"'Syne', sans-serif" }}>
                    {Math.round(grouped[meal].reduce((s,e) => s+(e.calories||0), 0))} kcal
                  </div>
                )}
              </div>

              {grouped[meal].length > 0 && (
                <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                  {grouped[meal].map(e => (
                    <div key={e.id} style={{ display:'flex', alignItems:'center', gap:12, padding:'9px 12px', background:'#1a1a28', borderRadius:7 }}>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:13, fontWeight:500 }}>{e.foodName}</div>
                        <div style={{ fontSize:10, color:'#50505f', marginTop:2, letterSpacing:0.3 }}>
                          {e.servingSize && <span>{e.servingSize}{e.servingUnit} · </span>}
                          {e.protein != null && <span>P: {Math.round(e.protein)}g · </span>}
                          {e.carbohydrates != null && <span>C: {Math.round(e.carbohydrates)}g · </span>}
                          {e.fat != null && <span>F: {Math.round(e.fat)}g</span>}
                        </div>
                      </div>
                      <span style={{ fontSize:13, fontWeight:700, color:MEAL_COLORS[meal], fontFamily:"'Syne', sans-serif" }}>{Math.round(e.calories||0)}</span>
                      <button onClick={() => del(e.id)} style={{ background:'none', border:'none', color:'#30303f', cursor:'pointer', fontSize:12, padding:'2px 6px', transition:'color 0.15s' }}
                        onMouseOver={ev => ev.target.style.color='#ff2d78'}
                        onMouseOut={ev => ev.target.style.color='#30303f'}>✕</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {modal && <DietModal defaultDate={date} onClose={() => setModal(false)} onSave={() => { setModal(false); load(); }} />}
    </div>
  );
}

function DietModal({ defaultDate, onClose, onSave }) {
  const [form, setForm] = useState({
    foodName:'', entryDate:defaultDate, mealType:'BREAKFAST',
    calories:'', protein:'', carbohydrates:'', fat:'', fiber:'',
    servingSize:'', servingUnit:'g',
  });
  const [loading, setLoading] = useState(false);
  const set = k => e => setForm({...form, [k]: e.target.value});
  const num = v => v ? parseFloat(v) : null;

  const save = async () => {
    if (!form.foodName.trim()) return toast.error('Food name required');
    setLoading(true);
    try {
      await dietApi.create({ ...form, calories:num(form.calories), protein:num(form.protein), carbohydrates:num(form.carbohydrates), fat:num(form.fat), fiber:num(form.fiber), servingSize:num(form.servingSize) });
      toast.success('Food logged!'); onSave();
    } catch { toast.error('Failed to save'); } finally { setLoading(false); }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header"><h2>ADD FOOD</h2><button className="modal-close" onClick={onClose}>✕</button></div>
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          <div className="form-group"><label className="form-label">Food Name *</label><input className="form-input" placeholder="Chicken Breast" value={form.foodName} onChange={set('foodName')} /></div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            <div className="form-group"><label className="form-label">Meal</label>
              <select className="form-input" value={form.mealType} onChange={set('mealType')}>
                {MEALS.map(m => <option key={m}>{m}</option>)}
              </select>
            </div>
            <div className="form-group"><label className="form-label">Date</label><input className="form-input" type="date" value={form.entryDate} onChange={set('entryDate')} /></div>
            <div className="form-group"><label className="form-label">Serving Size</label><input className="form-input" type="number" placeholder="100" value={form.servingSize} onChange={set('servingSize')} /></div>
            <div className="form-group"><label className="form-label">Unit</label>
              <select className="form-input" value={form.servingUnit} onChange={set('servingUnit')}>
                {['g','ml','oz','cup','tbsp','piece'].map(u => <option key={u}>{u}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:10 }}>
            {[['calories','Calories'],['protein','Protein (g)'],['carbohydrates','Carbs (g)'],['fat','Fat (g)']].map(([k,l]) => (
              <div className="form-group" key={k}><label className="form-label">{l}</label><input className="form-input" type="number" placeholder="0" value={form[k]} onChange={set(k)} /></div>
            ))}
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>CANCEL</button>
          <button className="btn btn-primary" onClick={save} disabled={loading}>{loading ? 'SAVING...' : 'ADD FOOD'}</button>
        </div>
      </div>
    </div>
  );
}
