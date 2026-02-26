import { useState, useEffect } from 'react';
import { api } from '../api/client';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, BarChart, Bar, Cell
} from 'recharts';
import { BrainCircuit, Cpu, GitMerge, Activity, Search, Globe2, Landmark, Building2 } from 'lucide-react';

const GatewayOfIndiaIcon = ({ size = 24, color = "currentColor", ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill={color}
    {...props}
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="8" y="85" width="84" height="10" />
    <rect x="12" y="55" width="76" height="5" />
    <path fillRule="evenodd" clipRule="evenodd" d="M12 60 H35 V85 H12 Z M18 85 H29 V72 Q23.5 56 18 72 Z" />
    <path fillRule="evenodd" clipRule="evenodd" d="M65 60 H88 V85 H65 Z M71 85 H82 V72 Q76.5 56 71 72 Z" />
    <path fillRule="evenodd" clipRule="evenodd" d="M35 48 H65 V85 H35 Z M42 85 H58 V70 Q50 50 42 70 Z" />
    <rect x="35" y="25" width="10" height="23" />
    <rect x="55" y="25" width="10" height="23" />
    <rect x="45" y="32" width="10" height="10" />
    <path d="M 35 25 Q 40 10 45 25 Z" />
    <path d="M 55 25 Q 60 10 65 25 Z" />
    <circle cx="40" cy="11" r="2.5" />
    <circle cx="60" cy="11" r="2.5" />
    <polygon points="5,50 35,50 35,55 12,55" />
    <polygon points="65,50 95,50 88,55 65,55" />
  </svg>
);

const CITY_LABELS = { chennai: 'Chennai', mumbai: 'Mumbai', delhi: 'Delhi' };
const CITY_ICONS = { chennai: Landmark, mumbai: GatewayOfIndiaIcon, delhi: Building2 };

export default function Predictions() {
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedZone, setSelectedZone] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    api.getCities().then(d => setCities(d.cities)).catch(() => { });
  }, []);

  useEffect(() => {
    if (!selectedCity) { setData(null); setSelectedZone(null); return; }
    setLoading(true);
    setSelectedZone(null);
    api.getPredictions().then(d => {
      const filtered = d.predictions.filter(p => p.zone_id.startsWith(selectedCity));
      setData({ ...d, predictions: filtered });

      // Auto-select the first zone
      if (filtered.length > 0) {
        setSelectedZone(filtered[0].zone_id);
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [selectedCity]);

  const predictions = data?.predictions || [];
  const current = selectedZone ? predictions.find(p => p.zone_id === selectedZone) : null;

  // ── Step 1: City Selection ──────────────────────────────────────
  if (!selectedCity) {
    return (
      <div className="fade-in">
        <div className="page-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <h1><BrainCircuit size={28} style={{ color: '#3b82f6' }} /> Advanced Predictions</h1>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginTop: 24 }}>
          {cities.map(city => {
            const IconComponent = CITY_ICONS[city.id] || Globe2;
            return (
              <div
                key={city.id}
                className="card"
                onClick={() => setSelectedCity(city.id)}
                style={{ cursor: 'pointer', textAlign: 'center', padding: '40px 24px', transition: 'all 0.3s ease', border: '1px solid rgba(255,255,255,0.06)' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = '#3b82f6'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; }}
              >
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
                  <IconComponent size={48} color="#94a3b8" />
                </div>
                <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>{city.name}</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>View AI predictions for {city.name} zones</p>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ── Step 2: Zone Selection & Details Layout ─────────────────────
  if (loading) return <div className="loading"><div className="loading-spinner"></div><p>Loading predictions...</p></div>;
  if (!data || predictions.length === 0) return <div className="loading"><p>No prediction data available.</p></div>;

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 40px)' }}>
      {/* Header spanning full width */}
      <div className="page-header" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => setSelectedCity(null)} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 8, padding: '6px 14px', color: '#94a3b8', cursor: 'pointer', fontSize: 13 }}>← Change City</button>
          <h1 style={{ margin: 0 }}>{CITY_LABELS[selectedCity]} Advanced Predictions</h1>
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
