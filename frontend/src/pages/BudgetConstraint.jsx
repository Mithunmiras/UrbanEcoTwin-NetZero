import { useState } from 'react';
import { api } from '../api/client';
import { useStateContext } from '../context/StateContext';

export default function BudgetConstraint() {
  const { selectedState, stateName } = useStateContext();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [budgetCr, setBudgetCr] = useState('');

  const fetchWithBudget = () => {
    if (!budgetCr || Number(budgetCr) <= 0) return;
    setLoading(true);
    api.getOptimize(null, budgetCr, selectedState).then(d => {
      setData(d);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  const bc = data?.budget_constrained;

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1>💰 Dynamic Budget Constraint</h1>
        <p>Enter budget in Crores to see optimized zone allocation under budget limits</p>
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
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
            disabled={loading || !budgetCr || Number(budgetCr) <= 0}
            style={{
              cursor: loading || !budgetCr ? 'not-allowed' : 'pointer',
              padding: '10px 20px',
              borderRadius: 8,
              background: '#a855f7',
              color: 'white',
              border: 'none',
              fontWeight: 600,
              opacity: loading || !budgetCr || Number(budgetCr) <= 0 ? 0.6 : 1,
            }}
          >
            {loading ? 'Applying...' : 'Apply'}
          </button>
        </div>

        {!bc && !loading && (
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 8 }}>
            Enter budget in Crores (e.g. 100 for ₹100 Cr) and click Apply to see which zones get funded and their strategies.
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
                      padding: '12px 16px',
                      borderBottom: '1px solid var(--border-glass)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: 16,
                      flexWrap: 'wrap',
                      background: r.best_strategy ? 'rgba(34,197,94,0.04)' : r.note?.startsWith('Not Required') ? 'rgba(100,116,139,0.06)' : r.note?.startsWith('Requires') ? 'rgba(245,158,11,0.06)' : 'transparent',
                      borderRadius: 8,
                      marginBottom: 4,
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
    </div>
  );
}
