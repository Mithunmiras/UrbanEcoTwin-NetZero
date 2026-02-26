import { useState, useEffect } from 'react';
import { api } from '../api/client';

export default function Alerts() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAlerts().then(d => { setData(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading"><div className="loading-spinner"></div><p>Checking alerts...</p></div>;
  if (!data) return <div className="loading"><p>Failed to load data.</p></div>;

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1>🚨 Sustainability Alerts</h1>
        <p>{data.total_alerts} active alerts — {data.critical_count} critical, {data.warning_count} warnings, {data.info_count} info</p>
      </div>

      <div className="card-grid">
        <div className="card metric-card" style={{ borderTop: '3px solid var(--accent-red)' }}>
          <div className="metric-label">Critical</div>
          <div className="metric-value" style={{ color: 'var(--accent-red)' }}>{data.critical_count}</div>
        </div>
        <div className="card metric-card" style={{ borderTop: '3px solid var(--accent-orange)' }}>
          <div className="metric-label">Warnings</div>
          <div className="metric-value" style={{ color: 'var(--accent-orange)' }}>{data.warning_count}</div>
        </div>
        <div className="card metric-card" style={{ borderTop: '3px solid var(--accent-blue)' }}>
          <div className="metric-label">Info</div>
          <div className="metric-value" style={{ color: 'var(--accent-blue)' }}>{data.info_count}</div>
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: 16 }}>All Active Alerts</h3>
        {data.alerts?.map((alert) => (
          <div key={alert.id} className={`alert-item ${alert.severity}`}>
            <div className="alert-content" style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h4>{alert.title}</h4>
                <span className={`badge ${alert.severity}`}>{alert.severity}</span>
              </div>
              <p>{alert.message}</p>
              <p style={{ marginTop: 6, fontSize: 12, color: alert.color, fontWeight: 500 }}>💡 {alert.recommended_action}</p>
              <div className="alert-meta">
                Zone: {alert.zone_name} • Type: {alert.type} • Value: {alert.value} (threshold: {alert.threshold})
              </div>
            </div>
          </div>
        ))}
        {data.alerts?.length === 0 && (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
            <p>No active alerts — all zones are within safe thresholds</p>
          </div>
        )}
      </div>
    </div>
  );
}
