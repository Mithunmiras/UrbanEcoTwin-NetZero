import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { Leaf, Wind, Activity, CircleDollarSign, Globe, AlertTriangle } from 'lucide-react';

const COLORS = ['#22c55e', '#3b82f6', '#f97316', '#a855f7', '#eab308'];

export default function Dashboard() {
  const [zones, setZones] = useState(null);
  const [scores, setScores] = useState(null);
  const [credits, setCredits] = useState(null);
  const [alerts, setAlerts] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedRiskCategory, setSelectedRiskCategory] = useState(null);
  const [selectedCityScore, setSelectedCityScore] = useState('All');

  useEffect(() => {
    Promise.all([
      api.getZones(),
      api.getScores(),
      api.getCarbonCredits(),
      api.getAlerts(),
    ]).then(([z, s, c, a]) => {
      setZones(z);
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

  const scoreData = scores?.zone_scores?.map(z => {
    // The zone_id is typically formatted as "city_zonename" (e.g., "chennai_adyar")
    const cityId = z.zone_id ? z.zone_id.split('_')[0] : 'unknown';
    return {
      name: z.zone_name,
      score: z.sustainability_score,
      city: cityId
    };
  }) || [];

  const availableCities = [...new Set(scoreData.map(z => z.city).filter(c => c !== 'unknown'))];

  const filteredScoreData = selectedCityScore === 'All'
    ? scoreData
    : scoreData.filter(entry => entry.city === selectedCityScore);
  const riskData = [
    { name: 'Critical', value: zones.zones.filter(z => z.risk_level === 'Critical').length },
    { name: 'High', value: zones.zones.filter(z => z.risk_level === 'High').length },
    { name: 'Medium', value: zones.zones.filter(z => z.risk_level === 'Medium').length },
    { name: 'Low', value: zones.zones.filter(z => z.risk_level === 'Low').length },
  ].filter(d => d.value > 0);
  const riskColors = { Critical: '#ef4444', High: '#f97316', Medium: '#eab308', Low: '#22c55e' };

  // ── Drill-down View for Risk Category ──────────────────────────────────
  if (selectedRiskCategory) {
    const categoryZones = zones.zones.filter(z => z.risk_level === selectedRiskCategory);
    const color = riskColors[selectedRiskCategory];

    return (
      <div className="fade-in">
        <div className="page-header" style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              onClick={() => setSelectedRiskCategory(null)}
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 8, padding: '6px 14px', color: '#94a3b8', cursor: 'pointer', fontSize: 13 }}
            >
              ← Back to Dashboard
            </button>
            <h1 style={{ color: color }}>
              {selectedRiskCategory} Risk Zones
            </h1>
          </div>
          <p>{categoryZones.length} regions currently classified as {selectedRiskCategory} risk.</p>
        </div>

        <div className="card-grid">
          {categoryZones.map(z => (
            <div key={z.id} className="card zone-card" style={{ borderLeft: `3px solid ${color}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>{z.name}</h3>
                <span className="badge" style={{ background: color + '20', color: color }}>
                  {z.risk_level}
                </span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase' }}>AQI</div>
                  <div style={{ fontSize: 18, fontWeight: 700 }}>{z.current_aqi}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase' }}>CO₂ Levels</div>
                  <div style={{ fontSize: 18, fontWeight: 700 }}>{z.current_co2_ppm} ppm</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase' }}>PM 2.5</div>
                  <div style={{ fontSize: 18, fontWeight: 700 }}>{z.pm2_5} µg/m³</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase' }}>City</div>
                  <div style={{ fontSize: 16, fontWeight: 500 }}>{z.city ? z.city.charAt(0).toUpperCase() + z.city.slice(1) : 'Unknown'}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <h1>UrbanEcoTwin Dashboard</h1>
          <span className="live-badge live">
            <span className="live-dot"></span>
            Live Data
          </span>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="card-grid">
        <div className="card metric-card green">
          <div className="metric-header">
            <div><div className="metric-label">City Avg CO₂</div></div>
            <div className="metric-icon"><Leaf size={22} color="var(--accent-green)" /></div>
          </div>
          <div className="metric-value">{avgCO2}</div>
          <div className="metric-change up">ppm — {avgCO2 > 420 ? 'Above' : 'Near'} safe threshold</div>
        </div>

        <div className="card metric-card blue">
          <div className="metric-header">
            <div><div className="metric-label">Avg Air Quality Index</div></div>
            <div className="metric-icon"><Wind size={22} color="var(--accent-blue)" /></div>
          </div>
          <div className="metric-value">{avgAQI}</div>
          <div className="metric-change">
            <span style={{ color: avgAQI > 100 ? 'var(--accent-red)' : 'var(--accent-green)' }}>
              {avgAQI > 100 ? 'Unhealthy' : 'Moderate'}
            </span>
          </div>
        </div>

        <div className="card metric-card orange">
          <div className="metric-header">
            <div><div className="metric-label">Sustainability Score</div></div>
            <div className="metric-icon"><Activity size={22} color="var(--accent-orange)" /></div>
          </div>
          <div className="metric-value">{cityScore}<span style={{ fontSize: '16px', opacity: 0.5 }}>/100</span></div>
          <div className="metric-change">Grade: {scores?.city_grade}</div>
        </div>

        <div className="card metric-card purple">
          <div className="metric-header">
            <div><div className="metric-label">Carbon Credits</div></div>
            <div className="metric-icon"><CircleDollarSign size={22} color="var(--accent-purple)" /></div>
          </div>
          <div className="metric-value" style={{ fontSize: '24px' }}>{credits?.city_totals?.total_credits_inr}</div>
          <div className="metric-change down">Potential earnings</div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="card-grid-3">
        <div className="card chart-card" style={{ gridColumn: 'span 2' }}>
          <h3 className="text-heading">CO₂ Levels by Zone</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={co2Data}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip
                contentStyle={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 10, color: '#0f172a' }}
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
          <h3 className="text-heading">Risk Distribution</h3>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: -10, marginBottom: 10 }}>Click a segment to view specific zones</p>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={riskData}
                cx="50%"
                cy="50%"
                outerRadius={90}
                innerRadius={55}
                dataKey="value"
                paddingAngle={4}
                style={{ cursor: 'pointer' }}
                onClick={(data) => {
                  const categoryName = data?.name || data?.payload?.name;
                  if (categoryName) {
                    setSelectedRiskCategory(categoryName);
                  }
                }}
              >
                {riskData.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={riskColors[entry.name]}
                    style={{ outline: 'none', cursor: 'pointer' }}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 10, color: '#0f172a' }}
                itemStyle={{ color: '#0f172a' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
            {riskData.map((d, i) => (
              <span
                key={i}
                style={{ fontSize: 12, color: riskColors[d.name], cursor: 'pointer', padding: '4px 8px', borderRadius: '4px', border: '1px solid transparent', transition: 'all 0.2s' }}
                onClick={() => setSelectedRiskCategory(d.name)}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.05)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                ● {d.name} ({d.value})
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 3D Digital Twin Preview */}
      <Link to="/digital-twin" style={{ textDecoration: 'none' }}>
        <div className="card" style={{ marginBottom: 24, cursor: 'pointer', border: '1px solid rgba(59,130,246,0.15)', transition: 'all 0.4s ease' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 48, height: 48, borderRadius: 12, background: 'rgba(2, 132, 199, 0.1)' }}>
              <Globe size={28} color="var(--accent-blue)" />
            </div>
            <div>
              <h3 className="text-gradient" style={{ marginBottom: 0, fontSize: 20 }}>Interactive 3D Digital Twin</h3>
            </div>
          </div>
        </div>
      </Link>

      {/* Sustainability Scores Bar Chart */}
      <div className="card chart-card" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 className="text-heading" style={{ margin: 0 }}>Sustainability Scores by Zone</h3>

          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <button
              onClick={() => setSelectedCityScore('All')}
              style={{
                padding: '4px 12px', borderRadius: 6, fontSize: 12, cursor: 'pointer',
                border: selectedCityScore === 'All' ? '1px solid #3b82f6' : '1px solid rgba(0,0,0,0.08)',
                background: selectedCityScore === 'All' ? 'rgba(59,130,246,0.1)' : 'transparent',
                color: selectedCityScore === 'All' ? '#3b82f6' : 'var(--text-muted)'
              }}
            >
              All Cities
            </button>
            {availableCities.map(city => (
              <button
                key={city}
                onClick={() => setSelectedCityScore(city)}
                style={{
                  padding: '4px 12px', borderRadius: 6, fontSize: 12, cursor: 'pointer', textTransform: 'capitalize',
                  border: selectedCityScore === city ? '1px solid #3b82f6' : '1px solid rgba(0,0,0,0.08)',
                  background: selectedCityScore === city ? 'rgba(59,130,246,0.1)' : 'transparent',
                  color: selectedCityScore === city ? '#3b82f6' : 'var(--text-muted)'
                }}
              >
                {city}
              </button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={filteredScoreData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
            <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
            <YAxis stroke="#64748b" fontSize={12} domain={[0, 100]} />
            <Tooltip contentStyle={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 10, color: '#0f172a' }} />
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
        <div className="card" style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
              <AlertTriangle size={20} color="var(--accent-red)" />
              Active Alerts ({alerts.total_alerts})
            </h3>
            {alerts.total_alerts > 5 && (
              <Link to="/alerts" style={{ background: '#3b82f6', color: '#0f172a', padding: '6px 12px', borderRadius: '6px', textDecoration: 'none', fontSize: 13, fontWeight: 500, transition: 'background 0.2s' }}>
                View All {alerts.total_alerts} Alerts →
              </Link>
            )}
          </div>
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
