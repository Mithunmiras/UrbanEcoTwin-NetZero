import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import DigitalTwin from './pages/DigitalTwin';
import Predictions from './pages/Predictions';
import Simulation from './pages/Simulation';
import Optimize from './pages/Optimize';
import Agents from './pages/Agents';
import NetZero from './pages/NetZero';
import Scores from './pages/Scores';
import CarbonCredits from './pages/CarbonCredits';
import Health from './pages/Health';
import Reports from './pages/Reports';
import Alerts from './pages/Alerts';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app-layout">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/digital-twin" element={<DigitalTwin />} />
            <Route path="/predictions" element={<Predictions />} />
            <Route path="/simulation" element={<Simulation />} />
            <Route path="/optimize" element={<Optimize />} />
            <Route path="/agents" element={<Agents />} />
            <Route path="/netzero" element={<NetZero />} />
            <Route path="/scores" element={<Scores />} />
            <Route path="/carbon-credits" element={<CarbonCredits />} />
            <Route path="/health" element={<Health />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/alerts" element={<Alerts />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
