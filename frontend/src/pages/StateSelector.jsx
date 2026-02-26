import { useStateContext } from '../context/StateContext';

const STATE_CARDS = [
  {
    id: 'tamilnadu',
    name: 'Tamil Nadu',
    capital: 'Chennai',
    districts: 38,
    icon: '🏛️',
    color: '#f59e0b',
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    description: 'Land of Temples — 38 districts from Chennai to Thoothukudi',
  },
  {
    id: 'kerala',
    name: 'Kerala',
    capital: 'Thiruvananthapuram',
    districts: 14,
    icon: '🌴',
    color: '#22c55e',
    gradient: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
    description: "God's Own Country — 14 districts from Kasaragod to Thiruvananthapuram",
  },
  {
    id: 'karnataka',
    name: 'Karnataka',
    capital: 'Bengaluru',
    districts: 31,
    icon: '🏙️',
    color: '#3b82f6',
    gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    description: 'Silicon Valley of India — 31 districts from Bengaluru to Bidar',
  },
  {
    id: 'andhrapradesh',
    name: 'Andhra Pradesh',
    capital: 'Amaravati',
    districts: 26,
    icon: '⛵',
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
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
      padding: '40px 20px',
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🌍</div>
        <h1 style={{
          fontSize: 36,
          fontWeight: 800,
          background: 'linear-gradient(135deg, #22c55e, #3b82f6)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: 8,
        }}>
          UrbanEcoTwin — NetZero
        </h1>
        <p style={{ color: '#94a3b8', fontSize: 16 }}>
          Select a state to monitor environmental data across its districts
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
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 16,
              padding: '32px 24px',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = state.color;
              e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = `0 12px 40px ${state.color}25`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
              e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {/* Top accent bar */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 3,
              background: state.gradient,
            }} />

            <div style={{ fontSize: 40, marginBottom: 12 }}>{state.icon}</div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: '#f1f5f9', marginBottom: 4 }}>
              {state.name}
            </h2>
            <p style={{ color: '#94a3b8', fontSize: 13, marginBottom: 16 }}>
              {state.description}
            </p>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <div style={{
                background: `${state.color}15`,
                borderRadius: 8,
                padding: '6px 12px',
                fontSize: 12,
                color: state.color,
                fontWeight: 600,
              }}>
                {state.districts} Districts
              </div>
              <div style={{
                background: 'rgba(255,255,255,0.05)',
                borderRadius: 8,
                padding: '6px 12px',
                fontSize: 12,
                color: '#94a3b8',
              }}>
                Capital: {state.capital}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Footer */}
      <p style={{ color: '#475569', fontSize: 12, marginTop: 48 }}>
        Real-time data from Open-Meteo & OpenWeatherMap APIs
      </p>
    </div>
  );
}
