import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useStateContext } from '../context/StateContext';
import {
  LayoutDashboard, Globe, BrainCircuit, FlaskConical, Cpu,
  Target, Star, Coins, Wallet, HeartPulse, FileText, Bell, LogOut, MapPin
} from 'lucide-react';

import logoImg from '../assets/logo.png';

const navItems = [
  { to: '/', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
  { to: '/digital-twin', icon: <Globe size={18} />, label: 'Digital Twin' },
  { to: '/predictions', icon: <BrainCircuit size={18} />, label: 'Advanced Predictions' },
  { to: '/simulation', icon: <FlaskConical size={18} />, label: 'Simulation' },
  { to: '/optimize', icon: <Cpu size={18} />, label: 'RL Optimizer' },
  { to: '/netzero', icon: <Target size={18} />, label: 'Net-Zero Plan' },
  { to: '/scores', icon: <Star size={18} />, label: 'Sustainability' },
  { to: '/carbon-credits', icon: <Coins size={18} />, label: 'Carbon Credits' },
  { to: '/health', icon: <HeartPulse size={18} />, label: 'Health Impact' },
  { to: '/reports', icon: <FileText size={18} />, label: 'Policy & Budget' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const { stateName, clearState } = useStateContext();

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon" style={{ background: 'transparent', padding: 0 }}>
          <img src={logoImg} alt="UrbanEcoTwin" style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: '50%' }} />
        </div>
        <div>
          <div className="logo-text">UrbanEcoTwin</div>
          <div className="logo-sub">Net-Zero Platform</div>
        </div>
      </div>

      {/* State indicator */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px',
        margin: '0 12px 8px', background: 'rgba(59,130,246,0.08)', borderRadius: 10,
        cursor: 'pointer', transition: 'background 0.2s',
      }} onClick={clearState} title="Change State">
        <MapPin size={16} style={{ color: '#3b82f6' }} />
        <span style={{ fontSize: 13, fontWeight: 600, color: '#1e293b', flex: 1 }}>{stateName}</span>
        <span style={{ fontSize: 11, color: '#3b82f6', fontWeight: 500 }}>Change</span>
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
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-user-avatar">🛡️</div>
          <div className="sidebar-user-info">
            <span className="sidebar-user-name">{user?.name || 'Admin'}</span>
            <span className="sidebar-user-role">{user?.role || 'admin'}</span>
          </div>
        </div>
        <button className="sidebar-logout-btn" onClick={logout} title="Sign Out">
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
