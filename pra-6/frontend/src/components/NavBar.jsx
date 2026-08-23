import { NavLink, Link } from 'react-router-dom';

function NavBar({ theme, toggleTheme }) {
  return (
    <header className="navbar-header">
      <Link to="/" className="brand-logo">
        Practical 6 • Full Stack
      </Link>
      <nav className="nav-links">
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          end
        >
          Home
        </NavLink>
        <NavLink
          to="/tasks"
          className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
        >
          Tasks (Full Stack)
        </NavLink>
        <NavLink
          to="/projects"
          className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
        >
          Projects
        </NavLink>
        <NavLink
          to="/contact"
          className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
        >
          Contact
        </NavLink>
        <button
          type="button"
          className="theme-toggle-btn"
          onClick={toggleTheme}
          title="Toggle Dark / Light Theme"
        >
          {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
        </button>
      </nav>
    </header>
  );
}

export default NavBar;
