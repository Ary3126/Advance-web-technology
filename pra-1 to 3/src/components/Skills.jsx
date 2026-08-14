function Skills({ skillList }) {
  return (
    <section id="skills" className="section-card">
      <h2>Core Skills</h2>
      <ul className="skill-list">
        {skillList.map((skill) => (
          <li key={skill}>{skill}</li>
        ))}
      </ul>
    </section>
  )
}

export default Skills
