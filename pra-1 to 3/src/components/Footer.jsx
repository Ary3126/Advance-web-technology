function Footer({ email, github, copyright }) {
  return (
    <footer className="footer-card">
      <p>{copyright}</p>
      <div className="footer-links">
        <a href={`mailto:${email}`}>{email}</a>
        <a href={github} target="_blank" rel="noreferrer">
          GitHub
        </a>
      </div>
    </footer>
  )
}

export default Footer
