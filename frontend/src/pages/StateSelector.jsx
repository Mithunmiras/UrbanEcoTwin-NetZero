import { useStateContext } from '../context/StateContext';
import { Landmark, Trees, Building2, Ship } from 'lucide-react';
import logoImg from '../assets/logo.png';

const STATE_CARDS = [
  {
    id: 'tamilnadu',
    name: 'Tamil Nadu',
    capital: 'Chennai',
    districts: 38,
    icon: <Landmark size={32} color="#f59e0b" />,
    color: '#f59e0b',
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    description: 'Land of Temples — 38 districts from Chennai to Thoothukudi',
  },
  {
    id: 'kerala',
    name: 'Kerala',
    capital: 'Thiruvananthapuram',
    districts: 14,
    icon: <Trees size={32} color="#22c55e" />,
    color: '#22c55e',
    gradient: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
    description: "God's Own Country — 14 districts from Kasaragod to Thiruvananthapuram",
  },
  {
    id: 'karnataka',
    name: 'Karnataka',
    capital: 'Bengaluru',
    districts: 31,
    icon: <Building2 size={32} color="#3b82f6" />,
    color: '#3b82f6',
    gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    description: 'Silicon Valley of India — 31 districts from Bengaluru to Bidar',
  },
  {
    id: 'andhrapradesh',
    name: 'Andhra Pradesh',
    capital: 'Amaravati',
    districts: 26,
    icon: <Ship size={32} color="#a855f7" />,
    color: '#a855f7',
    gradient: 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)',
    description: 'Rice Bowl of India — 26 districts from Visakhapatnam to Anantapur',
  },
];

export default function StateSelector() {
  const { selectState } = useStateContext();

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
      padding: '40px 20px',
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 48, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ marginBottom: 16, background: 'rgba(34,197,94,0.1)', padding: 12, borderRadius: '50%' }}>
          <img src={logoImg} alt="UrbanEcoTwin" style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: '50%' }} />
        </div>
        <h1 style={{
          fontSize: 36,
          fontWeight: 800,
          background: 'linear-gradient(135deg, #16a34a, #2563eb)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: 8,
        }}>
          UrbanEcoTwin — NetZero
        </h1>
        <p style={{ color: '#64748b', fontSize: 16 }}>
          Select a region to monitor environmental data across its districts
        </p>
      </div>

      {/* State Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: 24,
        maxWidth: 1100,
        width: '100%',
      }}>
        {STATE_CARDS.map((state) => (
          <button
            key={state.id}
            onClick={() => selectState(state.id)}
            style={{
              background: '#ffffff',
              border: '1px solid rgba(0,0,0,0.05)',
              borderRadius: 16,
              padding: '32px 24px',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 4px 6px rgba(0,0,0,0.02)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = `${state.color}40`;
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = `0 12px 40px ${state.color}15`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(0,0,0,0.05)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.02)';
            }}
          >
            {/* Top accent bar */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 4,
              background: state.gradient,
            }} />

            <div style={{ marginBottom: 16 }}>{state.icon}</div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>
              {state.name}
            </h2>
            <p style={{ color: '#64748b', fontSize: 13, marginBottom: 16 }}>
              {state.description}
            </p>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <div style={{
                background: `${state.color}10`,
                borderRadius: 8,
                padding: '6px 12px',
                fontSize: 12,
                color: state.color,
                fontWeight: 600,
              }}>
                {state.districts} Districts
              </div>
              <div style={{
                background: '#f1f5f9',
                borderRadius: 8,
                padding: '6px 12px',
                fontSize: 12,
                color: '#64748b',
                fontWeight: 500,
              }}>
                Capital: {state.capital}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Footer */}
      <p style={{ color: '#94a3b8', fontSize: 12, marginTop: 48 }}>
        Real-time data from Open-Meteo & OpenWeatherMap APIs
      </p>
    </div>
  );
}
