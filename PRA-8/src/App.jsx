import { lazy, Suspense, useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import './App.css';

import Home from './pages/Home';

const Projects = lazy(() => import('./pages/Projects'));
const Contact = lazy(() => import('./pages/Contact'));

function Loading() {
  return (
    <div className="page loading" role="status" aria-live="polite">
      Loading page...
    </div>
  );
}

function App() {
  const [theme, setTheme] = useState('dark');
  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));

  return (
    <div className="app-shell" data-theme={theme}>
      <header className="app-header">
        <h1>Practical 8 — Lazy Loading Demo</h1>
        <nav className="nav-inline">
          <Link to="/">Home</Link>
          <Link to="/projects">Projects</Link>
          <Link to="/contact">Contact</Link>
        </nav>
        <button onClick={toggleTheme} className="theme-btn">Toggle Theme</button>
      </header>

      <main>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </Suspense>
      </main>

      <footer className="app-footer">Practical 8 - Performance Optimization</footer>
    </div>
  );
}

export default App;
