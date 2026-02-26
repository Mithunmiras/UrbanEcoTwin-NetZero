import { useState, useEffect } from 'react';
import { api } from '../api/client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function Simulation() {
  const [zones, setZones] = useState(null);
  const [selectedZone, setSelectedZone] = useState('adyar');
  const [actions, setActions] = useState({
    plant_trees: 0,
    add_solar_panels: 0,
    increase_traffic: 0,
    add_factory: 0,
    ev_transition: 0,
    green_cover: 0,
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getZones().then(d => { setZones(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const runSimulation = () => {
    const actionList = Object.entries(actions)
      .filter(([_, qty]) => qty > 0)
      .map(([action, quantity]) => ({ action, quantity }));
    if (actionList.length === 0) return;
    api.simulate(selectedZone, actionList).then(setResult);
  };

  if (loading) return <div className="loading"><div className="loading-spinner"></div><p>Loading simulator...</p></div>;

  const sliderConfig = [
    { key: 'plant_trees', label: '🌳 Plant Trees', max: 20000, step: 500, unit: 'trees' },
    { key: 'add_solar_panels', label: '☀️ Add Solar Panels', max: 5000, step: 100, unit: 'panels' },
    { key: 'ev_transition', label: '🚗 EV Transition', max: 10000, step: 200, unit: 'vehicles' },
    { key: 'green_cover', label: '🌿 Green Cover Increase', max: 30, step: 1, unit: '%' },
    { key: 'increase_traffic', label: '🚦 Increase Traffic', max: 20000, step: 500, unit: 'vehicles' },
    { key: 'add_factory', label: '🏭 Add Factories', max: 10, step: 1, unit: 'factories' },
  ];

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1>🔬 Scenario Simulation Engine</h1>
        <p>Test sustainability actions and see their CO₂ impact in real-time</p>
      </div>

      <div className="card-grid-3">
        <div className="card" style={{ gridColumn: 'span 1' }}>
          <h3 style={{ marginBottom: 20 }}>Configure Scenario</h3>

          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 13, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Select Zone</label>
            <select value={selectedZone} onChange={e => setSelectedZone(e.target.value)} style={{ width: '100%' }}>
              {zones?.zones.map(z => (
                <option key={z.id} value={z.id}>{z.name}</option>
              ))}
            </select>
          </div>

          {sliderConfig.map(s => (
            <div className="control-group" key={s.key}>
              <div className="control-label">
                <span>{s.label}</span>
                <span className="control-value">{actions[s.key].toLocaleString()} {s.unit}</span>
              </div>
              <input
                type="range"
                min={0}
                max={s.max}
                step={s.step}
                value={actions[s.key]}
                onChange={e => setActions(prev => ({ ...prev, [s.key]: Number(e.target.value) }))}
              />
            </div>
          ))}

          <button
            onClick={runSimulation}
            style={{
              width: '100%',
              padding: '14px',
              background: 'var(--gradient-primary)',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              color: 'white',
              fontSize: 15,
              fontWeight: 700,
              cursor: 'pointer',
              marginTop: 8,
              transition: 'var(--transition)',
              fontFamily: 'Inter',
            }}
          >
            🚀 Run Simulation
          </button>
        </div>

        <div className="card" style={{ gridColumn: 'span 2' }}>
          <h3 style={{ marginBottom: 20 }}>Simulation Results</h3>
          {!result ? (
            <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-muted)' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🔬</div>
              <p>Configure actions and click "Run Simulation" to see results</p>
            </div>
          ) : (
            <>
              <div className="card-grid">
                <div className="card metric-card orange" style={{ background: 'rgba(249,115,22,0.05)' }}>
                  <div className="metric-label">Original CO₂</div>
                  <div className="metric-value">{result.original_co2_ppm}</div>
                  <div className="metric-change">ppm (before)</div>
                </div>
                <div className="card metric-card green" style={{ background: 'rgba(34,197,94,0.05)' }}>
                  <div className="metric-label">New CO₂</div>
                  <div className="metric-value">{result.new_co2_ppm}</div>
                  <div className="metric-change down">ppm (after simulation)</div>
                </div>
                <div className="card metric-card blue" style={{ background: 'rgba(59,130,246,0.05)' }}>
                  <div className="metric-label">CO₂ Reduction</div>
                  <div className="metric-value">{result.reduction_percentage}%</div>
                  <div className="metric-change down">{result.total_co2_reduction_ppm} ppm reduced</div>
                </div>
              </div>

              {result.action_results?.length > 0 && (
                <>
                  <h4 style={{ marginTop: 16, marginBottom: 12, fontSize: 14 }}>Action Impact Breakdown</h4>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={result.action_results} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis type="number" stroke="#64748b" fontSize={12} />
                      <YAxis type="category" dataKey="label" stroke="#64748b" fontSize={12} width={140} />
                      <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#f1f5f9' }} />
                      <Bar dataKey="co2_change_ppm" radius={[0, 6, 6, 0]}>
                        {result.action_results.map((entry, i) => (
                          <Cell key={i} fill={entry.co2_change_ppm >= 0 ? '#22c55e' : '#ef4444'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
