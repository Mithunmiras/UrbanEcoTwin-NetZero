import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { StateProvider, useStateContext } from './context/StateContext';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import StateSelector from './pages/StateSelector';
import Dashboard from './pages/Dashboard';
import DigitalTwin from './pages/DigitalTwin';
import Predictions from './pages/Predictions';
import Simulation from './pages/Simulation';
import Optimize from './pages/Optimize';
import NetZero from './pages/NetZero';
import Scores from './pages/Scores';
import Health from './pages/Health';
import Reports from './pages/Reports';
import Alerts from './pages/Alerts';
import './index.css';

function ProtectedRoutes() {
  const { isAuthenticated, loading } = useAuth();
  const { selectedState } = useStateContext();

  if (loading) {
    return (
      <div className="auth-loading">
        <div className="auth-loading-spinner"></div>
        <p>Initializing Eco Platform…</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  if (!selectedState) {
    return <StateSelector />;
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/digital-twin" element={<DigitalTwin />} />
          <Route path="/predictions" element={<Predictions />} />
          <Route path="/simulation" element={<Simulation />} />
          <Route path="/optimize" element={<Optimize />} />
          <Route path="/netzero" element={<NetZero />} />
          <Route path="/scores" element={<Scores />} />
          <Route path="/health" element={<Health />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <StateProvider>
        <BrowserRouter>
          <ProtectedRoutes />
        </BrowserRouter>
      </StateProvider>
    </AuthProvider>
  );
}

export default App;
