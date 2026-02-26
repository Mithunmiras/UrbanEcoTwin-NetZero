import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Globe, BrainCircuit, FlaskConical, Cpu,
  Network, Target, Star, Coins, HeartPulse, FileText, Bell
} from 'lucide-react';

const navItems = [
  { to: '/', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
  { to: '/digital-twin', icon: <Globe size={18} />, label: 'Digital Twin' },
  { to: '/predictions', icon: <BrainCircuit size={18} />, label: 'AI Predictions' },
  { to: '/simulation', icon: <FlaskConical size={18} />, label: 'Simulation' },
  { section: 'Intelligence' },
  { to: '/optimize', icon: <Cpu size={18} />, label: 'RL Optimizer' },
  { to: '/agents', icon: <Network size={18} />, label: 'Multi-Agent AI' },
  { to: '/netzero', icon: <Target size={18} />, label: 'Net-Zero Plan' },
  { section: 'Analytics' },
  { to: '/scores', icon: <Star size={18} />, label: 'Sustainability' },
  { to: '/carbon-credits', icon: <Coins size={18} />, label: 'Carbon Credits' },
  { to: '/health', icon: <HeartPulse size={18} />, label: 'Health Impact' },
  { to: '/reports', icon: <FileText size={18} />, label: 'Policy Report' },
  { to: '/alerts', icon: <Bell size={18} />, label: 'Alerts' },
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
