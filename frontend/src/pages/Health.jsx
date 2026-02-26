import { useState, useEffect } from 'react';
import { api } from '../api/client';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Cell
} from 'recharts';
import { HeartPulse, Globe2, Landmark, Building2 } from 'lucide-react';

const CITY_OPTIONS = [
  { id: '', label: 'All Cities', icon: Globe2 },
  { id: 'chennai', label: 'Chennai', icon: Landmark },
  { id: 'coimbatore', label: 'Coimbatore', icon: Building2 },
  { id: 'madurai', label: 'Madurai', icon: Building2 },
];

export default function Health() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedZone, setSelectedZone] = useState(null);

  useEffect(() => {
    setLoading(true);
    api.getHealth().then(d => { setData(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading"><div className="loading-spinner"></div><p>Analyzing health impact with ML models...</p></div>;
  if (!data) return <div className="loading"><p>Failed to load data.</p></div>;

  // Filter by city
  const filtered = selectedCity
    ? data.health_impact_analysis.filter(z => z.city === selectedCity)
    : data.health_impact_analysis;

  const current = selectedZone ? filtered.find(z => z.zone_id === selectedZone) : null;

  return (
    <div className="fade-in">
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <h1><HeartPulse size={28} style={{ color: '#ef4444' }} /> ML Health Impact Predictor</h1>
          <span className="live-badge live"><span className="live-dot"></span>Live Data</span>
        </div>
      </div>

      {/* City filter */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {CITY_OPTIONS.map(opt => {
          const Icon = opt.icon;
          return (
            <button key={opt.id} onClick={() => { setSelectedCity(opt.id); setSelectedZone(null); }}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '6px 16px', borderRadius: 8, fontSize: 13, cursor: 'pointer',
                border: selectedCity === opt.id ? '1px solid #3b82f6' : '1px solid rgba(0,0,0,0.08)',
                background: selectedCity === opt.id ? 'rgba(59,130,246,0.15)' : 'rgba(0,0,0,0.04)',
                color: selectedCity === opt.id ? '#60a5fa' : '#94a3b8',
                fontWeight: selectedCity === opt.id ? 600 : 400,
              }}
            >
              <Icon size={16} />
              {opt.label}
            </button>
          );
        })}
      </div>

      {/* Summary cards */}
      <div className="card-grid" style={{ marginBottom: 24 }}>
        <div className="card metric-card blue">
          <div className="metric-label">Avg Risk Score</div>
          <div className="metric-value" style={{ fontSize: 28 }}>{data.summary?.avg_risk_score}</div>
          <div className="metric-change">/ 100 (ML ensemble)</div>
        </div>
        <div className="card metric-card orange">
          <div className="metric-label">Max Risk Score</div>
          <div className="metric-value" style={{ fontSize: 28, color: '#ef4444' }}>{data.summary?.max_risk_score}</div>
          <div className="metric-change">{data.summary?.highest_risk_zone}</div>
        </div>
        <div className="card metric-card green" style={{ borderTop: '3px solid #ef4444' }}>
          <div className="metric-label">Severe Zones</div>
          <div className="metric-value" style={{ fontSize: 28, color: '#ef4444' }}>{data.summary?.severe_zones}</div>
          <div className="metric-change">out of {data.summary?.total_zones} zones</div>
        </div>
      </div>

      {/* Zone detail panel */}
      {current && (
        <div className="card" style={{ marginBottom: 24, borderLeft: `4px solid ${current.health_risk?.color}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <button onClick={() => setSelectedZone(null)}
                style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', fontSize: 13, padding: 0, marginBottom: 6 }}>
                ← Back to all zones
              </button>
              <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>{current.zone_name}</h2>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                AQI: {current.current_aqi} • CO₂: {current.current_co2_ppm} ppm • {current.avg_temperature_c?.toFixed(1)}°C • via {current.api_source}
              </span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 36, fontWeight: 800, color: current.health_risk?.color }}>{current.risk_score}</div>
              <span className="badge" style={{ background: `${current.health_risk?.color}20`, color: current.health_risk?.color }}>
                {current.health_risk?.level}
              </span>
            </div>
          </div>

          {/* Advisory */}
          <div style={{ padding: 14, borderRadius: 10, background: `${current.health_risk?.color}08`, marginBottom: 20 }}>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 6 }}>{current.health_risk?.description}</p>
            <p style={{ fontSize: 12, color: current.health_risk?.color, fontWeight: 600 }}>💡 {current.health_risk?.advisory}</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
            {/* Condition Predictions */}
            <div>
              <h4 style={{ fontSize: 14, marginBottom: 12, color: 'var(--text-muted)' }}>🧠 ML Condition Predictions</h4>
              {current.condition_predictions?.map((c, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 13 }}>{c.condition}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: c.severity_color }}>{c.probability_pct}%</span>
                    </div>
                    <div style={{ height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${c.probability_pct}%`, background: c.severity_color, borderRadius: 3, transition: 'width 0.5s ease' }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pollutant Chart */}
            <div>
              <h4 style={{ fontSize: 14, marginBottom: 12, color: 'var(--text-muted)' }}>📊 Pollutant Levels vs WHO Limits</h4>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={current.pollutant_data} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                  <XAxis type="number" stroke="#64748b" fontSize={11} />
                  <YAxis type="category" dataKey="name" stroke="#64748b" fontSize={11} width={80} />
                  <Tooltip contentStyle={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 10, color: '#0f172a' }} />
                  <Bar dataKey="normalized" name="Risk %" radius={[0, 4, 4, 0]}>
                    {current.pollutant_data?.map((entry, idx) => (
                      <Cell key={idx} fill={entry.normalized > 75 ? '#ef4444' : entry.normalized > 50 ? '#f97316' : entry.normalized > 25 ? '#eab308' : '#22c55e'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* WHO Compliance */}
          <h4 style={{ fontSize: 14, marginTop: 20, marginBottom: 12, color: 'var(--text-muted)' }}>🏥 WHO Guideline Compliance ({current.who_violations} violations)</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10 }}>
            {current.who_compliance?.map((w, i) => (
              <div key={i} style={{ padding: '10px 14px', borderRadius: 8, background: 'rgba(255,255,255,0.03)', border: `1px solid ${w.color}30`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{w.pollutant.replace(/_ugm3/, '').replace(/_/g, ' ')}</div>
                  <div style={{ fontSize: 16, fontWeight: 700 }}>{w.value} <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{w.unit}</span></div>
                </div>
                <span style={{ fontSize: 11, fontWeight: 600, color: w.color, padding: '2px 8px', borderRadius: 4, background: `${w.color}15` }}>{w.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Zone cards grid */}
      {!selectedZone && (
        <div className="card-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
          {filtered.map(zone => (
            <div className="card" key={zone.zone_id}
              onClick={() => setSelectedZone(zone.zone_id)}
              style={{ cursor: 'pointer', borderLeft: `3px solid ${zone.health_risk?.color}`, transition: 'all 0.25s ease' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                  <h3 style={{ fontSize: 16, marginBottom: 4 }}>{zone.zone_name}</h3>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                    AQI: {zone.current_aqi} • CO₂: {zone.current_co2_ppm} ppm • {zone.who_violations} WHO violations
                  </span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 24, fontWeight: 800, color: zone.health_risk?.color }}>{zone.risk_score}</div>
                  <span className="badge" style={{ background: `${zone.health_risk?.color}20`, color: zone.health_risk?.color, fontSize: 10 }}>
                    {zone.health_risk?.level}
                  </span>
                </div>
              </div>

              {/* Top conditions preview */}
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {zone.condition_predictions?.filter(c => c.probability > 0.3).slice(0, 3).map((c, i) => (
                  <span key={i} style={{ fontSize: 10, padding: '3px 8px', borderRadius: 4, background: `${c.severity_color}15`, color: c.severity_color, fontWeight: 600 }}>
                    {c.condition.split(' ')[0]} {c.probability_pct}%
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
