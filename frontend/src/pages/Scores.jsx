import { useState, useEffect } from 'react';
import { api } from '../api/client';
import { useStateContext } from '../context/StateContext';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { Star, MapPin, CircleDollarSign } from 'lucide-react';

const COLORS = ['#22c55e', '#3b82f6', '#f97316', '#a855f7', '#eab308', '#ef4444', '#14b8a6', '#f43f5e', '#8b5cf6', '#06b6d4'];

export default function Scores() {
  const { selectedState, stateName } = useStateContext();
  const [data, setData] = useState(null);
  const [creditsData, setCreditsData] = useState(null);
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.getScores(selectedState),
      api.getCities(selectedState),
      api.getCarbonCredits(undefined, selectedState)
    ]).then(([scoresData, citiesData, credits]) => {
      setData(scoresData);
      setCities(citiesData.cities);
      setCreditsData(credits);
      if (citiesData.cities.length > 0) {
        setSelectedCity(citiesData.cities[0].id);
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [selectedState]);

  if (loading) return <div className="loading"><div className="loading-spinner"></div><p>Calculating sustainability & credits...</p></div>;
  if (!data || !creditsData || !selectedCity) return <div className="loading"><p>Failed to load data.</p></div>;

  const gradeColors = { 'A+': '#22c55e', 'A': '#22c55e', 'B+': '#84cc16', 'B': '#eab308', 'C': '#f97316', 'D': '#ef4444', 'F': '#dc2626' };

  // City Filtering Logic
  const currentCity = cities.find(c => c.id === selectedCity);
  const cityScoreData = data.zone_scores?.filter(z => z.zone_id.startsWith(selectedCity)) || [];
  const cityCreditData = creditsData.carbon_credit_analysis?.filter(z => z.zone_id.startsWith(selectedCity)) || [];

  // Recalculate Totals
  const cityReduction = cityCreditData.reduce((sum, z) => sum + z.reduction_tonnes, 0);
  const cityCreditsEarned = cityCreditData.reduce((sum, z) => sum + (z.carbon_credits?.credits_earned || 0), 0);
  const rateInr = parseFloat(creditsData.market_rates?.rate_per_tonne_inr?.replace(/[^0-9.]/g, '') || 500);
  const cityValueInrFormat = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(cityReduction * rateInr);

  const pieData = cityCreditData.map(z => ({ name: z.zone_name, value: z.reduction_tonnes }));

  // Calculate specific City Average Score
  const currentCityAvgScore = cityScoreData.length > 0
    ? Math.round(cityScoreData.reduce((sum, z) => sum + z.sustainability_score, 0) / cityScoreData.length)
    : data.city_average_score;

  const currentCityGrade = cityScoreData.length > 0
    ? (currentCityAvgScore >= 90 ? 'A+' : currentCityAvgScore >= 80 ? 'A' : currentCityAvgScore >= 75 ? 'B+' : currentCityAvgScore >= 70 ? 'B' : currentCityAvgScore >= 60 ? 'C' : currentCityAvgScore >= 50 ? 'D' : 'F')
    : data.city_grade;

  return (
    <div className="fade-in">
      <div className="page-header" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <h1><Star size={28} style={{ color: '#eab308' }} /> Sustainability & Credits</h1>
          </div>

          {/* City Selector */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {cities.map(city => (
              <button
                key={city.id}
                onClick={() => setSelectedCity(city.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  background: selectedCity === city.id ? '#3b82f6' : 'rgba(0,0,0,0.05)',
                  color: selectedCity === city.id ? '#fff' : 'var(--text-secondary)',
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

      {/* Unified Metrics Row */}
      <div className="card-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', marginBottom: 24 }}>
        <div className="card metric-card" style={{ borderTop: `4px solid ${gradeColors[currentCityGrade]}` }}>
          <div className="metric-label">{currentCity?.name} Sustainability</div>
          <div className="metric-value">{currentCityAvgScore}<span style={{ fontSize: 18, opacity: 0.5 }}>/100</span></div>
          <div className="metric-change" style={{ color: gradeColors[currentCityGrade] }}>Grade: {currentCityGrade}</div>
        </div>
        <div className="card metric-card green">
          <div className="metric-label">Total CO₂ Reduction</div>
          <div className="metric-value">{cityReduction.toFixed(2)}</div>
          <div className="metric-change">tonnes potential</div>
        </div>
        <div className="card metric-card orange">
          <div className="metric-label">Credits Earned</div>
          <div className="metric-value">{cityCreditsEarned.toFixed(2)}</div>
          <div className="metric-change">carbon credits registered</div>
        </div>
        <div className="card metric-card blue">
          <div className="metric-label">Credit Value (INR)</div>
          <div className="metric-value" style={{ fontSize: 24 }}>{cityValueInrFormat}</div>
          <div className="metric-change down">potential market earnings</div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="card-grid-3">
        {/* Sustainability Radar Panel */}
        <div className="card chart-card" style={{ gridColumn: 'span 2' }}>
          <h3 style={{ marginBottom: 16 }}>Regional Sustainability Breakdown ({currentCity?.name})</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
            {cityScoreData.map(zone => {
              const radarData = Object.entries(zone.breakdown).map(([key, val]) => ({
                factor: key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
                score: val,
              }));

              return (
                <div key={zone.zone_id} style={{ padding: 16, background: 'var(--bg-glass)', borderRadius: 12, border: '1px solid var(--border-glass)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <h4 style={{ margin: 0 }}>{zone.zone_name}</h4>
                    <span className="badge" style={{ background: gradeColors[zone.grade] + '20', color: gradeColors[zone.grade] }}>
                      Score: {zone.sustainability_score}
                    </span>
                  </div>
                  <ResponsiveContainer width="100%" height={180}>
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="rgba(0,0,0,0.08)" />
                      <PolarAngleAxis dataKey="factor" stroke="#64748b" fontSize={10} />
                      <Radar dataKey="score" stroke="#2b82f6" fill="#2b82f6" fillOpacity={0.15} strokeWidth={2} />
                      <Tooltip contentStyle={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 10, color: '#0f172a' }} />
                    </RadarChart>
                  </ResponsiveContainer>
                  {zone.improvement_areas?.length > 0 && (
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 8 }}>
                      {zone.improvement_areas.map((area, i) => (
                        <span key={i} className="badge warning" style={{ fontSize: 9 }}>{area.replace(/_/g, ' ')}</span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Carbon Credits Pie Chart Panel */}
        <div className="card chart-card">
          <h3>CO₂ Reduction Share</h3>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: -8, marginBottom: 12 }}>Proportional output across {currentCity?.name}</p>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={90}
                innerRadius={50}
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
      </div>

      {/* Unified Data Table Row */}
      <div className="card" style={{ marginTop: 24 }}>
        <h3 style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}><CircleDollarSign size={20} color="var(--accent-green)" /> Detailed Zone Analysis ({currentCity?.name})</h3>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Zone</th>
                <th>Sustain. Grade</th>
                <th>Current CO₂</th>
                <th>Target CO₂</th>
                <th>Reduction</th>
                <th>Credits Earned</th>
                <th>Value (INR)</th>
              </tr>
            </thead>
            <tbody>
              {cityCreditData.map(z => {
                // Find matching score data for this zone
                const zoneScore = cityScoreData.find(s => s.zone_id === z.zone_id);

                return (
                  <tr key={z.zone_id}>
                    <td style={{ fontWeight: 600 }}>{z.zone_name}</td>
                    <td>
                      <span className="badge" style={{ background: (zoneScore ? gradeColors[zoneScore.grade] : '#64748b') + '20', color: zoneScore ? gradeColors[zoneScore.grade] : '#64748b' }}>
                        {zoneScore ? zoneScore.grade : 'N/A'}
                      </span>
                    </td>
                    <td>{z.current_co2_ppm} ppm</td>
                    <td>{z.target_co2_ppm} ppm</td>
                    <td style={{ color: 'var(--accent-green)', fontWeight: 500 }}>{z.reduction_tonnes.toFixed(2)} t</td>
                    <td>{z.carbon_credits?.credits_earned?.toFixed(2)}</td>
                    <td style={{ fontWeight: 600, color: 'var(--accent-purple)' }}>{z.carbon_credits?.value_inr}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
