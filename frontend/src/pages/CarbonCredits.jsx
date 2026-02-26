import { useState, useEffect } from 'react';
import { api } from '../api/client';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const COLORS = ['#22c55e', '#3b82f6', '#f97316', '#a855f7', '#eab308'];

export default function CarbonCredits() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getCarbonCredits().then(d => { setData(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading"><div className="loading-spinner"></div><p>Calculating carbon credits...</p></div>;
  if (!data) return <div className="loading"><p>Failed to load data.</p></div>;

  const pieData = data.carbon_credit_analysis?.map(z => ({ name: z.zone_name, value: z.reduction_tonnes }));

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1>💰 Carbon Credit Calculator</h1>
        <p>Market: {data.market_rates?.market} — Rate: {data.market_rates?.rate_per_tonne_inr}/tonne</p>
      </div>

      <div className="card-grid">
        <div className="card metric-card green">
          <div className="metric-label">Total CO₂ Reduction</div>
          <div className="metric-value">{data.city_totals?.total_reduction_tonnes}</div>
          <div className="metric-change">tonnes potential</div>
        </div>
        <div className="card metric-card blue">
          <div className="metric-label">Credit Value (INR)</div>
          <div className="metric-value" style={{ fontSize: 24 }}>{data.city_totals?.total_credits_inr}</div>
          <div className="metric-change down">potential earnings</div>
        </div>
        <div className="card metric-card purple">
          <div className="metric-label">Credit Value (USD)</div>
          <div className="metric-value" style={{ fontSize: 24 }}>{data.city_totals?.total_credits_usd}</div>
          <div className="metric-change down">international market</div>
        </div>
        <div className="card metric-card orange">
          <div className="metric-label">Credits Earned</div>
          <div className="metric-value">{data.city_totals?.total_credits_earned}</div>
          <div className="metric-change">carbon credits</div>
        </div>
      </div>

      <div className="card-grid-3">
        <div className="card chart-card">
          <h3>CO₂ Reduction by Zone</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" outerRadius={110} innerRadius={65} dataKey="value" paddingAngle={3} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {pieData?.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#f1f5f9' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card" style={{ gridColumn: 'span 2' }}>
          <h3 style={{ marginBottom: 16 }}>Zone-wise Carbon Credits</h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>Zone</th>
                <th>Current CO₂</th>
                <th>Target</th>
                <th>Reduction</th>
                <th>Credits (INR)</th>
                <th>Credits (USD)</th>
              </tr>
            </thead>
            <tbody>
              {data.carbon_credit_analysis?.map(z => (
                <tr key={z.zone_id}>
                  <td style={{ fontWeight: 600 }}>{z.zone_name}</td>
                  <td>{z.current_co2_ppm} ppm</td>
                  <td>{z.target_co2_ppm} ppm</td>
                  <td style={{ color: 'var(--accent-green)' }}>{z.reduction_tonnes} tonnes</td>
                  <td style={{ fontWeight: 600 }}>{z.carbon_credits?.value_inr}</td>
                  <td>{z.carbon_credits?.value_usd}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
