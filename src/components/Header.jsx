import { Link } from 'react-router-dom'

function Header({ name, themeColor }) {
  return (
    <header
      className="hero-card"
      style={{ '--accent-color': themeColor }}
    >
      <span className="eyebrow">Frontend Web Developer</span>
      <h1>Hi, I&apos;m {name} 👋</h1>
      <p className="hero-copy">
        I am a student passionate about web technologies, user experience, and
        building modern reactive applications with React Router and state management.
      </p>
      <Link to="/projects" className="cta-button">
        Explore My Projects &rarr;
      </Link>
    </header>
  )
}

export default Header
