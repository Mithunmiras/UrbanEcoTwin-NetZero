import { useState, useEffect } from 'react';
import { api } from '../api/client';

export default function Health() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getHealth().then(d => { setData(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading"><div className="loading-spinner"></div><p>Analyzing health impact...</p></div>;
  if (!data) return <div className="loading"><p>Failed to load data.</p></div>;

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1>❤️ Health Impact Predictor</h1>
        <p>Population health risk assessment based on air quality — Highest risk: {data.city_summary?.highest_risk_zone}</p>
      </div>

      <div className="card-grid">
        <div className="card metric-card orange">
          <div className="metric-label">Total Population</div>
          <div className="metric-value" style={{ fontSize: 24 }}>{data.city_summary?.total_population?.toLocaleString()}</div>
          <div className="metric-change">monitored residents</div>
        </div>
        <div className="card metric-card green" style={{ borderTop: '3px solid var(--accent-red)' }}>
          <div className="metric-label">Estimated Affected</div>
          <div className="metric-value" style={{ fontSize: 24, color: 'var(--accent-red)' }}>{data.city_summary?.total_estimated_affected?.toLocaleString()}</div>
          <div className="metric-change">{data.city_summary?.affected_percentage}% of population</div>
        </div>
      </div>

      <div className="card-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))' }}>
        {data.health_impact_analysis?.map(zone => (
          <div className="card" key={zone.zone_id} style={{ borderLeft: `3px solid ${zone.health_risk?.color}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div>
                <h3 style={{ fontSize: 18, marginBottom: 4 }}>{zone.zone_name}</h3>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>AQI: {zone.current_aqi} • CO₂: {zone.current_co2_ppm} ppm</span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span className={`badge`} style={{ background: `${zone.health_risk?.color}20`, color: zone.health_risk?.color }}>
                  {zone.health_risk?.level}
                </span>
              </div>
            </div>

            <div style={{ padding: 12, borderRadius: 'var(--radius-sm)', background: `${zone.health_risk?.color}08`, marginBottom: 12 }}>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 6 }}>{zone.health_risk?.description}</p>
              <p style={{ fontSize: 12, color: zone.health_risk?.color, fontWeight: 500 }}>💡 {zone.health_risk?.advisory}</p>
            </div>

            {zone.affected_conditions?.length > 0 && (
              <div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>
                  Estimated affected: {zone.estimated_total_affected?.toLocaleString()} / {zone.population?.toLocaleString()}
                </div>
                {zone.affected_conditions.map((c, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border-glass)', fontSize: 13 }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{c.condition}</span>
                    <span style={{ fontWeight: 600, color: zone.health_risk?.color }}>{c.estimated_affected?.toLocaleString()}</span>
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
