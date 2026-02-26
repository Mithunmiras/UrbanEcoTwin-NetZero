import { useState, useEffect } from 'react';
import { api } from '../api/client';
import { useStateContext } from '../context/StateContext';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, BarChart, Bar, Cell
} from 'recharts';
import { BrainCircuit, Cpu, GitMerge, Activity, Search, Globe2 } from 'lucide-react';

export default function Predictions() {
  const { selectedState, stateName } = useStateContext();
  const [selectedZone, setSelectedZone] = useState(null);
  const [data, setData] = useState(null);
  const [optimizeData, setOptimizeData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setSelectedZone(null);
    Promise.all([
      api.getPredictions(undefined, selectedState),
      api.getOptimize(undefined, undefined, selectedState)
    ]).then(([predRes, optRes]) => {
      setData(predRes);
      setOptimizeData(optRes);
      if (predRes.predictions?.length > 0) {
        setSelectedZone(predRes.predictions[0].zone_id);
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [selectedState]);

  const predictions = data?.predictions || [];
  const current = selectedZone ? predictions.find(p => p.zone_id === selectedZone) : null;
  const currentOpt = optimizeData?.optimization_results?.find(o => o.zone_id === selectedZone);

  if (loading) return <div className="loading"><div className="loading-spinner"></div><p>Loading predictions for {stateName}...</p></div>;
  if (!data || predictions.length === 0) return <div className="loading"><p>No prediction data available.</p></div>;

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 40px)' }}>
      {/* Header spanning full width */}
      <div className="page-header" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <h1 style={{ margin: 0 }}><BrainCircuit size={28} style={{ color: '#3b82f6' }} /> {stateName} — Advanced Predictions</h1>
        </div>
      </div>

      {/* Two-column layout container */}
      <div style={{ display: 'flex', gap: 24, flex: 1, minHeight: 0 }}>

        {/* Left Sidebar: Zone List */}
        <div style={{
          width: '320px',
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(0,0,0,0.05)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden'
        }}>
          <div style={{ padding: '16px', borderBottom: '1px solid rgba(0,0,0,0.05)', background: 'rgba(0,0,0,0.2)' }}>
            <h3 style={{ margin: 0, fontSize: 14, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Regions Monitored ({predictions.length})</h3>
          </div>

          <div style={{ overflowY: 'auto', flex: 1, padding: '12px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {predictions.map(p => {
              const isSelected = selectedZone === p.zone_id;
              return (
                <div
                  key={p.zone_id}
                  onClick={() => setSelectedZone(p.zone_id)}
                  style={{
                    cursor: 'pointer',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    borderLeft: `4px solid ${p.risk_trend === 'increasing' ? '#f97316' : '#22c55e'}`,
                    background: isSelected ? 'rgba(59,130,246,0.1)' : 'rgba(0,0,0,0.02)',
                    border: isSelected ? '1px solid rgba(59,130,246,0.3)' : '1px solid transparent',
                    borderLeftColor: p.risk_trend === 'increasing' ? '#f97316' : '#22c55e',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = 'rgba(0,0,0,0.05)'; }}
                  onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = 'rgba(0,0,0,0.02)'; }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <h4 style={{ fontSize: 14, fontWeight: isSelected ? 700 : 500, margin: 0, color: isSelected ? '#0f172a' : 'var(--text-primary)' }}>{p.zone_name}</h4>
                    <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: '4px', background: p.risk_trend === 'increasing' ? 'rgba(249,115,22,0.15)' : 'rgba(34,197,94,0.15)', color: p.risk_trend === 'increasing' ? '#f97316' : '#22c55e', whiteSpace: 'nowrap' }}>
                      {p.risk_trend === 'increasing' ? 'Rising ↗' : 'Declining ↘'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                    <span style={{ color: 'var(--text-muted)' }}>CO₂: <strong style={{ color: '#475569' }}>{p.current_co2_ppm}</strong></span>
                    <span style={{ color: 'var(--text-muted)' }}>+24h: <strong style={{ color: '#3b82f6' }}>{p.predictions['24_hour']?.predicted_co2_ppm}</strong></span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Main Content: Data & Visualizations */}
        <div style={{ flex: 1, overflowY: 'auto', paddingRight: '8px', paddingBottom: '20px' }}>
          {current ? (
            <div className="fade-in">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                <div>
                  <h2 style={{ fontSize: 28, fontWeight: 800, margin: '0 0 4px 0' }}>{current.zone_name}</h2>
                </div>
                <div style={{ textAlign: 'right', background: 'rgba(255,255,255,0.03)', padding: '12px 16px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.05)' }}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>Spatial Lag (Neighbor Bleed)</div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: current.spatial_lag_impact > 0 ? '#ef4444' : '#22c55e' }}>
                    {current.spatial_lag_impact > 0 ? '+' : ''}{current.spatial_lag_impact} <span style={{ fontSize: 14 }}>ppm</span>
                  </div>
                </div>
              </div>

              {/* Prediction Cards */}
              <div className="card-grid" style={{ marginBottom: 24 }}>
                <div className="card metric-card blue" style={{ background: 'rgba(59,130,246,0.05)', borderTop: '3px solid #3b82f6' }}>
                  <div className="metric-label">1-Hour Prediction (Stacking)</div>
                  <div className="metric-value">{current.predictions['1_hour']?.predicted_co2_ppm} <span style={{ fontSize: 16, color: 'var(--text-muted)' }}>ppm</span></div>
                  <div className="metric-change up" style={{ color: '#ef4444' }}>+{current.predictions['1_hour']?.change_ppm} ppm increase</div>
                </div>

                <div className="card metric-card green" style={{ background: 'rgba(34,197,94,0.05)', borderTop: '3px solid #22c55e' }}>
                  <div className="metric-label">RL-Optimized Outcome (1hr)</div>
                  <div className="metric-value" style={{ color: '#22c55e' }}>{current.predictions['1_hour']?.rl_optimized_co2_ppm} <span style={{ fontSize: 16, color: 'var(--text-muted)' }}>ppm</span></div>
                  <div className="metric-change down" style={{ color: '#22c55e' }}>
                    {current.predictions['1_hour']?.rl_action}
                  </div>
                </div>

                <div className="card metric-card purple" style={{ background: 'rgba(168,85,247,0.05)', borderTop: '3px solid #a855f7' }}>
                  <div className="metric-label">24-Hour Prediction (Stacking)</div>
                  <div className="metric-value">{current.predictions['24_hour']?.predicted_co2_ppm} <span style={{ fontSize: 16, color: 'var(--text-muted)' }}>ppm</span></div>
                  <div className="metric-change up" style={{ color: '#ef4444' }}>+{current.predictions['24_hour']?.change_ppm} ppm • {current.risk_trend}</div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: 24 }}>
                {/* ML vs RL Chart */}
                <div className="card chart-card">
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Activity size={18} color="#3b82f6" /> 24-Hour CO₂ Forecast: Raw ML vs RL Policy
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={current.hourly_forecast} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="rawCo2" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="rlCo2" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                      <XAxis dataKey="hour_offset" stroke="#64748b" fontSize={11} tickMargin={8} />
                      <YAxis stroke="#64748b" fontSize={11} domain={['auto', 'auto']} />
                      <Tooltip contentStyle={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 10, color: '#0f172a' }} />
                      <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                      <Area type="monotone" dataKey="raw_co2_ppm" name="ML Prediction" stroke="#ef4444" fillOpacity={1} fill="url(#rawCo2)" strokeWidth={2} />
                      <Area type="monotone" dataKey="rl_optimized_co2_ppm" name="RL Optimized Policy" stroke="#22c55e" fillOpacity={1} fill="url(#rlCo2)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* SHAP Explainability */}
                <div className="card chart-card">
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Search size={18} color="#c084fc" /> ML Explainability (SHAP)
                  </h3>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 20 }}>
                    Feature impact on ensemble output.
                  </p>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={current.shap_values} layout="vertical" margin={{ left: 50, right: 10, top: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                      <XAxis type="number" stroke="#64748b" fontSize={11} />
                      <YAxis dataKey="feature" type="category" stroke="#64748b" fontSize={11} width={130} />
                      <Tooltip
                        contentStyle={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 10, color: '#0f172a' }}
                        formatter={(v, name, props) => [`${v > 0 ? '+' : ''}${v.toFixed(1)} ppm`, 'Impact on Prediction']}
                      />
                      <Bar dataKey="shap_value" radius={[0, 4, 4, 0]} barSize={24}>
                        {current.shap_values.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.shap_value >= 0 ? '#ef4444' : '#22c55e'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* RL Optimizer Strategy for Active Zone */}
              {currentOpt && (
                <div className="card" style={{ marginTop: 24 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <div>
                      <h3 style={{ fontSize: 18, display: 'flex', alignItems: 'center', gap: 8, margin: 0 }}>
                        <Cpu size={20} color="#22c55e" /> Recommended RL Policy for {current.zone_name}
                      </h3>
                      <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                        RL iterations: {currentOpt.rl_iterations} • Convergence: {currentOpt.convergence_score}
                      </span>
                    </div>
                    <span style={{ padding: '6px 12px', fontSize: 12, fontWeight: 600, background: 'rgba(34,197,94,0.1)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 20 }}>
                      Best: {currentOpt.best_strategy?.strategy_name}
                    </span>
                  </div>

                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={currentOpt.all_strategies} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                      <XAxis type="number" stroke="#64748b" fontSize={12} />
                      <YAxis type="category" dataKey="strategy_name" stroke="#64748b" fontSize={11} width={160} />
                      <Tooltip contentStyle={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 10, color: '#0f172a' }} />
                      <Bar dataKey="reduction_pct" radius={[0, 6, 6, 0]}>
                        {currentOpt.all_strategies?.map((s, i) => (
                          <Cell key={i} fill={i === 0 ? '#22c55e' : '#3b82f6'} fillOpacity={i === 0 ? 1 : 0.5} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>

                  <div style={{ marginTop: 12, padding: 16, background: 'rgba(34,197,94,0.05)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(34,197,94,0.15)' }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent-green)', marginBottom: 4 }}>
                      🏆 Best Strategy: {currentOpt.best_strategy?.strategy_name}
                    </div>
                    <div style={{ fontSize: 13, color: '#0f172a', fontWeight: 500, marginBottom: 4 }}>
                      Action Plan: {currentOpt.best_strategy?.description}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                      Reduction: {currentOpt.best_strategy?.reduction_pct}% • Cost: ₹{currentOpt.best_strategy?.estimated_cost_inr?.toLocaleString()} • Efficiency: {currentOpt.best_strategy?.efficiency_score}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
              <BrainCircuit size={64} opacity={0.2} style={{ marginBottom: 16 }} />
              <p>Select a zone from the sidebar to view advanced AI predictions</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
