import React, { useState, useEffect } from 'react';
import { aiApi } from '../../services/api';
import toast from 'react-hot-toast';
import { format, parseISO } from 'date-fns';

const SUGGESTION_TYPES = [
  { value: 'WORKOUT_PLAN', label: '🏋️ Workout Plan', desc: 'Custom weekly training schedule', color: '#ff6b00' },
  { value: 'NUTRITION_ADVICE', label: '🥗 Nutrition Advice', desc: 'Macro targets & food recommendations', color: '#c8ff00' },
  { value: 'RECOVERY_TIP', label: '😴 Recovery Tips', desc: 'Sleep, stretching & recovery strategy', color: '#00e5ff' },
  { value: 'PROGRESS_ANALYSIS', label: '📊 Progress Analysis', desc: 'Trends, wins & 30-day goals', color: '#9b59ff' },
  { value: 'GENERAL', label: '✦ Custom Prompt', desc: 'Ask anything about your fitness', color: '#ff2d78' },
];

export default function AiCoach() {
  const [selected, setSelected] = useState(null);
  const [customPrompt, setCustomPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [histLoading, setHistLoading] = useState(true);
  const [activeResult, setActiveResult] = useState(null);
  const [remaining, setRemaining] = useState(null);

  useEffect(() => {
    aiApi.getHistory()
      .then(h => { setHistory(h); if (h.length > 0) { setActiveResult(h[0]); setRemaining(h[0].remainingRequests); } })
      .finally(() => setHistLoading(false));
  }, []);

  const generate = async () => {
    if (!selected) return toast.error('Select a suggestion type');
    if (selected === 'GENERAL' && !customPrompt.trim()) return toast.error('Enter a custom prompt');
    setLoading(true);
    try {
      const result = await aiApi.suggest({ type: selected, customPrompt: selected === 'GENERAL' ? customPrompt : null });
      setActiveResult(result);
      setRemaining(result.remainingRequests);
      setHistory(prev => [result, ...prev]);
      toast.success('AI analysis complete!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'AI service error');
    } finally { setLoading(false); }
  };

  const typeInfo = SUGGESTION_TYPES.find(t => t.value === selected);

  return (
    <div className="fade-in">
      <div className="page-header">
        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:8 }}>
          <div style={{ width:32, height:32, background:'rgba(155,89,255,0.2)', border:'1px solid rgba(155,89,255,0.4)', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16 }}>✦</div>
          <h1 style={{ fontFamily:"'Syne', sans-serif", fontSize:44, fontWeight:800, letterSpacing:-1 }}>AI COACH</h1>
        </div>
        <p>Personalized fitness intelligence powered by your actual progress data.</p>
        {remaining !== null && (
          <div style={{ marginTop:8, display:'inline-flex', alignItems:'center', gap:6, padding:'4px 10px', background:'rgba(155,89,255,0.08)', border:'1px solid rgba(155,89,255,0.2)', borderRadius:4, fontSize:10, color:'#9b59ff', letterSpacing:1 }}>
            ✦ {remaining} AI REQUESTS REMAINING TODAY
          </div>
        )}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1.4fr', gap:24, alignItems:'start' }}>
        {/* Left: Controls */}
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          <div className="card">
            <div style={sH}>SELECT ANALYSIS TYPE</div>
            <div style={{ display:'flex', flexDirection:'column', gap:8, marginTop:16 }}>
              {SUGGESTION_TYPES.map(t => (
                <button key={t.value} onClick={() => setSelected(t.value)}
                  style={{ ...typeBtn, ...(selected === t.value ? { ...typeBtnActive, borderColor: t.color, background: `${t.color}12` } : {}) }}>
                  <div style={{ fontSize:16 }}>{t.label.split(' ')[0]}</div>
                  <div style={{ flex:1, textAlign:'left' }}>
                    <div style={{ fontSize:11, fontWeight:500, color: selected === t.value ? t.color : '#f4f4fc' }}>{t.label.substring(3)}</div>
                    <div style={{ fontSize:10, color:'#50505f', marginTop:2 }}>{t.desc}</div>
                  </div>
                  {selected === t.value && <div style={{ width:6, height:6, borderRadius:'50%', background: t.color, boxShadow:`0 0 8px ${t.color}` }} />}
                </button>
              ))}
            </div>

            {selected === 'GENERAL' && (
              <div className="form-group" style={{ marginTop:14 }}>
                <label className="form-label">Your question</label>
                <textarea className="form-input" rows={3} placeholder="e.g. How should I adjust my diet for muscle gain?"
                  value={customPrompt} onChange={e => setCustomPrompt(e.target.value)}
                  style={{ resize:'vertical', lineHeight:1.6 }} />
              </div>
            )}

            <button className="btn btn-primary" onClick={generate} disabled={loading || !selected}
              style={{ width:'100%', justifyContent:'center', padding:'13px', fontSize:12, marginTop:16, letterSpacing:1.5, opacity: (!selected || loading) ? 0.5 : 1 }}>
              {loading ? (
                <><div style={{ width:14, height:14, border:'2px solid #000', borderTopColor:'transparent', borderRadius:'50%', animation:'spin 0.6s linear infinite' }} />ANALYSING...</>
              ) : '✦ GENERATE ANALYSIS'}
            </button>
          </div>

          {/* History */}
          {history.length > 0 && (
            <div className="card">
              <div style={sH}>RECENT ANALYSES</div>
              <div style={{ display:'flex', flexDirection:'column', gap:6, marginTop:12 }}>
                {history.slice(0, 5).map((h, i) => (
                  <button key={h.id} onClick={() => setActiveResult(h)}
                    style={{ ...histItem, ...(activeResult?.id === h.id ? histItemActive : {}) }}>
                    <div style={{ fontSize:11, color: activeResult?.id === h.id ? '#9b59ff' : '#f4f4fc', fontWeight:500 }}>
                      {SUGGESTION_TYPES.find(t => t.value === h.type)?.label || h.type}
                    </div>
                    <div style={{ fontSize:10, color:'#50505f', marginTop:2 }}>
                      {h.createdAt ? format(parseISO(h.createdAt), 'MMM d, h:mm a') : ''}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Result */}
        <div className="card ai-glow-border" style={{ minHeight:480 }}>
          {loading ? (
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:400, gap:16 }}>
              <div style={{ position:'relative', width:60, height:60 }}>
                <div style={{ position:'absolute', inset:0, border:'2px solid rgba(155,89,255,0.2)', borderRadius:'50%' }} />
                <div style={{ position:'absolute', inset:0, border:'2px solid transparent', borderTopColor:'#9b59ff', borderRadius:'50%', animation:'spin 0.8s linear infinite' }} />
                <div style={{ position:'absolute', inset:8, border:'2px solid transparent', borderTopColor:'#ff2d78', borderRadius:'50%', animation:'spin 1.2s linear infinite reverse' }} />
              </div>
              <div style={{ fontSize:11, color:'#9b59ff', letterSpacing:2 }}>ANALYSING YOUR DATA...</div>
              <div style={{ fontSize:10, color:'#50505f', textAlign:'center', maxWidth:240, lineHeight:1.6 }}>
                Claude AI is reviewing your workouts, nutrition & progress to craft personalized advice.
              </div>
            </div>
          ) : activeResult ? (
            <div>
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:20, paddingBottom:16, borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ padding:'4px 10px', background:'rgba(155,89,255,0.12)', border:'1px solid rgba(155,89,255,0.25)', borderRadius:4, fontSize:10, color:'#9b59ff', letterSpacing:1 }}>
                  ✦ AI ANALYSIS
                </div>
                <div style={{ fontSize:10, color:'#50505f', marginLeft:'auto' }}>
                  {activeResult.createdAt ? format(parseISO(activeResult.createdAt), 'MMM d, yyyy · h:mm a') : ''}
                </div>
              </div>
              <div style={{ fontFamily:"'Syne', sans-serif", fontSize:16, fontWeight:700, textTransform:'uppercase', letterSpacing:1, color:'#f4f4fc', marginBottom:16 }}>
                {SUGGESTION_TYPES.find(t => t.value === activeResult.type)?.label || activeResult.type}
              </div>
              <div className="ai-content">{activeResult.content}</div>
            </div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:400, gap:16, textAlign:'center' }}>
              <div style={{ fontSize:52, opacity:0.3 }}>✦</div>
              <div style={{ fontFamily:"'Syne', sans-serif", fontSize:18, fontWeight:700, color:'#50505f', textTransform:'uppercase', letterSpacing:1 }}>
                No Analysis Yet
              </div>
              <div style={{ fontSize:11, color:'#30303f', maxWidth:280, lineHeight:1.7 }}>
                Select an analysis type on the left and click Generate to get personalized AI coaching based on your actual fitness data.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const sH = { fontFamily:"'Syne', sans-serif", fontSize:11, fontWeight:800, textTransform:'uppercase', letterSpacing:1.5, color:'#f4f4fc' };
const typeBtn = {
  display:'flex', alignItems:'center', gap:10, padding:'10px 12px',
  background:'transparent', border:'1px solid rgba(255,255,255,0.06)',
  borderRadius:8, cursor:'pointer', transition:'all 0.15s', width:'100%',
};
const typeBtnActive = { background:'rgba(155,89,255,0.06)' };
const histItem = {
  display:'flex', flexDirection:'column', padding:'8px 12px',
  background:'transparent', border:'1px solid rgba(255,255,255,0.05)',
  borderRadius:7, cursor:'pointer', transition:'all 0.15s', textAlign:'left',
};
const histItemActive = {
  background:'rgba(155,89,255,0.08)',
  borderColor:'rgba(155,89,255,0.25)',
};
