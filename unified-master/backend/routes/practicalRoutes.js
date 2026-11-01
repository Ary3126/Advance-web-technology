const express = require('express');
const router = express.Router();

const practicalsData = [
  {
    id: 1,
    title: 'Practical 1: React Component Architecture & JSX',
    courseOutcome: 'CO1',
    programOutcome: 'PO3, PO5',
    category: 'Frontend Architecture',
    summary: 'Deconstruct a portfolio website into reusable React components (Header, About, Skills, Projects, Footer) using JSX syntax and modern Vite tooling.',
    keyConcepts: ['JSX Expressions & Rules', 'Functional Components', 'Props Passing & Destructuring', 'Component Hierarchy', 'Vite Bundler'],
    routeLink: '/',
    demoAction: 'Visit Student Portfolio home tab to explore modular component composition.'
  },
  {
    id: 2,
    title: 'Practical 2: React State & Interactive UI Handling',
    courseOutcome: 'CO1',
    programOutcome: 'PO3, PO5',
    category: 'Interactive UI & State',
    summary: 'Implement dynamic state management using useState hook, controlled form inputs, theme switching (Dark/Light mode), and modal dialogs.',
    keyConcepts: ['useState Hook', 'Controlled Form Components', 'Dynamic CSS Variables', 'Modal & Alert Handling', 'Derived State'],
    routeLink: '/contact',
    demoAction: 'Toggle Dark/Light theme in the top header or submit the interactive Contact form.'
  },
  {
    id: 3,
    title: 'Practical 3: Client-Side Routing & REST API Consumption',
    courseOutcome: 'CO1, CO2',
    programOutcome: 'PO3, PO5',
    category: 'Routing & API',
    summary: 'Configure multi-page client-side routing via React Router v6/v7 with active link highlighting, 404 fallback routing, and asynchronous API data fetching.',
    keyConcepts: ['React Router NavLink & Routes', 'BrowserRouter', '404 Wildcard Handling', 'useEffect Data Fetching', 'API Client Integration'],
    routeLink: '/projects',
    demoAction: 'Navigate between Portfolio, Tasks, Analytics, and HATEOAS pages with instant SPA transitions.'
  },
  {
    id: 4,
    title: 'Practical 4: Node.js & Express REST API Architecture',
    courseOutcome: 'CO2',
    programOutcome: 'PO3, PO5',
    category: 'Backend Architecture',
    summary: 'Develop a modular Express 5 REST API featuring structured route controllers, middleware pipelines, content negotiation, and centralized error handling.',
    keyConcepts: ['Express 5 App Architecture', 'Router Pipelines', 'JSON Body Parsing', 'Custom Middleware', 'HTTP Status Standards'],
    routeLink: '/tasks',
    demoAction: 'Inspect REST API responses via centralized error-handling middleware on invalid routes.'
  },
  {
    id: 5,
    title: 'Practical 5: MongoDB Integration with Mongoose',
    courseOutcome: 'CO2',
    programOutcome: 'PO3, PO5',
    category: 'Data Persistence',
    summary: 'Design Mongoose data schemas with strict validation, default values, timestamps, and indexes, performing full CRUD operations against MongoDB.',
    keyConcepts: ['Mongoose Schemas & Models', 'Schema Validation Rules', 'Database Indexing', 'Asynchronous Mongoose CRUD', 'Connection Lifecycle'],
    routeLink: '/tasks',
    demoAction: 'Create, edit, toggle, and delete persistent task documents in MongoDB.'
  },
  {
    id: 6,
    title: 'Practical 6: Full Stack Integration (React + Node + MongoDB)',
    courseOutcome: 'CO1, CO2',
    programOutcome: 'PO3, PO5',
    category: 'Full-Stack Integration',
    summary: 'End-to-end integration of the React SPA with Express/MongoDB backend, featuring live database health probes, optimistic UI updates, delete confirmations, and toast alerts.',
    keyConcepts: ['CORS Configuration', 'Optimistic UI & Rollback', 'Centralized API Service', 'Health Status Probes', 'Confirmation Modals'],
    routeLink: '/tasks',
    demoAction: 'Observe the live MongoDB status indicator in the header and create/edit tasks with optimistic UI.'
  },
  {
    id: 'w4',
    title: 'Week 4 Assignment: Richardson Maturity Model (Levels 0–3)',
    courseOutcome: 'CO2',
    programOutcome: 'PO3, PO5',
    category: 'REST Architecture Standards',
    summary: 'Comprehensive implementation and side-by-side evaluation of Leonard Richardson’s 4 REST maturity levels: Level 0 (RPC Swamp of POX), Level 1 (Resource URIs), Level 2 (HTTP Verbs), and Level 3 (HATEOAS Hypermedia Controls).',
    keyConcepts: ['Level 0: RPC POST Tunneling', 'Level 1: Resource Endpoints', 'Level 2: Standard Verbs & Status Codes', 'Level 3: HATEOAS _links & Navigation'],
    routeLink: '/hateoas',
    demoAction: 'Open the Richardson Maturity Playground to compare Level 0, 1, 2, and 3 live request/response payloads.'
  },
  {
    id: 7,
    title: 'Practical 7: Authentication & Middleware Pipeline',
    courseOutcome: 'CO2, CO3',
    programOutcome: 'PO3, PO5',
    category: 'Security & Auth',
    summary: 'Implement secure user authentication using bcrypt password hashing, JSON Web Tokens (JWT), Authorization Bearer headers, and user-scoped task authorization.',
    keyConcepts: ['bcrypt Hashing with Salt', 'JWT Token Generation & Expiry', 'Auth Middleware', 'User-Scoped Data Ownership', 'Protected Route Guards'],
    routeLink: '/auth',
    demoAction: 'Register a new user account, log in, receive a signed JWT token, and manage private tasks.'
  },
  {
    id: 8,
    title: 'Practical 8: Performance Optimization & Lazy Loading in React',
    courseOutcome: 'CO1',
    programOutcome: 'PO3, PO5',
    category: 'Frontend Performance',
    summary: 'Optimize bundle size and initial page load speed using React.lazy(), React.Suspense fallback skeletons, dynamic imports, and Vite code-splitting chunks.',
    keyConcepts: ['React.lazy()', 'Suspense Fallbacks', 'Code Splitting', 'Manual Chunking in Vite', 'Network Bundle Reduction'],
    routeLink: '/projects',
    demoAction: 'Check DevTools network tab to verify separate JavaScript asset chunks loaded on demand.'
  },
  {
    id: 9,
    title: 'Practical 9: In-Memory Caching & Query Optimization',
    courseOutcome: 'CO2',
    programOutcome: 'PO3, PO5',
    category: 'Performance & Caching',
    summary: 'Accelerate API response times using process-local node-cache, per-user cache isolation, automatic cache invalidation on mutations, X-Cache HIT/MISS headers, and real-time statistics.',
    keyConcepts: ['node-cache Store', 'TTL Expiration Strategy', 'Cache Invalidation on Mutation', 'X-Cache HIT/MISS Headers', 'Hit-Ratio Analytics'],
    routeLink: '/cache-analytics',
    demoAction: 'Open Cache Analytics tab to watch live cache hits, misses, hit ratio %, and flush cache live.'
  },
  {
    id: 10,
    title: 'Practical 10: Asynchronous Processing with Event-Driven Architecture',
    courseOutcome: 'CO2',
    programOutcome: 'PO3, PO5',
    category: 'Event-Driven Systems',
    summary: 'Decouple heavy tasks from HTTP request lifecycles using Node.js native EventEmitter. Immediately returns 201 Created while background workers handle notifications and audit logs.',
    keyConcepts: ['Node.js EventEmitter', 'Decoupled Handlers', 'Non-blocking I/O', 'Audit Logging Stream', 'Background Job Simulation'],
    routeLink: '/event-stream',
    demoAction: 'Add a task or click Simulate Event to see the 2-second background notification job execute in real time.'
  },
  {
    id: 11,
    title: 'Practical 11: Containerization with Docker Compose',
    courseOutcome: 'CO3',
    programOutcome: 'PO5',
    category: 'DevOps & Deployment',
    summary: 'Containerize the entire full-stack application into isolated Docker containers (Frontend, Backend, MongoDB) using multi-stage Dockerfiles and Docker Compose orchestration with persistent volumes and health checks.',
    keyConcepts: ['Multi-Stage Dockerfile', 'Docker Compose Orchestration', 'Named Persistent Volumes', 'Bridge Networks', 'Container Healthchecks'],
    routeLink: '/practicals',
    demoAction: 'Run `docker compose up --build` to deploy the unified system in isolated containers.'
  },
  {
    id: 12,
    title: 'Practical 12: CI/CD Pipeline with GitHub Actions',
    courseOutcome: 'CO5',
    programOutcome: 'PO3, PO5',
    category: 'Continuous Integration',
    summary: 'Automate code quality checks, ESLint linting, and comprehensive Jest/Supertest regression testing on every push and pull request via multi-job GitHub Actions workflows.',
    keyConcepts: ['GitHub Actions Workflows', 'Quality Gate Job Dependencies (needs: lint)', 'Automated Jest & Supertest Regressions', 'CI Status Badges', 'Exit Codes & Fail-Fast Pipelines'],
    routeLink: '/ai-cicd',
    demoAction: 'Inspect the live CI/CD pipeline visualizer, view job dependencies, and run automated regression tests.'
  },
  {
    id: 13,
    title: 'Practical 13: AI API Integration with Graceful Degradation',
    courseOutcome: 'CO6',
    programOutcome: 'PO3, PO5, PO12',
    category: 'Applied AI & Governance',
    summary: 'Securely integrate cloud AI services (Google Gemini & OpenAI) via backend-only API calls, enforce 5 req/min IP rate limiting, provide human-in-the-loop review, and guarantee 100% uptime through a rule-based Graceful Degradation fallback engine.',
    keyConcepts: ['Backend API Key Protection', 'Graceful Degradation Fallback Engine', 'IP Rate Limiting Middleware (5 req/min)', 'Responsible AI & Human-in-the-Loop', 'Simulated Outage Testing'],
    routeLink: '/tasks',
    demoAction: 'Click "✨ AI Assist" in the Task form to auto-draft descriptions, or test "Simulate AI Outage" to witness resilient fallback.'
  }
];

// GET /api/practicals
router.get('/', (req, res) => {
  res.status(200).json(practicalsData);
});

// GET /api/practicals/:id
router.get('/:id', (req, res) => {
  const item = practicalsData.find(p => String(p.id) === String(req.params.id));
  if (!item) {
    return res.status(404).json({ message: 'Practical not found' });
  }
  res.status(200).json(item);
});

module.exports = router;

