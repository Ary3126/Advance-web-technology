import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import './App.css'
import NavBar from './components/NavBar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Projects from './pages/Projects'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'

function App() {
  // Theme state using useState (Supplementary requirement: Dark/Light Mode toggle)
  const [theme, setTheme] = useState('dark')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  return (
    <div className="portfolio-shell" data-theme={theme}>
      {/* Navigation Bar with Link / NavLink */}
      <NavBar theme={theme} toggleTheme={toggleTheme} />

      {/* React Router v6 Client-Side Routing */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/contact" element={<Contact />} />
        {/* Custom 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* Footer */}
      <Footer
        email="Ary@example.com"
        github="https://github.com/"
        copyright="© 2026 Student Portfolio"
      />
    </div>
  )
}

export default App
