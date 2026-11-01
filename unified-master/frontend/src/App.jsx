import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import Toast from './components/Toast';
import SuspenseFallback from './components/SuspenseFallback';
import './App.css';

// Practical 8: Performance Optimization & Lazy Loading via React.lazy() and dynamic imports
const Home = lazy(() => import('./pages/Home'));
const TaskManager = lazy(() => import('./pages/TaskManager'));
const MaturityExplorer = lazy(() => import('./pages/MaturityExplorer'));
const CacheAnalytics = lazy(() => import('./pages/CacheAnalytics'));
const EventStream = lazy(() => import('./pages/EventStream'));
const PracticalNavigator = lazy(() => import('./pages/PracticalNavigator'));
const AiAndCiHub = lazy(() => import('./pages/AiAndCiHub'));
const AuthPage = lazy(() => import('./pages/AuthPage'));
const Projects = lazy(() => import('./pages/Projects'));
const Contact = lazy(() => import('./pages/Contact'));
const NotFound = lazy(() => import('./pages/NotFound'));

export default function App() {
  // Theme state (Practical 2)
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('awt_theme') || 'dark';
  });

  // User state (Practical 7)
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('awt_user_profile');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Toast state (Practical 6)
  const [toast, setToast] = useState(null);

  const showToast = (type, message, title = '') => {
    setToast({ type, message, title, id: Date.now() });
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('awt_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <div className="app-container" data-theme={theme}>
      {/* Persistent Navigation Bar */}
      <NavBar theme={theme} toggleTheme={toggleTheme} user={user} setUser={setUser} />

      {/* Main Content Shell */}
      <main className="main-content">
        {/* Suspense boundary for lazy loaded routes (Practical 8) */}
        <Suspense fallback={<SuspenseFallback message="Optimizing component chunks with dynamic imports" />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tasks" element={<TaskManager showToast={showToast} user={user} />} />
            <Route path="/hateoas" element={<MaturityExplorer showToast={showToast} />} />
            <Route path="/cache-analytics" element={<CacheAnalytics showToast={showToast} />} />
            <Route path="/event-stream" element={<EventStream showToast={showToast} />} />
            <Route path="/practicals" element={<PracticalNavigator />} />
            <Route path="/ai-cicd" element={<AiAndCiHub showToast={showToast} />} />
            <Route path="/auth" element={<AuthPage user={user} setUser={setUser} showToast={showToast} />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/contact" element={<Contact showToast={showToast} />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>

      {/* Toast Alert System */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Persistent Course Footer */}
      <Footer />
    </div>
  );
}

