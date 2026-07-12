import './App.css'
import About from './components/About'
import Footer from './components/Footer'
import Header from './components/Header'
import NavBar from './components/NavBar'
import Skills from './components/Skills'

function App() {
  const skills = ['HTML', 'CSS', 'JavaScript', 'React', 'Vite']

  return (
    <div className="portfolio-shell">
      <NavBar />
      <Header name="Aarav Patel" themeColor="#6c63ff" />
      <About
        bio="I am a second-year student passionate about web technologies, user experience, and building practical projects with modern tools."
        location="Mumbai, India"
        study="Frontend Development"
      />
      <Skills skillList={skills} />
      <Footer
        email="aarav@example.com"
        github="https://github.com/"
        copyright="© 2026 Student Portfolio"
      />
    </div>
  )
}

export default App
