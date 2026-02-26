import { useState, useEffect } from 'react';
import { api } from '../api/client';
import {
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend
} from 'recharts';

export default function Predictions() {
  const [data, setData] = useState(null);
  const [selectedZone, setSelectedZone] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getPredictions().then(d => { setData(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading"><div className="loading-spinner"></div><p>Loading predictions...</p></div>;
  if (!data) return <div className="loading"><p>Failed to load data.</p></div>;

  const predictions = data.predictions;
  const current = selectedZone ? predictions.find(p => p.zone_id === selectedZone) : predictions[0];

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1>🤖 AI Prediction Engine</h1>
        <p>LSTM & XGBoost-powered CO₂ forecasting — Models: {data.models_used?.join(', ')}</p>
      </div>

      <div style={{ marginBottom: 24 }}>
        <select value={selectedZone || predictions[0]?.zone_id} onChange={e => setSelectedZone(e.target.value)}>
          {predictions.map(p => (
            <option key={p.zone_id} value={p.zone_id}>{p.zone_name}</option>
          ))}
        </select>
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
      <div className="card chart-card" style={{ marginBottom: 24 }}>
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

      {/* All Zones Comparison */}
      <div className="card" style={{ marginTop: 24 }}>
        <h3 style={{ marginBottom: 16 }}>All Zones — 24h Prediction Comparison</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Zone</th>
              <th>Current CO₂</th>
              <th>1h Predicted</th>
              <th>24h Predicted</th>
              <th>7d Predicted</th>
              <th>Trend</th>
            </tr>
          </thead>
          <tbody>
            {predictions.map(p => (
              <tr key={p.zone_id}>
                <td style={{ fontWeight: 600 }}>{p.zone_name}</td>
                <td>{p.current_co2_ppm} ppm</td>
                <td style={{ color: '#22c55e' }}>{p.predictions['1_hour'].predicted_co2_ppm} ppm</td>
                <td style={{ color: '#3b82f6' }}>{p.predictions['24_hour'].predicted_co2_ppm} ppm</td>
                <td style={{ color: '#a855f7' }}>{p.predictions['7_day'].predicted_co2_ppm} ppm</td>
                <td><span className={`badge ${p.risk_trend === 'increasing' ? 'warning' : 'low'}`}>{p.risk_trend}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
