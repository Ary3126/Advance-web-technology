import React from 'react';

export default function SuspenseFallback({ message = 'Loading module chunk...' }) {
  return (
    <div style={{ maxWidth: '800px', margin: '3rem auto', textAlign: 'center' }}>
      <div className="skeleton" style={{ height: '40px', width: '60%', margin: '0 auto 1.5rem auto' }}></div>
      <div className="skeleton" style={{ height: '180px', width: '100%', marginBottom: '1.5rem' }}></div>
      <div className="skeleton" style={{ height: '120px', width: '100%' }}></div>
      <p style={{ marginTop: '1.25rem', color: 'var(--text-muted)', fontSize: '0.9rem', fontStyle: 'italic' }}>
        ⚡ Practical 8: React.lazy() & Suspense code splitting in action — {message}
      </p>
    </div>
  );
}

