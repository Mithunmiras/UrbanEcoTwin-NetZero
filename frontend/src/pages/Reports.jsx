import { useState, useEffect } from 'react';
import { api } from '../api/client';
import { useStateContext } from '../context/StateContext';
import { FileText, Building2, ListChecks, Target, Wallet } from 'lucide-react';

export default function Reports() {
  const { selectedState, stateName } = useStateContext();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Budget Constraint State
  const [budgetData, setBudgetData] = useState(null);
  const [budgetLoading, setBudgetLoading] = useState(false);
  const [budgetCr, setBudgetCr] = useState('');

  useEffect(() => {
    setLoading(true);
    // Reset budget data when state changes
    setBudgetData(null);
    setBudgetCr('');
    api.getReport(selectedState).then(d => { setData(d); setLoading(false); }).catch(() => setLoading(false));
  }, [selectedState]);

  const fetchWithBudget = () => {
    if (!budgetCr || Number(budgetCr) <= 0) return;
    setBudgetLoading(true);
    api.getOptimize(null, budgetCr, selectedState).then(d => {
      setBudgetData(d);
      setBudgetLoading(false);
    }).catch(() => setBudgetLoading(false));
  };

  if (loading) return <div className="loading"><div className="loading-spinner"></div><p>Generating policy report...</p></div>;
  if (!data) return <div className="loading"><p>Failed to load data.</p></div>;

  const exec = data.executive_summary;
  const bc = budgetData?.budget_constrained;

  return (
    <div className="fade-in">
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <h1><FileText size={28} style={{ color: '#64748b' }} /> Policy & Budget Report</h1>
        </div>
      </div>

      {/* Dynamic Budget Optimizer */}
      <div className="card" style={{ marginBottom: 24 }}>
        <h3 style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}><Wallet size={20} color="#a855f7" /> Dynamic Budget Constraint</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: bc ? 12 : 0 }}>
          <label style={{ fontWeight: 600 }}>Budget (₹ Crores):</label>
          <input
            type="number"
            placeholder="e.g. 100 (₹100 Cr)"
            value={budgetCr}
            onChange={e => setBudgetCr(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && fetchWithBudget()}
            min="1"
            style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border-glass)', maxWidth: 200, background: 'var(--surface)', fontSize: 14 }}
          />
          <button
            onClick={fetchWithBudget}
            disabled={budgetLoading || !budgetCr || Number(budgetCr) <= 0}
            style={{
              cursor: budgetLoading || !budgetCr ? 'not-allowed' : 'pointer',
              padding: '10px 20px', borderRadius: 8, background: '#a855f7', color: 'white',
              border: 'none', fontWeight: 600, opacity: budgetLoading || !budgetCr || Number(budgetCr) <= 0 ? 0.6 : 1,
            }}
          >
            {budgetLoading ? 'Applying...' : 'Optimize Allocation'}
          </button>
        </div>

        {!bc && !budgetLoading && (
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 8 }}>
            Enter a budget in Crores to generate dynamic zone allocations for maximum impact.
          </p>
        )}

        {bc && (
          <div style={{ marginTop: 16, padding: 16, background: 'var(--surface)', borderRadius: 8, border: '1px solid var(--border-glass)' }}>
            <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid var(--border-glass)' }}>
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>Budget</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: '#a855f7' }}>₹{(bc.budget_constraint_inr / 10000000).toFixed(0)} Cr</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>Spent</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: '#22c55e' }}>₹{(bc.total_spent_inr / 10000000).toFixed(1)} Cr</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>Zones Funded</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: '#22c55e' }}>{bc.zones_funded}</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>Not Required</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: '#64748b' }}>{bc.zones_not_required ?? 0}</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>Underfunded</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: bc.zones_underfunded > 0 ? '#f59e0b' : '#64748b' }}>{bc.zones_underfunded ?? 0}</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>CO₂ Reduction</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: '#22c55e' }}>{bc.total_co2_reduction_ppm} ppm</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>Budget Still Required</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: '#f59e0b' }}>₹{Math.max(0, (bc.budget_constraint_inr - bc.total_spent_inr) / 10000000).toFixed(1)} Cr</div>
              </div>
            </div>

            {bc.results?.length > 0 && (
              <div style={{ maxHeight: 400, overflowY: 'auto' }}>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Zone Allocation</div>
                {bc.results.map((r, j) => (
                  <div
                    key={j}
                    style={{
                      padding: '12px 16px', borderBottom: '1px solid var(--border-glass)', display: 'flex',
                      justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap',
                      background: r.best_strategy ? 'rgba(34,197,94,0.04)' : r.note?.startsWith('Not Required') ? 'rgba(100,116,139,0.06)' : r.note?.startsWith('Requires') ? 'rgba(245,158,11,0.06)' : 'transparent',
                      borderRadius: 8, marginBottom: 4,
                    }}
                  >
                    <div>
                      <span style={{ fontWeight: 600, fontSize: 14 }}>{r.zone_name}</span>
                    </div>
                    {r.best_strategy ? (
                      <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
                        {r.need_score != null && (
                          <span style={{ fontSize: 11, color: 'var(--text-muted)', background: r.need_level === 'high' ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.1)', padding: '2px 8px', borderRadius: 4 }}>
                            Need: {r.need_score}
                          </span>
                        )}
                        <span style={{ color: '#22c55e', fontWeight: 600 }}>✓ {r.best_strategy.strategy_name}</span>
                        <span style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
                          {r.best_strategy.reduction_pct}% reduction • ₹{(r.budget_used / 10000000).toFixed(1)} Cr
                        </span>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                        {r.need_score != null && r.need_level !== 'low' && (
                          <span style={{ fontSize: 11, color: '#f59e0b', background: 'rgba(245,158,11,0.1)', padding: '2px 8px', borderRadius: 4 }}>Need: {r.need_score}</span>
                        )}
                        <span style={{ color: r.note?.startsWith('Not Required') ? '#22c55e' : r.note?.startsWith('Requires') ? '#f59e0b' : 'var(--text-muted)', fontSize: 13 }}>{r.note}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Report Header */}
      <div className="card" style={{ marginBottom: 24, background: 'linear-gradient(135deg, rgba(34,197,94,0.08), rgba(59,130,246,0.08))' }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>{data.title}</h2>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 16 }}>{data.subtitle}</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase' }}>City</div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>{exec?.city}</div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Zones Analyzed</div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>{exec?.zones_analyzed}</div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Avg CO₂</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--accent-orange)' }}>{exec?.current_avg_co2_ppm} ppm</div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Sustainability Grade</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--accent-green)' }}>{exec?.sustainability_grade} ({exec?.sustainability_score}/100)</div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Net-Zero Target</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--accent-blue)' }}>{exec?.net_zero_target_year}</div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Carbon Credit Potential</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--accent-purple)' }}>{exec?.total_carbon_credit_potential}</div>
          </div>
        </div>
      </div>

      {/* Pollution Overview */}
      <div className="card" style={{ marginBottom: 24 }}>
        <h3 style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}><Building2 size={20} color="var(--accent-blue)" /> Current State — {data.current_state?.worst_zone} is the most polluted zone</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Zone</th>
              <th>CO₂ (ppm)</th>
              <th>AQI</th>
            </tr>
          </thead>
          <tbody>
            {data.current_state?.pollution_overview?.map((z, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 600 }}>{z.zone}</td>
                <td style={{ color: z.co2_ppm > 440 ? 'var(--accent-red)' : 'var(--accent-green)' }}>{z.co2_ppm}</td>
                <td style={{ color: z.aqi > 120 ? 'var(--accent-orange)' : 'var(--accent-green)' }}>{z.aqi}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Recommendations */}
      <div className="card" style={{ marginBottom: 24 }}>
        <h3 style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}><ListChecks size={20} color="var(--accent-orange)" /> Policy Recommendations</h3>
        {data.recommendations?.map((r, i) => (
          <div key={i} className={`alert-item ${r.priority.toLowerCase()}`}>
            <div className="alert-content">
              <h4><span className={`badge ${r.priority.toLowerCase()}`} style={{ marginRight: 8 }}>{r.priority}</span>{r.action}</h4>
              <p>Expected Impact: {r.expected_impact} • Timeline: {r.timeline} • Cost: {r.estimated_cost}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Net-Zero Summary */}
      <div className="card">
        <h3 style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}><Target size={20} color="var(--accent-green)" /> Net-Zero Roadmap Summary</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
          <div style={{ padding: 16, borderRadius: 'var(--radius-sm)', background: 'var(--bg-glass)' }}>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Target Year</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--accent-green)' }}>{data.net_zero_roadmap_summary?.target_year}</div>
          </div>
          <div style={{ padding: 16, borderRadius: 'var(--radius-sm)', background: 'var(--bg-glass)' }}>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Phases</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--accent-blue)' }}>{data.net_zero_roadmap_summary?.phases}</div>
          </div>
          <div style={{ padding: 16, borderRadius: 'var(--radius-sm)', background: 'var(--bg-glass)' }}>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Investment</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--accent-orange)' }}>{data.net_zero_roadmap_summary?.total_investment}</div>
          </div>
          <div style={{ padding: 16, borderRadius: 'var(--radius-sm)', background: 'var(--bg-glass)' }}>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Carbon Credits</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--accent-purple)' }}>{data.net_zero_roadmap_summary?.carbon_credits_potential}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
