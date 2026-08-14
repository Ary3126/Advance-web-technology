function About({ bio, location, study }) {
  return (
    <section id="about" className="section-card">
      <h2>About Me</h2>
      <p>{bio}</p>
      <div className="info-grid">
        <div>
          <strong>Location</strong>
          <span>{location}</span>
        </div>
        <div>
          <strong>Focus</strong>
          <span>{study}</span>
        </div>
      </div>
    </section>
  )
}

export default About
