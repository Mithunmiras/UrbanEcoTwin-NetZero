import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/', icon: '📊', label: 'Dashboard' },
  { to: '/digital-twin', icon: '🌍', label: 'Digital Twin' },
  { to: '/predictions', icon: '🤖', label: 'AI Predictions' },
  { to: '/simulation', icon: '🔬', label: 'Simulation' },
  { section: 'Intelligence' },
  { to: '/optimize', icon: '🧠', label: 'RL Optimizer' },
  { to: '/agents', icon: '🤝', label: 'Multi-Agent AI' },
  { to: '/netzero', icon: '🎯', label: 'Net-Zero Plan' },
  { section: 'Analytics' },
  { to: '/scores', icon: '⭐', label: 'Sustainability' },
  { to: '/carbon-credits', icon: '💰', label: 'Carbon Credits' },
  { to: '/health', icon: '❤️', label: 'Health Impact' },
  { to: '/reports', icon: '📋', label: 'Policy Report' },
  { to: '/alerts', icon: '🚨', label: 'Alerts' },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">🌱</div>
        <div>
          <div className="logo-text">UrbanEcoTwin</div>
          <div className="logo-sub">Net-Zero Platform</div>
        </div>
      </div>
      <nav className="sidebar-nav">
        {navItems.map((item, i) =>
          item.section ? (
            <div key={i} className="nav-section-title">{item.section}</div>
          ) : (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </NavLink>
          )
        )}
      </nav>
    </aside>
  );
}
