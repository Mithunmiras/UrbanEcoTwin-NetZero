import { useState, useEffect } from 'react';
import { api } from '../api/client';
import { useStateContext } from '../context/StateContext';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts';
import { Star } from 'lucide-react';

export default function Scores() {
  const { selectedState, stateName } = useStateContext();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.getScores(selectedState).then(d => { setData(d); setLoading(false); }).catch(() => setLoading(false));
  }, [selectedState]);

  if (loading) return <div className="loading"><div className="loading-spinner"></div><p>Calculating scores...</p></div>;
  if (!data) return <div className="loading"><p>Failed to load data.</p></div>;

  const gradeColors = { 'A+': '#22c55e', 'A': '#22c55e', 'B+': '#84cc16', 'B': '#eab308', 'C': '#f97316', 'D': '#ef4444', 'F': '#dc2626' };

  return (
    <div className="fade-in">
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <h1><Star size={28} style={{ color: '#eab308' }} /> Sustainability Scores</h1>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 24, textAlign: 'center', padding: 32 }}>
        <div style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 8 }}>City Average Sustainability Score</div>
        <div style={{ fontSize: 64, fontWeight: 800, background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
          {data.city_average_score}<span style={{ fontSize: 24 }}>/100</span>
        </div>
        <div style={{ fontSize: 16, fontWeight: 600, color: gradeColors[data.city_grade] }}>Grade: {data.city_grade}</div>
      </div>

      <div className="card-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))' }}>
        {data.zone_scores?.map(zone => {
          const radarData = Object.entries(zone.breakdown).map(([key, val]) => ({
            factor: key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
            score: val,
          }));

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
