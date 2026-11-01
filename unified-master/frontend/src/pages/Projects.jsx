import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Projects() {
  const projects = [
    {
      title: 'Full-Stack Task Manager (ITUE301)',
      desc: 'Complete React 19 + Express 5 + MongoDB task orchestration platform with live health checks and optimistic UI updates.',
      tags: ['React 19', 'Express', 'MongoDB', 'Mongoose', 'CORS'],
      status: 'Live & Containerized',
      link: '/tasks'
    },
    {
      title: 'Richardson Maturity Model Evaluation Engine',
      desc: 'Demonstration and evaluation server implementing all 4 levels of REST maturity, featuring dynamic HATEOAS hypermedia links.',
      tags: ['HATEOAS', 'Level 0-3', 'Hypermedia', 'HTTP Semantics'],
      status: 'Tested (21/21 assertions)',
      link: '/hateoas'
    },
    {
      title: 'Process-Local In-Memory Cache Service',
      desc: 'Node-cache store isolating user sessions, measuring hit/miss ratios, and invalidating keys on write mutations.',
      tags: ['node-cache', 'RAM Storage', 'Query Optimization', 'X-Cache'],
      status: 'Sub-millisecond Latency',
      link: '/cache-analytics'
    },
    {
      title: 'Asynchronous Event-Driven Worker Pipeline',
      desc: 'Decoupled background notification system utilizing native Node.js EventEmitter for non-blocking I/O.',
      tags: ['EventEmitter', 'Decoupled Handlers', 'Async Worker', 'SSE'],
      status: 'Real-Time Stream',
      link: '/event-stream'
    },
    {
      title: 'Docker Compose Multi-Container Stack',
      desc: 'Container orchestration connecting React frontend, Express API, and MongoDB 7 across an isolated bridge network with named volumes.',
      tags: ['Docker', 'Docker Compose', 'Alpine Linux', 'Nginx'],
      status: 'Production Ready',
      link: '/practicals'
    }
  ];

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <div className="badge badge-low" style={{ marginBottom: '0.5rem' }}>
          Practicals 1, 3 & 8 · Showcase & Lazy Loading
        </div>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800 }}>Coursework Projects Gallery</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          This page is loaded on-demand via <code>React.lazy()</code> and <code>Suspense</code> (Practical 8 requirement).
        </p>
      </div>

      <div className="grid-3">
        {projects.map((proj, idx) => (
          <div key={idx} className="glass-panel" style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span className="badge badge-low" style={{ fontSize: '0.7rem' }}>
                {proj.status}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Project 0{idx + 1}
              </span>
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              {proj.title}
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', flex: 1, marginBottom: '1rem' }}>
              {proj.desc}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.25rem' }}>
              {proj.tags.map((tag, tIdx) => (
                <span key={tIdx} style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
                  {tag}
                </span>
              ))}
            </div>
            <NavLink to={proj.link} className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
              Launch In-App Demo →
            </NavLink>
          </div>
        ))}
      </div>
    </div>
  );
}

