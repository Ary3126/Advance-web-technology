import { useState, useEffect } from 'react'

// Mock projects array from Practical 2 to serve as local fallback data
const mockRepos = [
  {
    id: 101,
    name: 'portfolio-spa-react',
    language: 'React',
    description: 'Multi-page interactive portfolio built using React 19, React Router v6, and modern CSS custom properties.',
    html_url: 'https://github.com/devpatel905436/portfolio-spa-react',
    stargazers_count: 12,
    forks_count: 2,
    open_issues_count: 0,
    updated_at: new Date().toISOString()
  },
  {
    id: 102,
    name: 'weather-dashboard-js',
    language: 'JavaScript',
    description: 'Real-time weather application fetching data from OpenWeather REST API with location lookup.',
    html_url: 'https://github.com/devpatel905436/weather-dashboard-js',
    stargazers_count: 8,
    forks_count: 1,
    open_issues_count: 0,
    updated_at: new Date().toISOString()
  },
  {
    id: 103,
    name: 'kanban-task-tracker',
    language: 'React',
    description: 'Productivity application with drag-and-drop task management and priority filtering.',
    html_url: 'https://github.com/devpatel905436/kanban-task-tracker',
    stargazers_count: 15,
    forks_count: 4,
    open_issues_count: 1,
    updated_at: new Date().toISOString()
  },
  {
    id: 104,
    name: 'glassmorphism-ui-lib',
    language: 'CSS',
    description: 'A modern design system showcasing dark theme glassmorphism cards, glowing badges, and smooth animations.',
    html_url: 'https://github.com/devpatel905436/glassmorphism-ui-lib',
    stargazers_count: 24,
    forks_count: 3,
    open_issues_count: 0,
    updated_at: new Date().toISOString()
  }
]

// Spinner loader component shown during loading state
function Spinner() {
  return (
    <div className="spinner-container">
      <div className="loading-spinner"></div>
      <p style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>
        Fetching repositories from GitHub API...
      </p>
    </div>
  )
}

// Error Message component shown during error state, with a retry handler and fallback loader
function ErrorMessage({ message, onRetry, onLoadFallback }) {
  return (
    <div className="error-message-card">
      <div className="error-icon">⚠️</div>
      <h3 style={{ color: '#ef4444', marginTop: '0' }}>Failed to Fetch Repositories</h3>
      <p style={{ margin: '0.5rem 0 1.2rem', fontSize: '0.95rem' }}>{message}</p>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button className="retry-btn" type="button" onClick={onRetry}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
          </svg>
          Retry Fetch
        </button>
        <button
          className="retry-btn"
          type="button"
          onClick={onLoadFallback}
          style={{ background: 'linear-gradient(135deg, var(--cyan-accent), var(--accent-color))' }}
        >
          Load Fallback Data
        </button>
      </div>
    </div>
  )
}

function Projects() {
  const [repos, setRepos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isFallback, setIsFallback] = useState(false)

  // Search input query state
  const [searchTerm, setSearchTerm] = useState('')

  // Language category filter state
  const [filter, setFilter] = useState('All')

  // UI state for metadata expansion
  const [expandedId, setExpandedId] = useState(null)

  // Username input states (default configured to user repository namespace)
  const [usernameInput, setUsernameInput] = useState('devpatel905436')

  // Fetch logic for GitHub API
  const fetchRepos = (user) => {
    setLoading(true)
    setError(null)
    setIsFallback(false)

    fetch(`https://api.github.com/users/${user}/repos?sort=updated`)
      .then((res) => {
        if (!res.ok) {
          if (res.status === 403) {
            throw new Error(`GitHub API rate limit exceeded (HTTP 403). Please load fallback data or try again later.`)
          }
          throw new Error(`GitHub user "${user}" not found (HTTP ${res.status})`)
        }
        return res.json()
      })
      .then((data) => {
        if (!Array.isArray(data)) {
          throw new Error('Invalid response format received from GitHub API.')
        }
        setRepos(data)
      })
      .catch((err) => {
        // Fallback error messaging
        setError(err.message || 'Failed to fetch repositories. You may be offline or rate-limited.')
      })
      .finally(() => {
        setLoading(false)
      })
  }

  // Trigger fetch on mount for the default username
  useEffect(() => {
    fetchRepos('devpatel905436')
  }, [])

  // Handle manual form submission to change username and refetch
  const handleUserChangeSubmit = (e) => {
    e.preventDefault()
    if (usernameInput.trim()) {
      fetchRepos(usernameInput.trim())
    }
  }

  // Load static fallback mock projects
  const handleLoadFallback = () => {
    setRepos(mockRepos)
    setError(null)
    setLoading(false)
    setIsFallback(true)
  }

  // Build dynamic categories list based on available programming languages in the fetched repositories
  const languages = Array.from(
    new Set(
      repos
        .map((repo) => repo.language)
        .filter((lang) => lang !== null && lang !== undefined && lang !== '')
    )
  )
  const categories = ['All', ...languages]

  // Filter repositories based on search term and category
  const filteredRepos = repos.filter((repo) => {
    const matchesSearch =
      repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (repo.description && repo.description.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesCategory = filter === 'All' || repo.language === filter

    return matchesSearch && matchesCategory
  })

  return (
    <div className="projects-page main-content">
      <section className="section-card page-header">
        <h2>My GitHub Projects 🚀</h2>
        <p>Explore recent repositories and source code fetched dynamically from the GitHub API.</p>
      </section>

      {/* Controls: Username query, search filter, and category filter */}
      <div className="search-controls">
        <form onSubmit={handleUserChangeSubmit} className="username-input-wrapper">
          <label htmlFor="github-user">GitHub User:</label>
          <input
            id="github-user"
            type="text"
            className="username-input"
            value={usernameInput}
            onChange={(e) => setUsernameInput(e.target.value)}
            placeholder="Username..."
          />
          <button type="submit" className="filter-btn" style={{ padding: '0.4rem 0.85rem' }}>
            Fetch
          </button>
        </form>

        <div className="search-input-wrapper">
          <svg
            className="search-icon-svg"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            className="search-input"
            placeholder="Search repositories by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Fallback Warning Notice */}
      {isFallback && (
        <div
          className="success-alert animate-fadeIn"
          style={{
            background: 'rgba(234, 179, 8, 0.15)',
            borderColor: 'rgba(234, 179, 8, 0.3)',
            color: '#eab308',
            marginBottom: '1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            padding: '1rem'
          }}
        >
          <span>⚠️ Loaded offline fallback projects (GitHub API is offline or rate-limited).</span>
          <button
            className="filter-btn"
            style={{
              padding: '0.3rem 0.75rem',
              fontSize: '0.78rem',
              borderColor: 'rgba(234, 179, 8, 0.5)',
              background: 'transparent',
              color: '#eab308'
            }}
            onClick={() => fetchRepos(usernameInput)}
          >
            Retry GitHub API
          </button>
        </div>
      )}

      {/* Filter Category Bar */}
      {!loading && !error && repos.length > 0 && (
        <div className="filter-bar">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`filter-btn ${filter === cat ? 'active' : ''}`}
              onClick={() => {
                setFilter(cat)
                setExpandedId(null)
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Main Dynamic View */}
      {loading ? (
        <Spinner />
      ) : error ? (
        <ErrorMessage
          message={error}
          onRetry={() => fetchRepos(usernameInput)}
          onLoadFallback={handleLoadFallback}
        />
      ) : filteredRepos.length === 0 ? (
        <div className="section-card" style={{ textAlign: 'center', padding: '3.5rem 2rem' }}>
          <h3 style={{ marginBottom: '0.5rem' }}>No Repositories Found</h3>
          <p>No public repositories match your current filters or username query.</p>
        </div>
      ) : (
        <div className="projects-grid">
          {filteredRepos.map((repo) => (
            <div key={repo.id} className="project-card">
              <div>
                <div className="repo-header">
                  {repo.language ? (
                    <span className="project-tag">{repo.language}</span>
                  ) : (
                    <span
                      className="project-tag"
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        color: 'var(--text-muted)',
                        borderColor: 'var(--card-border)'
                      }}
                    >
                      Other
                    </span>
                  )}

                  <span className="repo-stars-badge" title="GitHub Stars">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                    {repo.stargazers_count}
                  </span>
                </div>

                <div style={{ marginTop: '0.8rem', marginBottom: '0.5rem' }}>
                  <h3 style={{ fontSize: '1.25rem', wordBreak: 'break-all' }}>{repo.name}</h3>
                  <p style={{ marginTop: '0.45rem', fontSize: '0.9rem' }}>
                    {repo.description || 'No description provided for this repository.'}
                  </p>
                </div>
              </div>

              {/* Technical Details toggle section */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
                <button
                  type="button"
                  className="toggle-details-btn"
                  onClick={() => setExpandedId(expandedId === repo.id ? null : repo.id)}
                >
                  {expandedId === repo.id ? 'Hide Metadata ▲' : 'Show Metadata ▼'}
                </button>

                {expandedId === repo.id && (
                  <div className="project-details-box">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem 1rem', fontSize: '0.82rem' }}>
                      <div>
                        <strong>Forks:</strong> {repo.forks_count}
                      </div>
                      <div>
                        <strong>Open Issues:</strong> {repo.open_issues_count}
                      </div>
                      <div style={{ gridColumn: 'span 2' }}>
                        <strong>Last Updated:</strong>{' '}
                        {new Date(repo.updated_at).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="repo-card-footer">
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="view-repo-link"
                >
                  View on GitHub
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Projects
