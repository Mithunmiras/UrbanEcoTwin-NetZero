import { useState, useEffect } from 'react';
import { api } from '../api/client';

export default function Agents() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAgents().then(d => { setData(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading"><div className="loading-spinner"></div><p>Initializing agents...</p></div>;
  if (!data) return <div className="loading"><p>Failed to load data.</p></div>;

  const agentIcons = { 'Monitoring Agent': '👁️', 'Prediction Agent': '🔮', 'Optimization Agent': '⚙️', 'Policy Agent': '📜' };
  const agentColors = { 'Monitoring Agent': '#22c55e', 'Prediction Agent': '#3b82f6', 'Optimization Agent': '#a855f7', 'Policy Agent': '#f97316' };

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1>🤝 Multi-Agent AI System</h1>
        <p>{data.multi_agent_system} — Mode: {data.coordination_mode} — Status: {data.system_status}</p>
      </div>

      <div className="card-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
        {data.agents?.map((agent, i) => (
          <div className="card" key={i} style={{ borderTop: `3px solid ${agentColors[agent.agent]}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{ fontSize: 32 }}>{agentIcons[agent.agent]}</div>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700 }}>{agent.agent}</h3>
                <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{agent.role}</p>
              </div>
              <span className="badge low" style={{ marginLeft: 'auto' }}>{agent.status}</span>
            </div>

            {/* Agent-specific data */}
            {agent.anomalies_detected !== undefined && (
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 8 }}>
                  Zones: {agent.zones_monitored} • Anomalies: <span style={{ color: agent.anomalies_detected > 0 ? '#ef4444' : '#22c55e' }}>{agent.anomalies_detected}</span>
                </div>
                {agent.anomalies?.slice(0, 3).map((a, j) => (
                  <div key={j} style={{ fontSize: 12, color: 'var(--text-secondary)', padding: '4px 0', borderBottom: '1px solid var(--border-glass)' }}>
                    ⚠️ {a.zone}: {a.alert}
                  </div>
                ))}
              </div>
            )}

            {agent.high_risk_zones && (
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 8 }}>
                  Models: {agent.models_active?.join(', ')} • Accuracy: {(agent.prediction_accuracy * 100).toFixed(0)}%
                </div>
                {agent.high_risk_zones?.slice(0, 3).map((z, j) => (
                  <div key={j} style={{ fontSize: 12, color: 'var(--text-secondary)', padding: '4px 0' }}>
                    📊 {z.zone}: +{z.expected_increase} ppm → {z.predicted_co2} ppm
                  </div>
                ))}
              </div>
            )}

            {agent.recommendations && (
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 8 }}>
                  Strategies: {agent.strategies_evaluated}
                </div>
                {agent.recommendations?.slice(0, 3).map((r, j) => (
                  <div key={j} style={{ fontSize: 12, color: 'var(--text-secondary)', padding: '4px 0' }}>
                    🏆 {r.zone}: {r.recommended_strategy} → {r.expected_reduction}
                  </div>
                ))}
              </div>
            )}

            {agent.policy_recommendations && (
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 8 }}>
                  Avg CO₂: {agent.city_metrics?.avg_co2_ppm} ppm • AQI: {agent.city_metrics?.avg_aqi}
                </div>
                {agent.policy_recommendations?.slice(0, 3).map((p, j) => (
                  <div key={j} style={{ fontSize: 12, color: 'var(--text-secondary)', padding: '4px 0' }}>
                    <span className={`badge ${p.priority.toLowerCase()}`} style={{ marginRight: 6, fontSize: 10 }}>{p.priority}</span>
                    {p.action}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
