import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Home() {
  const practicalCards = [
    {
      num: 'Pra 1–3',
      title: 'React Component & Routing Architecture',
      desc: 'Modular JSX components, dynamic useState forms, theme toggles, and React Router v7 navigation.',
      badge: 'Frontend',
      link: '/projects'
    },
    {
      num: 'Pra 4–6',
      title: 'Full-Stack Integration (Express + MongoDB)',
      desc: 'Mongoose schemas, REST CRUD operations, live health indicators, and optimistic UI updates.',
      badge: 'Full Stack',
      link: '/tasks'
    },
    {
      num: 'Week 4',
      title: 'Richardson Maturity Model (Levels 0–3)',
      desc: 'Interactive evaluation of RPC tunneling, resource URIs, standard HTTP verbs, and HATEOAS hypermedia links.',
      badge: 'Architecture',
      link: '/hateoas'
    },
    {
      num: 'Pra 7',
      title: 'JWT Authentication & Middleware Pipeline',
      desc: 'Bcrypt password hashing, JWT bearer token authorization, and user-isolated private task management.',
      badge: 'Security',
      link: '/auth'
    },
    {
      num: 'Pra 8',
      title: 'Performance & React Lazy Loading',
      desc: 'React.lazy(), Suspense skeleton fallbacks, and manual chunking for optimal bundle efficiency.',
      badge: 'Performance',
      link: '/projects'
    },
    {
      num: 'Pra 9',
      title: 'In-Memory Caching & Query Optimization',
      desc: 'Process-local node-cache, per-user cache keys, X-Cache HIT/MISS inspection, and hit-ratio metrics.',
      badge: 'Caching',
      link: '/cache-analytics'
    },
    {
      num: 'Pra 10',
      title: 'Asynchronous Event-Driven Architecture',
      desc: 'Node.js native EventEmitter for decoupled background notifications and non-blocking I/O.',
      badge: 'Event-Driven',
      link: '/event-stream'
    },
    {
      num: 'Pra 11',
      title: 'Containerization with Docker Compose',
      desc: 'Multi-stage Dockerfiles, Docker Compose service orchestration, network bridging, and persistent volumes.',
      badge: 'DevOps',
      link: '/practicals'
    },
    {
      num: 'Pra 12',
      title: 'CI/CD Pipeline with GitHub Actions',
      desc: 'Automated ESLint linting quality gates and Jest/Supertest regression testing on push and PR triggers.',
      badge: 'CI/CD',
      link: '/ai-cicd'
    },
    {
      num: 'Pra 13',
      title: 'AI API Integration & Graceful Degradation',
      desc: 'Cloud AI description drafts, 5 req/min rate limiting, and intelligent rule-based fallback resilience.',
      badge: 'Applied AI',
      link: '/tasks'
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-pill">
          <span>🎓 ITUE301 · Advanced Web Development Frameworks</span>
        </div>
        <h1 className="hero-title">
          Unified Full-Stack Master Platform
        </h1>
        <p className="hero-subtitle">
          An end-to-end laboratory and assignment platform developed by <strong>Ary Patel</strong>.
          Seamlessly combining React 19, Express 5, MongoDB, JWT Authentication, In-Memory Caching, Event-Driven Architecture, HATEOAS, and Docker Containerization.
        </p>
        <div className="hero-buttons">
          <NavLink to="/tasks" className="btn btn-primary">
            🚀 Launch Full-Stack Tasks
          </NavLink>
          <NavLink to="/hateoas" className="btn btn-secondary">
            📚 HATEOAS Explorer
          </NavLink>
          <NavLink to="/practicals" className="btn btn-secondary">
            📋 Step-by-Step Practical Tour
          </NavLink>
        </div>
      </section>

      {/* Quick Practical Grid */}
      <section style={{ marginBottom: '3.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Integrated Course Practicals</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Every curriculum milestone is running live inside this single, containerized application.
            </p>
          </div>
          <NavLink to="/practicals" style={{ fontWeight: 600, fontSize: '0.9rem' }}>
            View Detailed Roadmap →
          </NavLink>
        </div>

        <div className="grid-4">
          {practicalCards.map((card, idx) => (
            <NavLink to={card.link} key={idx} className="glass-panel" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent-primary)', textTransform: 'uppercase' }}>
                  {card.num}
                </span>
                <span className="badge badge-low">{card.badge}</span>
              </div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-primary)' }}>
                {card.title}
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', flex: 1 }}>
                {card.desc}
              </p>
              <div style={{ marginTop: '1rem', fontSize: '0.8rem', fontWeight: 600, color: 'var(--accent-primary)' }}>
                Explore Module →
              </div>
            </NavLink>
          ))}
        </div>
      </section>

      {/* Developer Profile Section (Practical 1 & 2 Portfolio) */}
      <section className="glass-panel" style={{ marginBottom: '3.5rem' }}>
        <div className="grid-2" style={{ alignItems: 'center' }}>
          <div>
            <div className="badge badge-medium" style={{ marginBottom: '0.75rem' }}>
              Student Developer Portfolio
            </div>
            <h2 style={{ fontSize: '1.85rem', fontWeight: 800, marginBottom: '0.75rem' }}>
              About Ary Patel
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', fontSize: '0.95rem' }}>
              Computer Science & Engineering student specializing in full-stack web architectures, distributed systems, and modern cloud deployment frameworks.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
              {['React 19', 'Vite 8', 'Express 5', 'Node.js', 'MongoDB', 'Mongoose', 'JWT Auth', 'node-cache', 'Docker Compose', 'REST & HATEOAS'].map((skill, i) => (
                <span key={i} style={{ padding: '0.25rem 0.65rem', borderRadius: '6px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-color)', fontSize: '0.8rem', fontWeight: 600 }}>
                  {skill}
                </span>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <a href="https://github.com/Ary3126" target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm">
                GitHub: @Ary3126
              </a>
              <NavLink to="/contact" className="btn btn-primary btn-sm">
                Get In Touch
              </NavLink>
            </div>
          </div>

          <div style={{ padding: '1.5rem', background: 'rgba(0, 0, 0, 0.2)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem' }}>
              🏗️ Platform Architecture Highlights
            </h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <li>✅ <strong>Frontend SPA:</strong> React 19 + React Router v7 with route-based lazy loading chunks.</li>
              <li>✅ <strong>REST API:</strong> Express 5 with centralized error handling & content negotiation.</li>
              <li>✅ <strong>Data Store:</strong> MongoDB with Mongoose ODM schemas, indexes, and automated fallback.</li>
              <li>✅ <strong>In-Memory Caching:</strong> 60s TTL node-cache with X-Cache headers & instant invalidation.</li>
              <li>✅ <strong>Event-Driven Worker:</strong> Decoupled EventEmitter notification simulators.</li>
              <li>✅ <strong>Maturity Model:</strong> Live side-by-side verification of Levels 0, 1, 2, and 3 HATEOAS.</li>
              <li>✅ <strong>Containerization:</strong> Docker Compose multi-container stack with persistent volumes.</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

