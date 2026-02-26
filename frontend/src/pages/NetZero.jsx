import { useState, useEffect } from 'react';
import { api } from '../api/client';
import { Target, CalendarDays, Building } from 'lucide-react';

export default function NetZero() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getNetZero().then(d => { setData(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading"><div className="loading-spinner"></div><p>Loading Net-Zero roadmap...</p></div>;
  if (!data) return <div className="loading"><p>Failed to load data.</p></div>;

  return (
    <div className="fade-in">
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <h1><Target size={28} style={{ color: '#22c55e' }} /> Net-Zero Planning</h1>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="card-grid">
        <div className="card metric-card green">
          <div className="metric-label">Baseline CO₂</div>
          <div className="metric-value">{data.baseline_co2_ppm}</div>
          <div className="metric-change">ppm (current average)</div>
        </div>
        <div className="card metric-card blue">
          <div className="metric-label">Target CO₂</div>
          <div className="metric-value">{data.target_co2_ppm}</div>
          <div className="metric-change">ppm (safe level)</div>
        </div>
        <div className="card metric-card purple">
          <div className="metric-label">Target Year</div>
          <div className="metric-value">{data.target_year}</div>
          <div className="metric-change">{data.net_zero_achievable ? '✅ Achievable' : '⚠️ Challenging'}</div>
        </div>
        <div className="card metric-card orange">
          <div className="metric-label">Total Investment</div>
          <div className="metric-value" style={{ fontSize: 22 }}>{data.total_investment_estimate_inr}</div>
          <div className="metric-change">Carbon credits: {data.carbon_credits_potential}</div>
        </div>
      </div>

      {/* Timeline */}
      <div className="card" style={{ marginBottom: 24 }}>
        <h3 style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
          <CalendarDays size={20} color="#64748b" /> Phase-wise Roadmap
        </h3>
        <div className="timeline">
          {data.milestones?.map((m, i) => (
            <div key={i} className={`timeline-item ${m.status}`}>
              <h4>{m.phase}</h4>
              <div className="timeline-years">{m.year_range} • Target: {m.target_co2_ppm} ppm</div>
              <div style={{ marginBottom: 12 }}>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${m.reduction_from_baseline_pct}%` }}></div>
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
                  {m.reduction_from_baseline_pct}% reduction from baseline
                </div>
              </div>
              <ul>
                {m.key_actions?.map((a, j) => <li key={j}>{a}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Zone Targets */}
      <div className="card">
        <h3 style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Building size={20} color="#64748b" /> Zone-Specific Net-Zero Targets
        </h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Zone</th>
              <th>Current CO₂</th>
              <th>Target CO₂</th>
              <th>Reduction Needed</th>
              <th>Target Year</th>
              <th>Feasibility</th>
            </tr>
          </thead>
          <tbody>
            {data.zone_targets?.map(z => (
              <tr key={z.zone_id}>
                <td style={{ fontWeight: 600 }}>{z.zone_name}</td>
                <td>{z.current_co2_ppm} ppm</td>
                <td>{z.target_co2_ppm} ppm</td>
                <td style={{ color: 'var(--accent-orange)' }}>{z.required_reduction_ppm} ppm</td>
                <td>{z.estimated_netzero_year}</td>
                <td><span className={`badge ${z.feasibility === 'High' ? 'low' : z.feasibility === 'Medium' ? 'medium' : 'high'}`}>{z.feasibility}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
