import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { checkBackendHealth, logoutUser } from '../services/api';

export default function NavBar({ theme, toggleTheme, user, setUser }) {
  const [health, setHealth] = useState({ status: 'checking', database: 'checking' });
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    async function updateHealth() {
      const data = await checkBackendHealth();
      if (isMounted) setHealth(data);
    }
    updateHealth();
    const timer = setInterval(updateHealth, 15000);
    return () => {
      isMounted = false;
      clearInterval(timer);
    };
  }, []);

  const handleLogout = () => {
    logoutUser();
    setUser(null);
    navigate('/');
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <NavLink to="/" className="nav-brand">
          <span className="badge-dot"></span>
          <span>AWT Master Hub</span>
        </NavLink>

        <nav>
          <ul className="nav-links">
            <li><NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Portfolio</NavLink></li>
            <li><NavLink to="/tasks" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Tasks</NavLink></li>
            <li><NavLink to="/hateoas" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>HATEOAS</NavLink></li>
            <li><NavLink to="/cache-analytics" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Cache</NavLink></li>
            <li><NavLink to="/event-stream" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Events</NavLink></li>
            <li><NavLink to="/ai-cicd" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>AI & CI/CD</NavLink></li>
            <li><NavLink to="/practicals" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Pra 1–13 Tour</NavLink></li>
          </ul>
        </nav>

        <div className="nav-actions">
          {/* Health Indicator */}
          <div
            className={`status-pill ${
              health.status === 'online' ? '' : health.status === 'degraded' ? 'degraded' : 'offline'
            }`}
            title={`Backend: ${health.status} | MongoDB: ${health.database}`}
          >
            <span className="pulse-dot"></span>
            <span>{health.status === 'online' ? 'DB Connected' : health.status === 'degraded' ? 'DB Degraded' : 'Offline'}</span>
          </div>

          {/* Theme Toggle */}
          <button className="btn-theme" onClick={toggleTheme} title="Toggle Dark/Light Mode">
            {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
          </button>

          {/* User Auth Info */}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                👤 {user.name}
              </span>
              <button className="btn btn-secondary btn-sm" onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : (
            <NavLink to="/auth" className="btn btn-primary btn-sm">
              Sign In
            </NavLink>
          )}
        </div>
      </div>
    </header>
  );
}

