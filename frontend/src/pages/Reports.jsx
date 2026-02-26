import { useState, useEffect } from 'react';
import { api } from '../api/client';

export default function Reports() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getReport().then(d => { setData(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading"><div className="loading-spinner"></div><p>Generating policy report...</p></div>;
  if (!data) return <div className="loading"><p>Failed to load data.</p></div>;

  const exec = data.executive_summary;

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1>📋 Policy Report Generator</h1>
        <p>Report ID: {data.report_id} — Generated for government stakeholders</p>
      </div>

      {/* Report Header */}
      <div className="card" style={{ marginBottom: 24, background: 'linear-gradient(135deg, rgba(34,197,94,0.08), rgba(59,130,246,0.08))' }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>{data.title}</h2>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 16 }}>{data.subtitle}</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase' }}>City</div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>{exec?.city}</div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Zones Analyzed</div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>{exec?.zones_analyzed}</div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Avg CO₂</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--accent-orange)' }}>{exec?.current_avg_co2_ppm} ppm</div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Sustainability Grade</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--accent-green)' }}>{exec?.sustainability_grade} ({exec?.sustainability_score}/100)</div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Net-Zero Target</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--accent-blue)' }}>{exec?.net_zero_target_year}</div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Carbon Credit Potential</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--accent-purple)' }}>{exec?.total_carbon_credit_potential}</div>
          </div>
        </div>
      </div>

      {/* Pollution Overview */}
      <div className="card" style={{ marginBottom: 24 }}>
        <h3 style={{ marginBottom: 16 }}>🏙️ Current State — {data.current_state?.worst_zone} is the most polluted zone</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Zone</th>
              <th>CO₂ (ppm)</th>
              <th>AQI</th>
            </tr>
          </thead>
          <tbody>
            {data.current_state?.pollution_overview?.map((z, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 600 }}>{z.zone}</td>
                <td style={{ color: z.co2_ppm > 440 ? 'var(--accent-red)' : 'var(--accent-green)' }}>{z.co2_ppm}</td>
                <td style={{ color: z.aqi > 120 ? 'var(--accent-orange)' : 'var(--accent-green)' }}>{z.aqi}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Recommendations */}
      <div className="card" style={{ marginBottom: 24 }}>
        <h3 style={{ marginBottom: 16 }}>📌 Policy Recommendations</h3>
        {data.recommendations?.map((r, i) => (
          <div key={i} className={`alert-item ${r.priority.toLowerCase()}`}>
            <div className="alert-content">
              <h4><span className={`badge ${r.priority.toLowerCase()}`} style={{ marginRight: 8 }}>{r.priority}</span>{r.action}</h4>
              <p>Expected Impact: {r.expected_impact} • Timeline: {r.timeline} • Cost: {r.estimated_cost}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Net-Zero Summary */}
      <div className="card">
        <h3 style={{ marginBottom: 16 }}>🎯 Net-Zero Roadmap Summary</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
          <div style={{ padding: 16, borderRadius: 'var(--radius-sm)', background: 'var(--bg-glass)' }}>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Target Year</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--accent-green)' }}>{data.net_zero_roadmap_summary?.target_year}</div>
          </div>
          <div style={{ padding: 16, borderRadius: 'var(--radius-sm)', background: 'var(--bg-glass)' }}>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Phases</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--accent-blue)' }}>{data.net_zero_roadmap_summary?.phases}</div>
          </div>
          <div style={{ padding: 16, borderRadius: 'var(--radius-sm)', background: 'var(--bg-glass)' }}>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Investment</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--accent-orange)' }}>{data.net_zero_roadmap_summary?.total_investment}</div>
          </div>
          <div style={{ padding: 16, borderRadius: 'var(--radius-sm)', background: 'var(--bg-glass)' }}>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Carbon Credits</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--accent-purple)' }}>{data.net_zero_roadmap_summary?.carbon_credits_potential}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
