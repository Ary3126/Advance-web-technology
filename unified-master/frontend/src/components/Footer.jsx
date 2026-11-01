import React from 'react';

export default function Footer() {
  return (
    <footer className="footer">
      <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '0.4rem', alignItems: 'center' }}>
        <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
          ADVANCED WEB DEVELOPMENT FRAMEWORKS (ITUE301) · MASTER PLATFORM
        </p>
        <p>
          Designed & Developed by <strong style={{ color: 'var(--accent-primary)' }}>Ary Patel</strong>
        </p>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.35rem' }}>
          <a href="https://github.com/Ary3126/Advance-web-technology" target="_blank" rel="noreferrer">
            GitHub Repository
          </a>
          <span>·</span>
          <span>Practicals 1 to 11 & Richardson Maturity Model (Levels 0–3)</span>
          <span>·</span>
          <span>Docker Containerized</span>
        </div>
      </div>
    </footer>
  );
}

