import React from 'react';
import { NavLink } from 'react-router-dom';

export default function NotFound() {
  return (
    <div style={{ textAlign: 'center', padding: '5rem 1rem' }}>
      <div style={{ fontSize: '4rem', fontWeight: 800, background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '1rem' }}>
        404
      </div>
      <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.75rem' }}>
        Route Not Found
      </h2>
      <p style={{ color: 'var(--text-secondary)', maxWidth: '480px', margin: '0 auto 2rem auto', fontSize: '0.95rem' }}>
        Practical 3 routing caught this unmatched path. The client-side router handled this wildcard cleanly without page reloading.
      </p>
      <NavLink to="/" className="btn btn-primary">
        Return to Home Portfolio
      </NavLink>
    </div>
  );
}

