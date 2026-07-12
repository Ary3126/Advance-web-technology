function Header({ name, themeColor }) {
  return (
    <header
      className="hero-card"
      style={{ '--accent-color': themeColor }}
    >
      <p className="eyebrow">Student Portfolio</p>
      <h1>Hi, I&apos;m {name}</h1>
      <p className="hero-copy">
        I am a curious web developer building clean, modern interfaces with
        React and Vite.
      </p>
      <a href="#skills" className="cta-button">
        Explore My Skills
      </a>
    </header>
  )
}

export default Header
