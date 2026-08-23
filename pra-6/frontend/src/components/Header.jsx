import { Link } from 'react-router-dom';

function Header({ name, themeColor }) {
  return (
    <header
      className="hero-card"
      style={{ '--accent-color': themeColor }}
    >
      <span className="eyebrow">Full Stack Web Application</span>
      <h1>Hi, I&apos;m {name} 👋</h1>
      <p className="hero-copy">
        Welcome to the Full-Stack React + Node.js + MongoDB integration practical.
        Explore the live task board connected to Express API and MongoDB database.
      </p>
      <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap' }}>
        <Link to="/tasks" className="cta-button">
          Open Task Board &rarr;
        </Link>
        <Link
          to="/projects"
          className="cta-button"
          style={{ background: 'var(--card-inner-bg)', color: 'var(--text-primary)', border: '1px solid var(--card-border)' }}
        >
          View Projects
        </Link>
      </div>
    </header>
  );
}

export default Header;
