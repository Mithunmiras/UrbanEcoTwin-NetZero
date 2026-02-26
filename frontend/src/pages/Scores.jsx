import { useState, useEffect } from 'react';
import { api } from '../api/client';
import { useStateContext } from '../context/StateContext';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { Star, Coins, TrendingDown, Leaf } from 'lucide-react';

const PIE_COLORS = ['#22c55e', '#3b82f6', '#f97316', '#a855f7', '#eab308', '#ef4444', '#14b8a6', '#f43f5e', '#8b5cf6', '#06b6d4'];

export default function Scores() {
  const { selectedState, stateName } = useStateContext();
  const [data, setData] = useState(null);
  const [creditsData, setCreditsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.getScores(selectedState),
      api.getCarbonCredits(undefined, selectedState),
    ]).then(([scores, credits]) => {
      setData(scores);
      setCreditsData(credits);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [selectedState]);

  if (loading) return <div className="loading"><div className="loading-spinner"></div><p>Calculating scores...</p></div>;
  if (!data) return <div className="loading"><p>Failed to load data.</p></div>;

  const gradeColors = { 'A+': '#22c55e', 'A': '#22c55e', 'B+': '#84cc16', 'B': '#eab308', 'C': '#f97316', 'D': '#ef4444', 'F': '#dc2626' };

  // Carbon credits summary
  const creditAnalysis = creditsData?.carbon_credit_analysis || [];
  const cityTotals = creditsData?.city_totals || {};
  const topCredits = [...creditAnalysis].sort((a, b) => b.reduction_tonnes - a.reduction_tonnes).slice(0, 8);
  const pieData = topCredits.map(z => ({ name: z.zone_name, value: z.reduction_tonnes }));

  return (
    <div className="fade-in">
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <h1><Star size={28} style={{ color: '#eab308' }} /> Sustainability & Carbon Credits</h1>
        </div>
      </div>

      {/* ── Sustainability Overview ─────────────────────────────── */}
      <div className="card" style={{ marginBottom: 24, textAlign: 'center', padding: 32 }}>
        <div style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 8 }}>{stateName} Average Sustainability Score</div>
        <div style={{ fontSize: 64, fontWeight: 800, background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
          {data.city_average_score}<span style={{ fontSize: 24 }}>/100</span>
        </div>
        <div style={{ fontSize: 16, fontWeight: 600, color: gradeColors[data.city_grade] }}>Grade: {data.city_grade}</div>
      </div>

      {/* ── Carbon Credits Summary ──────────────────────────────── */}
      {creditsData && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <Coins size={22} style={{ color: '#f97316' }} />
            <h2 style={{ margin: 0, fontSize: 20 }}>Carbon Credits</h2>
          </div>

          <div className="card-grid">
            <div className="card metric-card green">
              <div className="metric-label"><TrendingDown size={16} style={{ marginRight: 4 }} /> Total CO₂ Reduction</div>
              <div className="metric-value">{cityTotals.total_reduction_tonnes}</div>
              <div className="metric-change">tonnes potential</div>
            </div>
            <div className="card metric-card blue">
              <div className="metric-label"><Coins size={16} style={{ marginRight: 4 }} /> Total Value (INR)</div>
              <div className="metric-value" style={{ fontSize: 24 }}>{cityTotals.total_credits_inr}</div>
              <div className="metric-change down">potential earnings</div>
            </div>
            <div className="card metric-card orange">
              <div className="metric-label"><Leaf size={16} style={{ marginRight: 4 }} /> Credits Earned</div>
              <div className="metric-value">{cityTotals.total_credits_earned}</div>
              <div className="metric-change">carbon credits total</div>
            </div>
          </div>

          <div className="card-grid" style={{ gridTemplateColumns: '1fr 2fr', marginTop: 20, marginBottom: 28 }}>
            <div className="card chart-card">
              <h3>Top CO₂ Reduction Zones</h3>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" outerRadius={95} innerRadius={55} dataKey="value" paddingAngle={2}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={{ stroke: 'rgba(0,0,0,0.2)' }}>
                    {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#fff', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 10, color: '#0f172a' }}
                    formatter={(v) => [`${v.toFixed(1)} tonnes`, 'Reduction']} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="card">
              <h3 style={{ marginBottom: 12 }}>Zone-wise Carbon Credit Breakdown</h3>
              <div style={{ maxHeight: 280, overflowY: 'auto' }}>
                <table className="data-table">
                  <thead><tr><th>Zone</th><th>CO₂ (ppm)</th><th>Target</th><th>Reduction</th><th>Credits (INR)</th></tr></thead>
                  <tbody>
                    {creditAnalysis.slice(0, 20).map(z => (
                      <tr key={z.zone_id}>
                        <td style={{ fontWeight: 600 }}>{z.zone_name}</td>
                        <td>{z.current_co2_ppm} ppm</td>
                        <td>{z.target_co2_ppm} ppm</td>
                        <td style={{ color: 'var(--accent-green)' }}>{z.reduction_tonnes.toFixed(2)} t</td>
                        <td style={{ fontWeight: 600 }}>{z.carbon_credits?.value_inr}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {creditsData.market_rates && (
                <div style={{ marginTop: 10, fontSize: 12, color: 'var(--text-muted)' }}>
                  Market rate: {creditsData.market_rates.rate_per_tonne_inr}/tonne
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* ── Zone Sustainability Cards ──────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <Star size={22} style={{ color: '#eab308' }} />
        <h2 style={{ margin: 0, fontSize: 20 }}>Zone Sustainability Scores</h2>
      </div>

      <div className="card-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))' }}>
        {data.zone_scores?.map(zone => {
          const radarData = Object.entries(zone.breakdown).map(([key, val]) => ({
            factor: key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
            score: val,
          }));

          // Find matching carbon credit data for this zone
          const zoneCredit = creditAnalysis.find(c => c.zone_id === zone.zone_id);

          return (
            <div className="card" key={zone.zone_id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <h3 style={{ fontSize: 18 }}>{zone.zone_name}</h3>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 28, fontWeight: 800, color: gradeColors[zone.grade] }}>{zone.sustainability_score}</div>
                  <div style={{ fontSize: 12, color: gradeColors[zone.grade], fontWeight: 600 }}>Grade {zone.grade}</div>
                </div>
              </div>

              <ResponsiveContainer width="100%" height={220}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="rgba(0,0,0,0.08)" />
                  <PolarAngleAxis dataKey="factor" stroke="#64748b" fontSize={10} />
                  <Radar dataKey="score" stroke="#22c55e" fill="#22c55e" fillOpacity={0.15} strokeWidth={2} />
                  <Tooltip contentStyle={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 10, color: '#0f172a' }} />
                </RadarChart>
              </ResponsiveContainer>

              {/* Carbon credit info for this zone */}
              {zoneCredit && (
                <div style={{ display: 'flex', gap: 12, marginTop: 8, padding: '8px 12px', background: 'rgba(34,197,94,0.06)', borderRadius: 8, fontSize: 12 }}>
                  <span><strong>CO₂ Reduction:</strong> {zoneCredit.reduction_tonnes.toFixed(1)}t</span>
                  <span><strong>Credits:</strong> {zoneCredit.carbon_credits?.value_inr}</span>
                </div>
              )}

              <div style={{ marginTop: 8 }}>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>Areas to improve:</div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {zone.improvement_areas?.map((area, i) => (
                    <span key={i} className="badge warning" style={{ fontSize: 10 }}>{area.replace(/_/g, ' ')}</span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
