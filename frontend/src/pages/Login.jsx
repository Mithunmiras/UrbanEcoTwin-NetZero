import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import logoImg from '../assets/logo.png';

export default function Login() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(username, password);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Animated background particles */}
      <div className="login-particles">
        <div className="particle particle-1">🌿</div>
        <div className="particle particle-2">🍃</div>
        <div className="particle particle-3">💨</div>
        <div className="particle particle-4">🌱</div>
        <div className="particle particle-5">♻️</div>
        <div className="particle particle-6">🌍</div>
        <div className="particle particle-7">⚡</div>
        <div className="particle particle-8">☀️</div>
      </div>

      <div className="login-container">

        {/* Left — branding panel */}
        <div className="login-branding">
          <div className="branding-content">
            <div className="branding-icon">
              <img src={logoImg} alt="UrbanEcoTwin" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
            </div>
            <h1>UrbanEcoTwin</h1>
            <p className="branding-tagline">Net-Zero Sustainability Platform</p>
            <div className="branding-divider"></div>
          </div>
        </div>

        {/* Right — login form */}
        <div className="login-form-panel">
          <form className="login-form" onSubmit={handleSubmit}>
            {error && (
              <div className="login-error">
                <span>⚠️</span> {error}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="username">
                <span className="label-icon">👤</span> Username
              </label>
              <input
                id="username"
                type="text"
                placeholder="Enter admin username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoFocus
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">
                <span className="label-icon">🔑</span> Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="login-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span> Authenticating…
                </>
              ) : (
                <>🌿 Sign In to Dashboard</>
              )}
            </button>


          </form>
        </div>
      </div>
    </div>
  );
}
