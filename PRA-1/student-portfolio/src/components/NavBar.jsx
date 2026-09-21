import { Link, NavLink } from 'react-router-dom'
import './Navbar.css'

/**
 * Navbar Component
 * Displays navigation links using React Router's NavLink for active route highlighting
 * Includes dark mode toggle functionality
 */
function Navbar({ isDarkMode, onToggleDarkMode }) {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Portfolio Logo/Title */}  
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">💼</span>
          Portfolio
        </Link>

        {/* Navigation Links */}
        <ul className="nav-menu">
          <li className="nav-item">
            <NavLink 
              to="/" 
              className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
            >
              Home
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink 
              to="/projects" 
              className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
            >
              Projects
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink 
              to="/contact" 
              className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
            >
              Contact
            </NavLink>
          </li>
        </ul>

        {/* Dark Mode Toggle */}
        <button 
          className="dark-mode-toggle"
          onClick={onToggleDarkMode}
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDarkMode ? '☀️' : '🌙'}
        </button>
      </div>
    </nav>
  )
}

export default Navbar
