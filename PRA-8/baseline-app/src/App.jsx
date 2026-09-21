import { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import './App.css';

// Baseline app uses static imports (non-lazy) to compare bundle sizes
import Home from '../src/pages/Home';
import Projects from '../src/pages/Projects';
import Contact from '../src/pages/Contact';

export default function App() {
  const [theme, setTheme] = useState('dark');
  const toggle = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));

  return (
    <div className="app-shell" data-theme={theme}>
      <header className="app-header">
        <h1>Baseline App — No Lazy Loading</h1>
        <nav>
          <Link to="/">Home</Link> | <Link to="/projects">Projects</Link> | <Link to="/contact">Contact</Link>
        </nav>
        <button onClick={toggle}>Toggle</button>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
    </div>
  );
}
