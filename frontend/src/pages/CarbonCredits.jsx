import { useState, useEffect } from 'react';
import { api } from '../api/client';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { MapPin, CircleDollarSign } from 'lucide-react';

const COLORS = ['#22c55e', '#3b82f6', '#f97316', '#a855f7', '#eab308', '#ef4444', '#14b8a6', '#f43f5e', '#8b5cf6', '#06b6d4'];

export default function CarbonCredits() {
  const [data, setData] = useState(null);
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getCities(),
      api.getCarbonCredits()
    ]).then(([citiesData, creditsData]) => {
      setCities(citiesData.cities);
      setData(creditsData);
      if (citiesData.cities.length > 0) {
        setSelectedCity(citiesData.cities[0].id);
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading"><div className="loading-spinner"></div><p>Calculating carbon credits...</p></div>;
  if (!data || !selectedCity) return <div className="loading"><p>Failed to load data.</p></div>;

  const currentCity = cities.find(c => c.id === selectedCity);

  // Filter analysis data for selected city
  const filteredAnalysis = data.carbon_credit_analysis?.filter(z => z.zone_id.startsWith(selectedCity)) || [];

  // Recalculate totals for selected city
  const cityReduction = filteredAnalysis.reduce((sum, z) => sum + z.reduction_tonnes, 0);
  const cityCreditsEarned = filteredAnalysis.reduce((sum, z) => sum + (z.carbon_credits?.credits_earned || 0), 0);

  // Rate parsing for total recalculations
  const rateInr = parseFloat(data.market_rates?.rate_per_tonne_inr?.replace(/[^0-9.]/g, '') || 500);
  const rateUsd = parseFloat(data.market_rates?.rate_per_tonne_usd?.replace(/[^0-9.]/g, '') || 6);

  const cityValueInrFormat = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(cityReduction * rateInr);
  const cityValueUsdFormat = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cityReduction * rateUsd);

  const pieData = filteredAnalysis.map(z => ({ name: z.zone_name, value: z.reduction_tonnes }));

  return (
    <div className="fade-in">
      <div className="page-header" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <h1><CircleDollarSign size={28} style={{ color: '#f97316' }} /> Carbon Credit Calculator</h1>
          </div>

          {/* City Selector */}
          <div style={{ display: 'flex', gap: 8 }}>
            {cities.map(city => (
              <button
                key={city.id}
                onClick={() => setSelectedCity(city.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  background: selectedCity === city.id ? '#3b82f6' : 'rgba(0,0,0,0.05)',
                  color: selectedCity === city.id ? '#fff' : '#cbd5e1',
                  border: selectedCity === city.id ? '1px solid #3b82f6' : '1px solid rgba(0,0,0,0.1)',
                  padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s',
                  fontWeight: selectedCity === city.id ? 600 : 400
                }}
              >
                <MapPin size={16} />
                {city.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="card-grid">
        <div className="card metric-card green">
          <div className="metric-label">{currentCity?.name} CO₂ Reduction</div>
          <div className="metric-value">{cityReduction.toFixed(2)}</div>
          <div className="metric-change">tonnes potential</div>
        </div>
        <div className="card metric-card blue">
          <div className="metric-label">{currentCity?.name} Value (INR)</div>
          <div className="metric-value" style={{ fontSize: 24 }}>{cityValueInrFormat}</div>
          <div className="metric-change down">potential earnings</div>
        </div>
        <div className="card metric-card purple">
          <div className="metric-label">{currentCity?.name} Value (USD)</div>
          <div className="metric-value" style={{ fontSize: 24 }}>{cityValueUsdFormat}</div>
          <div className="metric-change down">international market</div>
        </div>
        <div className="card metric-card orange">
          <div className="metric-label">{currentCity?.name} Credits</div>
          <div className="metric-value">{cityCreditsEarned.toFixed(2)}</div>
          <div className="metric-change">carbon credits earned</div>
        </div>
      </div>

      <div className="card-grid-3">
        <div className="card chart-card">
          <h3>CO₂ Reduction Share ({currentCity?.name})</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                innerRadius={60}
                dataKey="value"
                paddingAngle={2}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={{ stroke: 'rgba(0,0,0,0.2)' }}
              >
                {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip
                contentStyle={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 10, color: '#0f172a' }}
                itemStyle={{ color: '#0f172a' }}
                formatter={(value) => [`${value.toFixed(1)} tonnes`, 'Reduction']}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card" style={{ gridColumn: 'span 2' }}>
          <h3 style={{ marginBottom: 16 }}>Zone-wise Breakdown ({currentCity?.name})</h3>
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
              {filteredAnalysis.map(z => (
                <tr key={z.zone_id}>
                  <td style={{ fontWeight: 600 }}>{z.zone_name}</td>
                  <td>{z.current_co2_ppm} ppm</td>
                  <td>{z.target_co2_ppm} ppm</td>
                  <td style={{ color: 'var(--accent-green)' }}>{z.reduction_tonnes.toFixed(2)} tonnes</td>
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
