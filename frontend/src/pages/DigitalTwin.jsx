import { useState, useEffect } from 'react';
import { api } from '../api/client';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function DigitalTwin() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getZones().then(d => { setData(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading"><div className="loading-spinner"></div><p>Loading Digital Twin...</p></div>;
  if (!data) return <div className="loading"><p>Failed to load data.</p></div>;

  const riskRadius = { Critical: 35, High: 28, Medium: 22, Low: 18 };

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1>🌍 Urban Digital Twin</h1>
        <p>Virtual replica of Chennai — {data.total_zones} zones monitored in real-time</p>
      </div>

      <div className="map-container">
        <MapContainer center={[13.04, 80.23]} zoom={12} scrollWheelZoom={true}>
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; CARTO'
          />
          {data.zones.map(zone => (
            <CircleMarker
              key={zone.id}
              center={[zone.lat, zone.lng]}
              radius={riskRadius[zone.risk_level]}
              pathOptions={{
                fillColor: zone.risk_color,
                fillOpacity: 0.5,
                color: zone.risk_color,
                weight: 2,
              }}
            >
              <Popup>
                <div style={{ color: '#1e293b', minWidth: 200 }}>
                  <h3 style={{ margin: '0 0 8px', fontSize: 16 }}>{zone.name}</h3>
                  <p style={{ margin: '4px 0', fontSize: 13 }}>CO₂: <strong>{zone.current_co2_ppm} ppm</strong></p>
                  <p style={{ margin: '4px 0', fontSize: 13 }}>AQI: <strong>{zone.current_aqi}</strong></p>
                  <p style={{ margin: '4px 0', fontSize: 13 }}>Risk: <strong style={{ color: zone.risk_color }}>{zone.risk_level}</strong></p>
                  <p style={{ margin: '4px 0', fontSize: 13 }}>Green Cover: <strong>{zone.green_cover_pct}%</strong></p>
                  <p style={{ margin: '4px 0', fontSize: 13 }}>Trees: <strong>{zone.tree_count?.toLocaleString()}</strong></p>
                  <p style={{ margin: '4px 0', fontSize: 13 }}>Factories: <strong>{zone.factories}</strong></p>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>

      <div className="card-grid">
        {data.zones.map(zone => (
          <div className="card" key={zone.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700 }}>{zone.name}</h3>
              <span className={`badge ${zone.risk_level.toLowerCase()}`}>{zone.risk_level}</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase' }}>CO₂</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: zone.risk_color }}>{zone.current_co2_ppm} ppm</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase' }}>AQI</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: zone.risk_color }}>{zone.current_aqi}</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Green Cover</div>
                <div style={{ fontSize: 16, fontWeight: 600 }}>{zone.green_cover_pct}%</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Renewables</div>
                <div style={{ fontSize: 16, fontWeight: 600 }}>{zone.renewable_energy_pct}%</div>
              </div>
            </div>
            <div style={{ marginTop: 12 }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>Population: {zone.population?.toLocaleString()} • Trees: {zone.tree_count?.toLocaleString()} • 🏭 {zone.factories}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
