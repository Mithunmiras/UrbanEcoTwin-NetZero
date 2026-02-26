import { useState, useEffect } from 'react';
import { api } from '../api/client';
import {
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend
} from 'recharts';

const CITY_LABELS = { chennai: '🏛️ Chennai', mumbai: '🌊 Mumbai', delhi: '🏙️ Delhi' };

export default function Predictions() {
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedZone, setSelectedZone] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cities, setCities] = useState([]);

  // Load available cities
  useEffect(() => {
    api.getCities().then(d => setCities(d.cities)).catch(() => { });
  }, []);

  // When city is selected, fetch predictions
  useEffect(() => {
    if (!selectedCity) { setData(null); setSelectedZone(null); return; }
    setLoading(true);
    setSelectedZone(null);
    api.getPredictions().then(d => {
      // Filter predictions to the selected city
      const filtered = d.predictions.filter(p => p.zone_id.startsWith(selectedCity));
      setData({ ...d, predictions: filtered });
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
          <h1>🤖 AI Prediction Engine</h1>
          <p>Select a city to view CO₂ forecasts powered by LSTM & XGBoost models</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginTop: 24 }}>
          {cities.map(city => (
            <div
              key={city.id}
              className="card"
              onClick={() => setSelectedCity(city.id)}
              style={{
                cursor: 'pointer',
                textAlign: 'center',
                padding: '40px 24px',
                transition: 'all 0.3s ease',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = '#3b82f6'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; }}
            >
              <div style={{ fontSize: 48, marginBottom: 16 }}>
                {city.id === 'chennai' ? '🏛️' : city.id === 'mumbai' ? '🌊' : '🏙️'}
              </div>
              <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>{city.name}</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
                View AI predictions for {city.name} zones
              </p>
              <div style={{
                marginTop: 16,
                padding: '8px 20px',
                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                borderRadius: 8,
                display: 'inline-block',
                fontSize: 13,
                fontWeight: 600,
              }}>
                Select City →
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── Step 2: Zone Selection (after city chosen) ──────────────────
  if (loading) return <div className="loading"><div className="loading-spinner"></div><p>Loading predictions for {CITY_LABELS[selectedCity]}...</p></div>;
  if (!data) return <div className="loading"><p>Failed to load data.</p></div>;

  return (
    <div className="fade-in">
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={() => setSelectedCity(null)}
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 8,
              padding: '6px 14px',
              color: '#94a3b8',
              cursor: 'pointer',
              fontSize: 13,
            }}
          >
            ← Back
          </button>
          <h1>🤖 {CITY_LABELS[selectedCity]} Predictions</h1>
        </div>
        <p>LSTM & XGBoost-powered CO₂ forecasting — {predictions.length} zones • Models: {data.models_used?.join(', ')}</p>
      </div>

      {/* Zone selector */}
      {!selectedZone ? (
        <>
          <h3 style={{ marginBottom: 16, fontSize: 16, color: 'var(--text-muted)' }}>Select a zone to view predictions</h3>
          <div className="card-grid">
            {predictions.map(p => (
              <div
                className="card zone-card"
                key={p.zone_id}
                onClick={() => setSelectedZone(p.zone_id)}
                style={{
                  cursor: 'pointer',
                  borderLeft: `3px solid ${p.risk_trend === 'increasing' ? '#f97316' : '#22c55e'}`,
                  transition: 'all 0.25s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700 }}>{p.zone_name}</h3>
                  <span className={`badge ${p.risk_trend === 'increasing' ? 'warning' : 'low'}`}>{p.risk_trend}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Current CO₂</div>
                    <div style={{ fontSize: 18, fontWeight: 700 }}>{p.current_co2_ppm} ppm</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase' }}>24h Prediction</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: '#3b82f6' }}>{p.predictions['24_hour']?.predicted_co2_ppm} ppm</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        /* ── Step 3: Zone Details ─────────────────────────── */
        <>
          <div style={{ marginBottom: 20 }}>
            <button
              onClick={() => setSelectedZone(null)}
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 8,
                padding: '6px 14px',
                color: '#94a3b8',
                cursor: 'pointer',
                fontSize: 13,
              }}
            >
              ← All Zones
            </button>
          </div>

          {/* Prediction Cards */}
          <div className="card-grid">
            <div className="card metric-card green">
              <div className="metric-header">
                <div><div className="metric-label">Current CO₂</div></div>
                <div className="metric-icon">📊</div>
              </div>
              <div className="metric-value">{current?.current_co2_ppm}</div>
              <div className="metric-change">ppm (live reading)</div>
            </div>
            <div className="card metric-card blue">
              <div className="metric-header">
                <div><div className="metric-label">1 Hour Prediction</div></div>
                <div className="metric-icon">⏱️</div>
              </div>
              <div className="metric-value">{current?.predictions['1_hour']?.predicted_co2_ppm}</div>
              <div className="metric-change up">+{current?.predictions['1_hour']?.change_ppm} ppm • {(current?.predictions['1_hour']?.confidence * 100).toFixed(0)}% confidence</div>
            </div>
            <div className="card metric-card orange">
              <div className="metric-header">
                <div><div className="metric-label">24 Hour Prediction</div></div>
                <div className="metric-icon">📅</div>
              </div>
              <div className="metric-value">{current?.predictions['24_hour']?.predicted_co2_ppm}</div>
              <div className="metric-change up">+{current?.predictions['24_hour']?.change_ppm} ppm • {(current?.predictions['24_hour']?.confidence * 100).toFixed(0)}% confidence</div>
            </div>
            <div className="card metric-card purple">
              <div className="metric-header">
                <div><div className="metric-label">7 Day Prediction</div></div>
                <div className="metric-icon">📈</div>
              </div>
              <div className="metric-value">{current?.predictions['7_day']?.predicted_co2_ppm}</div>
              <div className="metric-change up">+{current?.predictions['7_day']?.change_ppm} ppm • Trend: {current?.risk_trend}</div>
            </div>
          </div>

          {/* Hourly Forecast Chart */}
          <div className="card chart-card" style={{ marginTop: 24, marginBottom: 24 }}>
            <h3>24-Hour CO₂ Forecast — {current?.zone_name}</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={current?.hourly_forecast}>
                <defs>
                  <linearGradient id="hourlyGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22c55e" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#22c55e" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="hour_offset" stroke="#64748b" fontSize={12} label={{ value: 'Hours', position: 'insideBottom', offset: -5 }} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#f1f5f9' }} />
                <Area type="monotone" dataKey="predicted_co2_ppm" stroke="#22c55e" fill="url(#hourlyGrad)" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* 7-Day Forecast */}
          <div className="card chart-card">
            <h3>7-Day CO₂ Trend — {current?.zone_name}</h3>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={current?.daily_forecast}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="day_offset" stroke="#64748b" fontSize={12} label={{ value: 'Days', position: 'insideBottom', offset: -5 }} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#f1f5f9' }} />
                <Line type="monotone" dataKey="predicted_co2_ppm" stroke="#3b82f6" strokeWidth={2.5} dot={{ fill: '#3b82f6', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
}
