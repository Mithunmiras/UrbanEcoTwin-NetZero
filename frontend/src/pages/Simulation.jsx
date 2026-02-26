import { useState, useEffect } from 'react';
import { api } from '../api/client';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Cell, LineChart, Line, Legend
} from 'recharts';
import { TreePine, Sun, Car, Leaf, TrafficCone, Factory, Microscope } from 'lucide-react';

export default function Simulation() {
  const [zones, setZones] = useState(null);
  const [selectedZone, setSelectedZone] = useState('chennai_adyar');
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
  const [simulating, setSimulating] = useState(false);

  useEffect(() => {
    api.getZones().then(d => { setZones(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const runSimulation = () => {
    const actionList = Object.entries(actions)
      .filter(([_, qty]) => qty > 0)
      .map(([action, quantity]) => ({ action, quantity }));
    if (actionList.length === 0) return;
    setSimulating(true);
    api.simulate(selectedZone, actionList).then(r => { setResult(r); setSimulating(false); });
  };

  if (loading) return <div className="loading"><div className="loading-spinner"></div><p>Loading simulator...</p></div>;

  const sliderConfig = [
    { key: 'plant_trees', label: 'Plant Trees', icon: TreePine, max: 20000, step: 500, unit: 'trees' },
    { key: 'add_solar_panels', label: 'Add Solar Panels', icon: Sun, max: 5000, step: 100, unit: 'panels' },
    { key: 'ev_transition', label: 'EV Transition', icon: Car, max: 10000, step: 200, unit: 'vehicles' },
    { key: 'green_cover', label: 'Green Cover Increase', icon: Leaf, max: 30, step: 1, unit: '%' },
    { key: 'increase_traffic', label: 'Increase Traffic', icon: TrafficCone, max: 20000, step: 500, unit: 'vehicles' },
    { key: 'add_factory', label: 'Add Factories', icon: Factory, max: 10, step: 1, unit: 'factories' },
  ];

  return (
    <div className="fade-in">
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <h1><Microscope size={28} style={{ color: '#3b82f6', marginBottom: -4 }} /> ML Scenario Simulation</h1>
          <span className="live-badge live"><span className="live-dot"></span>Live Data</span>
        </div>
      </div>

      <div className="card-grid-3">
        <div className="card" style={{ gridColumn: 'span 1' }}>
          <h3 style={{ marginBottom: 20 }}>Configure Scenario</h3>

          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 13, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Select Zone</label>
            <select value={selectedZone} onChange={e => { setSelectedZone(e.target.value); setResult(null); }} style={{ width: '100%' }}>
              {zones?.zones.map(z => (
                <option key={z.id} value={z.id}>{z.name} {z.city}</option>
              ))}
            </select>
          </div>

          {sliderConfig.map(s => {
            const IconComponent = s.icon;
            const percentage = (actions[s.key] / s.max) * 100;
            return (
              <div className="control-group" key={s.key}>
                <div className="control-label">
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <IconComponent size={16} color="var(--accent-green)" /> {s.label}
                  </span>
                  <span className="control-value">{actions[s.key].toLocaleString()} {s.unit}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={s.max}
                  step={s.step}
                  value={actions[s.key]}
                  onChange={e => setActions(prev => ({ ...prev, [s.key]: Number(e.target.value) }))}
                  style={{
                    background: `linear-gradient(to right, var(--accent-green) ${percentage}%, rgba(0,0,0,0.08) ${percentage}%)`
                  }}
                />
              </div>
            );
          })}

          <button
            onClick={runSimulation}
            disabled={simulating}
            style={{
              width: '100%', padding: '14px',
              background: simulating ? '#475569' : 'var(--gradient-primary)',
              border: 'none', borderRadius: 'var(--radius-sm)',
              color: 'white', fontSize: 15, fontWeight: 700,
              cursor: simulating ? 'wait' : 'pointer',
              marginTop: 8, transition: 'var(--transition)', fontFamily: 'Inter',
            }}
          >
            {simulating ? '⏳ Running ML Model...' : '🚀 Run Simulation'}
          </button>
        </div>

        <div className="card" style={{ gridColumn: 'span 2' }}>
          <h3 style={{ marginBottom: 20 }}>Simulation Results</h3>
          {!result ? (
            <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
                <Microscope size={48} color="#cbd5e1" />
              </div>
              <p>Configure actions and click "Run Simulation" to see ML-predicted results</p>
              <p style={{ fontSize: 12, marginTop: 8 }}>Impact will be adjusted based on live temperature, humidity, AQI, and pollutants</p>
            </div>
          ) : (
            <>

              {/* Metric cards */}
              <div className="card-grid">
                <div className="card metric-card orange" style={{ background: 'rgba(249,115,22,0.05)' }}>
                  <div className="metric-label">Original CO₂</div>
                  <div className="metric-value">{result.original_co2_ppm}</div>
                  <div className="metric-change">ppm (live reading)</div>
                </div>
                <div className="card metric-card green" style={{ background: 'rgba(34,197,94,0.05)' }}>
                  <div className="metric-label">Predicted CO₂</div>
                  <div className="metric-value">{result.new_co2_ppm}</div>
                  <div className="metric-change down">ppm (ML prediction)</div>
                </div>
                <div className="card metric-card blue" style={{ background: 'rgba(59,130,246,0.05)' }}>
                  <div className="metric-label">CO₂ Reduction</div>
                  <div className="metric-value">{result.reduction_percentage}%</div>
                  <div className="metric-change down">{result.total_co2_reduction_ppm} ppm reduced</div>
                </div>
              </div>

              {/* Action Impact with ML details */}
              {result.action_results?.length > 0 && (
                <>
                  <h4 style={{ marginTop: 20, marginBottom: 12, fontSize: 14 }}>
                    ML-Adjusted Action Impact
                  </h4>

                  {/* Table with modifiers */}
                  <div style={{ overflowX: 'auto', marginBottom: 16 }}>
                    <table className="data-table" style={{ width: '100%' }}>
                      <thead>
                        <tr>
                          <th>Action</th>
                          <th>Qty</th>
                          <th>Base Rate</th>
                          <th>Env Modifier</th>
                          <th>Adjusted Rate</th>
                          <th>CO₂ Change</th>
                          <th>Confidence</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.action_results.map((a, i) => (
                          <tr key={i}>
                            <td style={{ fontWeight: 600 }}>{a.label}</td>
                            <td>{a.quantity.toLocaleString()} {a.unit}</td>
                            <td>{a.base_rate}</td>
                            <td>
                              <span style={{
                                fontWeight: 700,
                                color: a.env_modifier > 1 ? '#22c55e' : a.env_modifier < 1 ? '#f97316' : '#94a3b8',
                              }}>
                                ×{a.env_modifier}
                              </span>
                            </td>
                            <td>{a.adjusted_rate}</td>
                            <td style={{ color: a.co2_change_ppm >= 0 ? '#22c55e' : '#ef4444', fontWeight: 700 }}>
                              {a.co2_change_ppm >= 0 ? `−${a.co2_change_ppm}` : `+${Math.abs(a.co2_change_ppm)}`} ppm
                            </td>
                            <td>
                              <span style={{
                                padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600,
                                background: a.confidence_pct > 80 ? 'rgba(34,197,94,0.15)' : a.confidence_pct > 60 ? 'rgba(234,179,8,0.15)' : 'rgba(239,68,68,0.15)',
                                color: a.confidence_pct > 80 ? '#22c55e' : a.confidence_pct > 60 ? '#eab308' : '#ef4444',
                              }}>
                                {a.confidence_pct}%
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Modifier explanations */}
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
                    {result.action_results.map((a, i) => (
                      <div key={i} style={{
                        fontSize: 11, padding: '4px 10px', borderRadius: 6,
                        background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
                        color: '#94a3b8',
                      }}>
                        <strong>{a.label}:</strong> {a.modifier_explanation}
                      </div>
                    ))}
                  </div>

                  {/* Bar Chart */}
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={result.action_results} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                      <XAxis type="number" stroke="#64748b" fontSize={12} />
                      <YAxis type="category" dataKey="label" stroke="#64748b" fontSize={12} width={140} />
                      <Tooltip
                        contentStyle={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 10, color: '#0f172a' }}
                        formatter={(v, name) => [`${v} ppm`, 'CO₂ Change']}
                      />
                      <Bar dataKey="co2_change_ppm" radius={[0, 6, 6, 0]}>
                        {result.action_results.map((entry, i) => (
                          <Cell key={i} fill={entry.co2_change_ppm >= 0 ? '#22c55e' : '#ef4444'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </>
              )}

              {/* Implementation Timeline */}
              {result.implementation_timeline && (
                <div style={{ marginTop: 24 }}>
                  <h4 style={{ marginBottom: 12, fontSize: 14 }}>📅 Implementation Timeline (12 months)</h4>
                  <ResponsiveContainer width="100%" height={240}>
                    <LineChart data={result.implementation_timeline}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                      <XAxis dataKey="month" stroke="#64748b" fontSize={12} label={{ value: 'Month', position: 'insideBottom', offset: -5 }} />
                      <YAxis stroke="#64748b" fontSize={12} />
                      <Tooltip
                        contentStyle={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 10, color: '#0f172a' }}
                        formatter={(v, name) => [name === 'co2_ppm' ? `${v} ppm` : `${v}%`, name === 'co2_ppm' ? 'Predicted CO₂' : 'Impact Realized']}
                      />
                      <Legend />
                      <Line type="monotone" dataKey="co2_ppm" name="CO₂ (ppm)" stroke="#3b82f6" strokeWidth={2.5} dot={false} />
                      <Line type="monotone" dataKey="realized_pct" name="Impact %" stroke="#22c55e" strokeWidth={2} dot={false} strokeDasharray="5 5" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
