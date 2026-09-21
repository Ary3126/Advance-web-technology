import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <div className="not-found-page main-content">
      <div className="error-card">
        <div className="error-code">404</div>
        <h2>Page Not Found</h2>
        <p>
          Oops! The page path you are looking for does not exist or has been moved.
        </p>
        <Link to="/" className="cta-button">
          Return to Home Page &rarr;
        </Link>
      </div>
    </div>
  )
}

export default NotFound
