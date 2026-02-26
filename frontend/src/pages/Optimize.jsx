import { useState, useEffect } from 'react';
import { api } from '../api/client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function Optimize() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getOptimize().then(d => { setData(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading"><div className="loading-spinner"></div><p>Running RL optimizer...</p></div>;
  if (!data) return <div className="loading"><p>Failed to load data.</p></div>;

  const results = data.optimization_results;

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1>🧠 Reinforcement Learning Optimizer</h1>
        <p>Algorithm: {data.algorithm} • {data.training_episodes} training episodes</p>
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
