import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser, loginUser } from '../services/api';

export default function AuthPage({ user, setUser, showToast }) {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student'
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isRegister) {
        const res = await registerUser(formData);
        localStorage.setItem('awt_auth_token', res.token);
        localStorage.setItem('awt_user_profile', JSON.stringify(res.user));
        setUser(res.user);
        showToast('success', res.message || 'Account created successfully!');
        navigate('/tasks');
      } else {
        const res = await loginUser({ email: formData.email, password: formData.password });
        localStorage.setItem('awt_auth_token', res.token);
        localStorage.setItem('awt_user_profile', JSON.stringify(res.user));
        setUser(res.user);
        showToast('success', 'Logged in successfully!');
        navigate('/tasks');
      }
    } catch (err) {
      showToast('error', err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '520px', margin: '2rem auto' }}>
      <div className="glass-panel">
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div className="badge badge-medium" style={{ marginBottom: '0.5rem' }}>
            Practical 7 · JWT & Middleware Pipeline
          </div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 800 }}>
            {isRegister ? 'Create User Account' : 'Sign In to Platform'}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            Protected with bcrypt password hashing (10 salt rounds) and HMAC-SHA256 JWT tokens.
          </p>
        </div>

        {/* Tab switch */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <button
            className={`btn btn-sm ${!isRegister ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setIsRegister(false)}
          >
            Sign In
          </button>
          <button
            className={`btn btn-sm ${isRegister ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setIsRegister(true)}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {isRegister && (
            <div className="form-group">
              <label>Full Name *</label>
              <input
                className="form-control"
                placeholder="Ary Patel"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label>Email Address *</label>
            <input
              type="email"
              className="form-control"
              placeholder="ary@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Password (min 6 chars) *</label>
            <input
              type="password"
              className="form-control"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              minLength={6}
            />
          </div>

          {isRegister && (
            <div className="form-group">
              <label>Role</label>
              <select
                className="form-control"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <option value="student">Student</option>
                <option value="evaluator">Evaluator / Examiner</option>
                <option value="admin">Administrator</option>
              </select>
            </div>
          )}

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.75rem' }} disabled={loading}>
            {loading ? 'Authenticating...' : isRegister ? 'Register & Generate JWT' : 'Sign In'}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
          🔒 <strong>Security Implementation:</strong> Passwords are never saved in plain text. Pre-save Mongoose hook generates a 10-round bcrypt salt and hashes the password before persistence. All subsequent private routes require <code>Authorization: Bearer &lt;token&gt;</code>.
        </div>
      </div>
    </div>
  );
}

