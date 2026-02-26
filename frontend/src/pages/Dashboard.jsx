import { useState, useEffect } from 'react';
import { api } from '../api/client';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

const COLORS = ['#22c55e', '#3b82f6', '#f97316', '#a855f7', '#eab308'];

export default function Dashboard() {
  const [zones, setZones] = useState(null);
  const [predictions, setPredictions] = useState(null);
  const [scores, setScores] = useState(null);
  const [credits, setCredits] = useState(null);
  const [alerts, setAlerts] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getZones(),
      api.getPredictions(),
      api.getScores(),
      api.getCarbonCredits(),
      api.getAlerts(),
    ]).then(([z, p, s, c, a]) => {
      setZones(z);
      setPredictions(p);
      setScores(s);
      setCredits(c);
      setAlerts(a);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading"><div className="loading-spinner"></div><p>Loading dashboard...</p></div>;
  if (!zones) return <div className="loading"><p>Failed to connect to API. Make sure backend is running on port 8000.</p></div>;

  const avgCO2 = (zones.zones.reduce((s, z) => s + z.current_co2_ppm, 0) / zones.zones.length).toFixed(1);
  const avgAQI = Math.round(zones.zones.reduce((s, z) => s + z.current_aqi, 0) / zones.zones.length);
  const cityScore = scores?.city_average_score || 0;

  const co2Data = zones.zones.map(z => ({ name: z.name, co2: z.current_co2_ppm, aqi: z.current_aqi }));
  const scoreData = scores?.zone_scores?.map(z => ({ name: z.zone_name, score: z.sustainability_score })) || [];
  const riskData = [
    { name: 'Critical', value: zones.zones.filter(z => z.risk_level === 'Critical').length },
    { name: 'High', value: zones.zones.filter(z => z.risk_level === 'High').length },
    { name: 'Medium', value: zones.zones.filter(z => z.risk_level === 'Medium').length },
    { name: 'Low', value: zones.zones.filter(z => z.risk_level === 'Low').length },
  ].filter(d => d.value > 0);
  const riskColors = { Critical: '#ef4444', High: '#f97316', Medium: '#eab308', Low: '#22c55e' };

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1>UrbanEcoTwin Dashboard</h1>
        <p>Real-time sustainability intelligence for Chennai Metropolitan Area</p>
      </div>

      {/* Metric Cards */}
      <div className="card-grid">
        <div className="card metric-card green">
          <div className="metric-header">
            <div><div className="metric-label">City Avg CO₂</div></div>
            <div className="metric-icon">🌿</div>
          </div>
          <div className="metric-value">{avgCO2}</div>
          <div className="metric-change up">ppm — {avgCO2 > 420 ? 'Above' : 'Near'} safe threshold</div>
        </div>

        <div className="card metric-card blue">
          <div className="metric-header">
            <div><div className="metric-label">Avg Air Quality Index</div></div>
            <div className="metric-icon">💨</div>
          </div>
          <div className="metric-value">{avgAQI}</div>
          <div className="metric-change">{avgAQI > 100 ? '⚠️ Unhealthy' : '✅ Moderate'}</div>
        </div>

        <div className="card metric-card orange">
          <div className="metric-header">
            <div><div className="metric-label">Sustainability Score</div></div>
            <div className="metric-icon">⭐</div>
          </div>
          <div className="metric-value">{cityScore}<span style={{fontSize: '16px', opacity: 0.5}}>/100</span></div>
          <div className="metric-change">Grade: {scores?.city_grade}</div>
        </div>

        <div className="card metric-card purple">
          <div className="metric-header">
            <div><div className="metric-label">Carbon Credits</div></div>
            <div className="metric-icon">💰</div>
          </div>
          <div className="metric-value" style={{fontSize: '24px'}}>{credits?.city_totals?.total_credits_inr}</div>
          <div className="metric-change down">Potential earnings</div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="card-grid-3">
        <div className="card chart-card" style={{gridColumn: 'span 2'}}>
          <h3>CO₂ Levels by Zone</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={co2Data}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip
                contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#f1f5f9' }}
              />
              <Bar dataKey="co2" fill="url(#co2Gradient)" radius={[6, 6, 0, 0]} />
              <defs>
                <linearGradient id="co2Gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22c55e" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card chart-card">
          <h3>Risk Distribution</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={riskData} cx="50%" cy="50%" outerRadius={90} innerRadius={55} dataKey="value" paddingAngle={4}>
                {riskData.map((entry, i) => (
                  <Cell key={i} fill={riskColors[entry.name]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#f1f5f9' }} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
            {riskData.map((d, i) => (
              <span key={i} style={{ fontSize: 12, color: riskColors[d.name] }}>● {d.name} ({d.value})</span>
            ))}
          </div>
        </div>
      </div>

      {/* Sustainability Scores Bar Chart */}
      <div className="card chart-card" style={{marginBottom: 24}}>
        <h3>Sustainability Scores by Zone</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={scoreData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
            <YAxis stroke="#64748b" fontSize={12} domain={[0, 100]} />
            <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#f1f5f9' }} />
            <Bar dataKey="score" radius={[6, 6, 0, 0]}>
              {scoreData.map((entry, i) => (
                <Cell key={i} fill={entry.score >= 65 ? '#22c55e' : entry.score >= 45 ? '#eab308' : '#ef4444'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Alerts */}
      {alerts && alerts.alerts.length > 0 && (
        <div className="card" style={{marginBottom: 24}}>
          <h3 style={{marginBottom: 16}}>🚨 Active Alerts ({alerts.total_alerts})</h3>
          {alerts.alerts.slice(0, 5).map((alert, i) => (
            <div key={i} className={`alert-item ${alert.severity}`}>
              <div className="alert-content">
                <h4>{alert.title}</h4>
                <p>{alert.message}</p>
                <div className="alert-meta">{alert.zone_name} • {alert.recommended_action}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
