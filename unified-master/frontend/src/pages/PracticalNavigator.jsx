import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { getPracticals } from '../services/api';

export default function PracticalNavigator() {
  const [practicals, setPracticals] = useState([]);
  const [selectedId, setSelectedId] = useState(1);
  const [loading, setLoading] = useState(true);

  // Model Viva Examination Q&A for academic lab evaluations
  const vivaQuestions = {
    1: [
      { q: 'What is JSX and how does React process it?', a: 'JSX is a syntax extension for JavaScript that lets you write HTML-like elements inside JS. The Vite/Babel build pipeline transpiles JSX into React.createElement() method calls.' },
      { q: 'What is the role of props in React component architecture?', a: 'Props (properties) are read-only inputs passed from parent components to child components, enforcing unidirectional data flow.' }
    ],
    2: [
      { q: 'Explain the difference between state and props in React.', a: 'Props are external inputs passed to a component and cannot be modified by that component. State is internal data managed within the component using useState that can trigger UI re-renders upon mutation.' },
      { q: 'Why shouldn’t you mutate state directly in React?', a: 'Direct state mutations bypass React’s reconciliation algorithm and Virtual DOM diffing, causing missed re-renders and UI desynchronization.' }
    ],
    3: [
      { q: 'How does client-side routing differ from traditional server-side routing?', a: 'In SSR, every route change requests a full HTML document from the server. In CSR (React Router), the browser intercepts URL changes and dynamically swaps DOM components without full-page reloads.' },
      { q: 'What is the purpose of useEffect dependency array?', a: 'It tells React when to re-execute the effect. Empty array [] runs once on mount; omitting it runs on every render; specifying dependencies runs when those values change.' }
    ],
    4: [
      { q: 'What is middleware in Express.js?', a: 'Middleware functions have access to the request (req), response (res), and next() function in the app’s request-response cycle, enabling logging, authentication, and validation.' },
      { q: 'Why is centralized error handling recommended in Express?', a: 'Centralized error handling catches unhandled exceptions across all routes in one place, preventing crashes and returning consistent JSON error envelopes.' }
    ],
    5: [
      { q: 'What is Mongoose and why use it over native MongoDB driver?', a: 'Mongoose is an Object Data Modeling (ODM) library for MongoDB that provides strict schema validation, type casting, middleware hooks, and business logic methods.' },
      { q: 'How does Mongoose handle schema validation?', a: 'Mongoose validates document fields before executing database writes (e.g. required, minlength, enum, match) and returns structured ValidationError objects if rules fail.' }
    ],
    6: [
      { q: 'What is Optimistic UI and how is it implemented?', a: 'Optimistic UI updates the frontend state immediately before waiting for the server response. If the network request fails, the UI rolls back to the previous snapshot and displays an alert.' },
      { q: 'What is CORS and why must it be configured on the backend?', a: 'Cross-Origin Resource Sharing is a browser security mechanism that blocks requests across different origins (e.g. port 5173 to port 5000) unless explicitly allowed by backend CORS headers.' }
    ],
    w4: [
      { q: 'Explain the 4 levels of the Richardson Maturity Model.', a: 'Level 0: Single URI RPC over POST. Level 1: Distinct resource URIs. Level 2: Standard HTTP verbs and status codes. Level 3: Hypermedia controls (HATEOAS) with self-describing navigable links.' },
      { q: 'What is HATEOAS and what problem does it solve?', a: 'Hypermedia As The Engine Of Application State embeds hypermedia links (_links) in API responses, allowing clients to dynamically discover actions without hardcoding URIs.' }
    ],
    7: [
      { q: 'Explain how JWT authentication works.', a: 'Upon successful login with bcrypt password comparison, the server signs a JSON payload with a secret key. The client attaches this token in the Authorization Bearer header for subsequent requests.' },
      { q: 'Where should JWT tokens be stored and what are the security trade-offs?', a: 'Storing in httpOnly cookies mitigates XSS attacks; storing in localStorage is convenient for SPAs but requires strict XSS defense and short token expiration.' }
    ],
    8: [
      { q: 'How does React.lazy and Suspense optimize web application performance?', a: 'React.lazy dynamically imports component bundles only when their route or view is requested, reducing initial bundle size. Suspense displays a fallback skeleton during chunk downloads.' },
      { q: 'What is code splitting?', a: 'Splitting application code into smaller chunks that load on demand rather than loading the entire application codebase up front.' }
    ],
    9: [
      { q: 'What is the purpose of in-memory caching in REST APIs?', a: 'In-memory caching stores frequently requested database results in server RAM (node-cache), cutting database queries and reducing response times from tens of milliseconds to under 1 millisecond.' },
      { q: 'What is cache invalidation and why is it critical?', a: 'Cache invalidation removes or updates stale cache keys whenever write operations (POST, PUT, DELETE) occur, ensuring clients never receive obsolete data.' }
    ],
    10: [
      { q: 'What is the difference between synchronous and asynchronous event-driven processing?', a: 'Synchronous operations block the HTTP request thread until completely done. Event-driven processing with EventEmitter emits an event and returns 201 immediately, allowing listeners to execute heavy jobs in the background.' },
      { q: 'Why is Node.js well-suited for event-driven architectures?', a: 'Node.js is built around a single-threaded non-blocking event loop with first-class EventEmitter primitives, making background event dispatch lightweight and highly concurrent.' }
    ],
    11: [
      { q: 'What are the benefits of Docker Compose for a full-stack application?', a: 'Docker Compose defines and runs multi-container environments (Frontend, Backend, MongoDB) using a single declarative YAML file, ensuring identical execution across development and production.' },
      { q: 'What is the difference between a container and an image?', a: 'An image is a read-only blueprint containing the application runtime and code. A container is a running, stateful instance of that image.' }
    ],
    12: [
      { q: 'What is the difference between Continuous Integration (CI) and Continuous Deployment (CD)?', a: 'CI automatically merges, builds, and verifies code changes using automated test and lint suites upon every commit. CD automatically deploys passing builds into production without manual intervention.' },
      { q: 'Why is a fail-fast multi-job pipeline (needs: [lint]) beneficial?', a: 'Enforcing a linting quality gate before the test runner saves compute minutes and runner resources by terminating early if formatting or syntax errors are detected.' }
    ],
    13: [
      { q: 'Why must AI API keys be called from the backend instead of the React browser bundle?', a: 'Client-side JavaScript bundles are public. Any key stored in browser code can be inspected via DevTools and stolen. Routing via Express protects keys and enables rate limiting.' },
      { q: 'What is Graceful Degradation and why is it essential for AI integrations?', a: 'Graceful Degradation ensures that if an external cloud AI service experiences outages or rate limits, the application falls back to an intelligent heuristic draft instead of crashing the core task workflow.' },
      { q: 'What are the core Responsible AI principles implemented in this application?', a: 'Human-in-the-loop review (machine drafts are placed in an editable textarea for user approval), strict privacy safeguards (no passwords or PII sent to cloud models), and IP rate limiting.' }
    ]
  };

  useEffect(() => {
    async function load() {
      try {
        const data = await getPracticals();
        setPracticals(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const activePractical = practicals.find((p) => String(p.id) === String(selectedId)) || practicals[0];

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <div className="badge badge-low" style={{ marginBottom: '0.5rem' }}>
          Course Syllabus Navigator · ITUE301
        </div>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800 }}>Step-by-Step Practical Roadmap</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Interactive index of all 13 Practicals and the Week 4 Assignment with objectives, live demos, and viva answers.
        </p>
      </div>

      <div className="grid-2" style={{ gridTemplateColumns: '1fr 2fr', alignItems: 'flex-start' }}>
        {/* Left Side: Practical Selection List */}
        <div className="glass-panel" style={{ padding: '1rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem', paddingLeft: '0.5rem' }}>
            Practicals Index (1–13)
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            {practicals.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedId(p.id)}
                style={{
                  textAlign: 'left',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '8px',
                  background: String(selectedId) === String(p.id) ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                  border: String(selectedId) === String(p.id) ? '1px solid var(--accent-primary)' : '1px solid transparent',
                  color: String(selectedId) === String(p.id) ? 'var(--text-primary)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>
                    {typeof p.id === 'number' ? `Practical ${p.id}` : 'Week 4 Assignment'}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {p.category}
                  </div>
                </div>
                <span className="badge badge-low" style={{ fontSize: '0.65rem' }}>
                  {p.courseOutcome}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Right Side: Detailed Practical Explorer */}
        {activePractical && (
          <div className="glass-panel">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <span className="badge badge-medium" style={{ marginBottom: '0.35rem' }}>
                  {activePractical.category} · {activePractical.courseOutcome} ({activePractical.programOutcome})
                </span>
                <h2 style={{ fontSize: '1.45rem', fontWeight: 800 }}>
                  {activePractical.title}
                </h2>
              </div>
              <NavLink to={activePractical.routeLink} className="btn btn-primary btn-sm">
                ⚡ Open Live Feature
              </NavLink>
            </div>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1.25rem', lineHeight: 1.6 }}>
              {activePractical.summary}
            </p>

            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                🔑 Key Concepts Mastered:
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {activePractical.keyConcepts.map((c, i) => (
                  <span key={i} style={{ padding: '0.25rem 0.6rem', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '6px', fontSize: '0.8rem', border: '1px solid var(--border-color)' }}>
                    {c}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ padding: '1rem', background: 'rgba(59, 130, 246, 0.08)', borderRadius: '10px', border: '1px solid rgba(59, 130, 246, 0.2)', marginBottom: '1.5rem' }}>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--accent-primary)', marginBottom: '0.25rem' }}>
                🎯 How to Demonstrate in this Platform:
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                {activePractical.demoAction}
              </div>
            </div>

            {/* Viva Questions Section */}
            {vivaQuestions[activePractical.id] && (
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem', color: '#f59e0b' }}>
                  🎓 Model Viva Examination Questions & Answers:
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {vivaQuestions[activePractical.id].map((viva, idx) => (
                    <div key={idx} style={{ padding: '0.85rem', background: 'rgba(0,0,0,0.25)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.35rem', color: 'var(--text-primary)' }}>
                        Q: {viva.q}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                        <strong>Answer:</strong> {viva.a}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

