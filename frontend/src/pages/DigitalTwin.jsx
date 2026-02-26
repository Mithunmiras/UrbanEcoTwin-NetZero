import { useState, useEffect } from 'react';
import { api } from '../api/client';
import CesiumCityView from '../components/CesiumCityView';
import { Globe2, Building2, Landmark } from 'lucide-react';

const CITY_OPTIONS = [
  { id: '', label: 'All Cities', icon: Globe2 },
  { id: 'chennai', label: 'Chennai', icon: Landmark },
  { id: 'coimbatore', label: 'Coimbatore', icon: Building2 },
  { id: 'madurai', label: 'Madurai', icon: Building2 },
];

export default function DigitalTwin() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedZoneId, setSelectedZoneId] = useState(null);
  const [selectedCity, setSelectedCity] = useState('');

  const fetchData = (city) => {
    setLoading(true);
    api.getZones(city || undefined)
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchData(selectedCity);
    const interval = setInterval(() => fetchData(selectedCity), 60000);
    return () => clearInterval(interval);
  }, [selectedCity]);

  if (loading) return <div className="loading"><div className="loading-spinner"></div><p>Loading Digital Twin...</p></div>;
  if (!data) return <div className="loading"><p>Failed to load data.</p></div>;

  const selectedZone = data.zones.find(z => z.id === selectedZoneId);

  return (
    <div className="fade-in">
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <h1>Urban Digital Twin</h1>
          <span className="live-badge live">
            <span className="live-dot"></span>
            Live Data
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8, flexWrap: 'wrap' }}>
          {CITY_OPTIONS.map(opt => {
            const Icon = opt.icon;
            return (
              <button
                key={opt.id}
                onClick={() => { setSelectedCity(opt.id); setSelectedZoneId(null); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 16px',
                  borderRadius: 8,
                  border: selectedCity === opt.id ? '1px solid #3b82f6' : '1px solid rgba(0,0,0,0.08)',
                  background: selectedCity === opt.id ? 'rgba(59,130,246,0.15)' : 'rgba(0,0,0,0.04)',
                  color: selectedCity === opt.id ? '#60a5fa' : '#94a3b8',
                  cursor: 'pointer',
                  fontSize: 13,
                  fontWeight: selectedCity === opt.id ? 600 : 400,
                  transition: 'all 0.2s ease',
                }}
              >
                <Icon size={16} />
                {opt.label}
              </button>
            );
          })}
          <span style={{ color: 'var(--text-muted)', fontSize: 13, marginLeft: 8 }}>
            {data.total_zones} zones monitored
          </span>
        </div>
      </div>

      {/* Cesium 3D Globe */}
      <div className="scene-container" style={{ height: 600 }}>
        <CesiumCityView
          zones={data.zones}
          selectedZoneId={selectedZoneId}
          onSelectZone={setSelectedZoneId}
          selectedCity={selectedCity}
        />
      </div>

      {/* Selected zone detail panel */}
      {selectedZone && (
        <div className="card selected-zone-card" style={{ marginTop: 20, borderLeft: `4px solid ${selectedZone.risk_color}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>{selectedZone.name}</h2>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span className={`badge ${selectedZone.risk_level.toLowerCase()}`}>{selectedZone.risk_level}</span>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>via {selectedZone.api_source}</span>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 14 }}>
            <div className="stat-box"><div className="stat-label">CO₂</div><div className="stat-value" style={{ color: selectedZone.risk_color }}>{selectedZone.current_co2_ppm} ppm</div></div>
            <div className="stat-box"><div className="stat-label">AQI</div><div className="stat-value" style={{ color: selectedZone.risk_color }}>{selectedZone.current_aqi}</div></div>
            <div className="stat-box"><div className="stat-label">Temperature</div><div className="stat-value">{selectedZone.avg_temperature_c?.toFixed(1)}°C</div></div>
            <div className="stat-box"><div className="stat-label">Humidity</div><div className="stat-value">{selectedZone.avg_humidity_pct}%</div></div>
            <div className="stat-box"><div className="stat-label">Wind</div><div className="stat-value">{selectedZone.avg_wind_speed_kmh?.toFixed(1)} km/h</div></div>
            <div className="stat-box"><div className="stat-label">PM2.5</div><div className="stat-value">{selectedZone.pm2_5?.toFixed(1)} µg/m³</div></div>
            <div className="stat-box"><div className="stat-label">PM10</div><div className="stat-value">{selectedZone.pm10?.toFixed(1)} µg/m³</div></div>
            <div className="stat-box"><div className="stat-label">NO₂</div><div className="stat-value">{selectedZone.nitrogen_dioxide_ugm3?.toFixed(1)} µg/m³</div></div>
            <div className="stat-box"><div className="stat-label">SO₂</div><div className="stat-value">{selectedZone.sulphur_dioxide_ugm3?.toFixed(1)} µg/m³</div></div>
            <div className="stat-box"><div className="stat-label">Ozone</div><div className="stat-value">{selectedZone.ozone_ugm3?.toFixed(1)} µg/m³</div></div>
          </div>
        </div>
      )}

      {/* Zone cards grid */}
      <div className="card-grid" style={{ marginTop: 20 }}>
        {data.zones.map(zone => (
          <div
            className={`card zone-card ${selectedZoneId === zone.id ? 'selected' : ''}`}
            key={zone.id}
            onClick={() => setSelectedZoneId(zone.id)}
            style={{ cursor: 'pointer', borderLeft: `3px solid ${zone.risk_color}` }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700 }}>{zone.name}</h3>
              <span className={`badge ${zone.risk_level.toLowerCase()}`}>{zone.risk_level}</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
              <div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase' }}>CO₂</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: zone.risk_color }}>{zone.current_co2_ppm}</div>
              </div>
              <div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase' }}>AQI</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: zone.risk_color }}>{zone.current_aqi}</div>
              </div>
              <div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Temp</div>
                <div style={{ fontSize: 16, fontWeight: 700 }}>{zone.avg_temperature_c?.toFixed(1)}°</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
