import { useState, useEffect } from 'react';
import { api } from '../api/client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { BrainCircuit, Cpu, GitMerge, Activity, Search, Globe2, Landmark, Building2 } from 'lucide-react';

const CITY_LABELS = { chennai: 'Chennai', coimbatore: 'Coimbatore', madurai: 'Madurai' };
const CITY_ICONS = { chennai: Landmark, coimbatore: Building2, madurai: Building2 };

export default function Optimize() {
  const [selectedCity, setSelectedCity] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    api.getCities().then(d => setCities(d.cities)).catch(() => { });
  }, []);

  useEffect(() => {
    if (!selectedCity) { setData(null); return; }
    setLoading(true);
    api.getOptimize().then(d => {
      const filtered = d.optimization_results.filter(z => z.zone_id.startsWith(selectedCity));
      setData({ ...d, optimization_results: filtered });
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [selectedCity]);

  if (!selectedCity) {
    return (
      <div className="fade-in">
        <div className="page-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <h1><BrainCircuit size={28} style={{ color: '#3b82f6' }} /> Reinforcement Learning Optimizer</h1>
          </div>
          <p>select the city to get strategies:</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginTop: 24 }}>
          {cities.map(city => {
            const IconComponent = CITY_ICONS[city.id] || Globe2;
            return (
              <div
                key={city.id}
                className="card"
                onClick={() => setSelectedCity(city.id)}
                style={{ cursor: 'pointer', textAlign: 'center', padding: '40px 24px', transition: 'all 0.3s ease', border: '1px solid rgba(255,255,255,0.06)' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = '#3b82f6'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; }}
              >
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
                  <IconComponent size={48} color="#94a3b8" />
                </div>
                <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>{city.name}</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>View RL strategies for {city.name}</p>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (loading) return <div className="loading"><div className="loading-spinner"></div><p>Running RL optimizer for {CITY_LABELS[selectedCity]}...</p></div>;
  if (!data) return <div className="loading"><p>Failed to load data.</p></div>;

  const results = data.optimization_results;

  return (
    <div className="fade-in">
      <div className="page-header" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => setSelectedCity(null)} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 8, padding: '6px 14px', color: '#94a3b8', cursor: 'pointer', fontSize: 13 }}>← Change City</button>
          <h1 style={{ margin: 0 }}>🧠 {CITY_LABELS[selectedCity]} RL Optimizer</h1>
        </div>
      </div>

      {results?.map(zone => (
        <div className="card" key={zone.zone_id} style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <h3 style={{ fontSize: 18 }}>{zone.zone_name}</h3>
              <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Current CO₂: {zone.current_co2_ppm} ppm • RL iterations: {zone.rl_iterations} • Convergence: {zone.convergence_score}</span>
            </div>
            <span className="badge low">Best: {zone.best_strategy?.strategy_name}</span>
          </div>

          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={zone.all_strategies} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
              <XAxis type="number" stroke="#64748b" fontSize={12} />
              <YAxis type="category" dataKey="strategy_name" stroke="#64748b" fontSize={11} width={160} />
              <Tooltip contentStyle={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 10, color: '#0f172a' }} />
              <Bar dataKey="reduction_pct" radius={[0, 6, 6, 0]}>
                {zone.all_strategies.map((s, i) => (
                  <Cell key={i} fill={i === 0 ? '#22c55e' : '#3b82f6'} fillOpacity={i === 0 ? 1 : 0.5} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          <div style={{ marginTop: 12, padding: 16, background: 'rgba(34,197,94,0.05)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(34,197,94,0.15)' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent-green)', marginBottom: 4 }}>🏆 Best Strategy: {zone.best_strategy?.strategy_name}</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
              {zone.best_strategy?.description} • Reduction: {zone.best_strategy?.reduction_pct}% • Cost: ₹{zone.best_strategy?.estimated_cost_inr?.toLocaleString()} • Efficiency: {zone.best_strategy?.efficiency_score}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
