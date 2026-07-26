import { useState, useEffect } from 'react'

function Projects() {
  // --- STATE FOR FEATURED SHOWCASE (Practical 2) ---
  const [filter, setFilter] = useState('All')
  const [expandedId, setExpandedId] = useState(null)

  // --- STATE FOR GITHUB API INTEGRATION (Practical 3) ---
  const [activeTab, setActiveTab] = useState('showcase') // 'showcase' | 'github'
  const [repos, setRepos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  
  // Custom Username Fetching
  const [usernameInput, setUsernameInput] = useState('devpatel905436')
  const [githubUsername, setGithubUsername] = useState('devpatel905436')

  // --- STATE FOR LAB ACCORDION ---
  const [expandedQaId, setExpandedQaId] = useState(null)

  const projects = [
    {
      id: 1,
      title: 'Portfolio Single Page Application',
      category: 'React',
      description: 'Multi-page interactive portfolio built using React 19, React Router v6, and modern CSS custom properties.',
      details: 'Features client-side routing without page reloads, controlled form inputs with live character count, and dynamic dark/light theme switching.',
      tags: ['React', 'React Router', 'CSS3']
    },
    {
      id: 2,
      title: 'Interactive Weather Dashboard',
      category: 'JavaScript',
      description: 'Real-time weather application fetching data from OpenWeather REST API with location lookup.',
      details: 'Utilizes Async/Await ES6 fetch API, local storage for recent searches, and dynamic DOM rendering based on weather conditions.',
      tags: ['JavaScript', 'REST API', 'Async/Await']
    },
    {
      id: 3,
      title: 'Task Tracker & Kanban Board',
      category: 'React',
      description: 'Productivity application with drag-and-drop task management and priority filtering.',
      details: 'Built with React useState & useEffect hooks, custom local persistence layer, and responsive CSS grid arrangement.',
      tags: ['React', 'State Management', 'Local Storage']
    },
    {
      id: 4,
      title: 'CSS Glassmorphism UI Component Library',
      category: 'CSS',
      description: 'A modern design system showcasing dark theme glassmorphism cards, glowing badges, and smooth animations.',
      details: 'Uses CSS backdrop-filter, flexbox, grid, and CSS variables for quick thematic customization.',
      tags: ['CSS Variables', 'Glassmorphism', 'UI Design']
    }
  ]

  const categories = ['All', 'React', 'JavaScript', 'CSS']

  const filteredProjects = filter === 'All'
    ? projects
    : projects.filter((p) => p.category === filter)

  const toggleDetails = (id) => {
    setExpandedId(expandedId === id ? null : id)
  }

  // --- FETCH GITHUB REPOSITORIES (REST API) ---
  const fetchRepos = async (username) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated`)
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`GitHub user "${username}" not found.`)
        } else if (response.status === 403) {
          throw new Error('API Rate Limit exceeded. Please try again later.')
        } else {
          throw new Error(`Failed to fetch repositories. Status: ${response.status}`)
        }
      }
      const data = await response.json()
      // If it's a valid response but user has no public repos
      if (Array.isArray(data)) {
        setRepos(data)
      } else {
        throw new Error('Invalid format received from GitHub API.')
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred while fetching data.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRepos(githubUsername)
  }, [githubUsername])

  const handleFetchUser = (e) => {
    e.preventDefault()
    if (usernameInput.trim()) {
      setGithubUsername(usernameInput.trim())
    }
  }

  const handleRetry = () => {
    fetchRepos(githubUsername)
  }

  // Filter GitHub repositories
  const filteredRepos = repos.filter(repo => {
    const query = searchQuery.toLowerCase()
    const nameMatch = repo.name?.toLowerCase().includes(query)
    const descMatch = repo.description?.toLowerCase().includes(query)
    return nameMatch || descMatch
  })

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  // Toggle Accordion Q&A
  const toggleQa = (id) => {
    setExpandedQaId(expandedQaId === id ? null : id)
  }

  const qaData = [
    {
      id: 1,
      question: 'Why is useEffect required to trigger a fetch on component mount instead of calling fetch directly in the component body?',
      answer: 'Calling fetch directly in the component body executes it during every single render. Since state updates (like setting repos or loading state) trigger a re-render, this would create an infinite loop of fetch requests, leading to API rate-limiting or browser lockups. Using useEffect with an empty dependency array [] ensures the network request fires exactly once when the component initially mounts.'
    },
    {
      id: 2,
      question: 'What is the difference between a loading state and an error state, and why must both be handled separately?',
      answer: 'A loading state represents a temporary transition indicating that an asynchronous request is currently in progress. An error state is a failure condition indicating the request failed (due to network drops, invalid endpoint, or API limits). They must be handled separately because they convey completely different contexts: loading requires patient waiting (e.g., showing a spinner), while error requires debugging feedback and actionable recovery steps (e.g., retry buttons).'
    },
    {
      id: 3,
      question: 'How would the user experience change if loading and error states were not implemented?',
      answer: 'Without loading states, users would see a static blank screen or missing items with no visual feedback, leaving them guessing if the app is frozen. Without error states, failures would happen silently or crash the client, leaving users permanently stuck with a broken interface and no explanation of how to fix it or retry.'
    }
  ]

  return (
    <div className="projects-page main-content">
      <section className="section-card page-header">
        <h2>My Projects & Repositories 🚀</h2>
        <p>Explore static showcase projects and dynamic live repositories retrieved from GitHub REST API.</p>
      </section>

      {/* Primary Tab Navigation */}
      <div className="tab-container">
        <button
          className={`tab-btn ${activeTab === 'showcase' ? 'active' : ''}`}
          onClick={() => setActiveTab('showcase')}
        >
          📂 Featured Showcase
        </button>
        <button
          className={`tab-btn ${activeTab === 'github' ? 'active' : ''}`}
          onClick={() => setActiveTab('github')}
        >
          🌐 Live GitHub Repos
        </button>
      </div>

      {/* Tab Content 1: Static Featured Showcase */}
      {activeTab === 'showcase' && (
        <div style={{ animation: 'fadeIn 0.3s ease' }}>
          {/* Filter Category Bar */}
          <div className="filter-bar">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`filter-btn ${filter === cat ? 'active' : ''}`}
                onClick={() => setFilter(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Projects Grid */}
          <div className="projects-grid">
            {filteredProjects.map((project) => (
              <div key={project.id} className="project-card">
                <div>
                  <span className="project-tag">{project.category}</span>
                  <h3 style={{ marginTop: '0.6rem', marginBottom: '0.4rem' }}>{project.title}</h3>
                  <p>{project.description}</p>
                </div>

                <div className="skill-list" style={{ marginTop: '0.4rem', marginBottom: '0.6rem' }}>
                  {project.tags.map((tag) => (
                    <li key={tag} style={{ fontSize: '0.78rem', padding: '0.3rem 0.75rem' }}>
                      {tag}
                    </li>
                  ))}
                </div>

                <button
                  type="button"
                  className="toggle-details-btn"
                  onClick={() => toggleDetails(project.id)}
                >
                  {expandedId === project.id ? 'Hide Technical Details ▲' : 'Show Technical Details ▼'}
                </button>

                {expandedId === project.id && (
                  <div className="project-details-box">
                    <strong>Key Features & Implementation:</strong>
                    <p style={{ marginTop: '0.35rem' }}>{project.details}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content 2: Dynamic GitHub Repositories (REST API) */}
      {activeTab === 'github' && (
        <div style={{ animation: 'fadeIn 0.3s ease' }}>
          {/* Inputs Panel: Search Repos & Fetch Username */}
          <div className="repo-search-container">
            <div className="repo-input-wrapper">
              <label htmlFor="username-input">GitHub Username</label>
              <form onSubmit={handleFetchUser} className="repo-input-group">
                <input
                  id="username-input"
                  type="text"
                  placeholder="Enter GitHub username"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                />
                <button type="submit" className="repo-fetch-btn">Fetch</button>
              </form>
            </div>
            
            <div className="repo-input-wrapper">
              <label htmlFor="search-input">Search Repositories</label>
              <div className="repo-input-group">
                <input
                  id="search-input"
                  type="text"
                  placeholder="Filter by name or keyword..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Conditional Rendering Blocks */}
          {loading ? (
            <div className="spinner-container">
              <div className="spinner"></div>
              <span className="spinner-text">Fetching repositories for @{githubUsername}...</span>
            </div>
          ) : error ? (
            <div className="error-box">
              <h3>API Connection Failed ⚠️</h3>
              <p>{error}</p>
              <button className="retry-btn" onClick={handleRetry}>
                🔄 Retry Connection
              </button>
            </div>
          ) : (
            <div>
              {/* Repos Grid */}
              {filteredRepos.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                  <p>No repositories found for @{githubUsername} matching "{searchQuery}".</p>
                </div>
              ) : (
                <div className="repos-grid">
                  {filteredRepos.map((repo) => (
                    <div key={repo.id} className="repo-card">
                      <div className="repo-header">
                        <div className="repo-title-wrapper">
                          <span className="repo-badge">{repo.private ? 'Private' : 'Public'}</span>
                          <h3 style={{ marginTop: '0.4rem', fontSize: '1.25rem', wordBreak: 'break-word' }}>
                            {repo.name}
                          </h3>
                        </div>
                        <div className="repo-stars" title={`${repo.stargazers_count} stars`}>
                          ⭐ {repo.stargazers_count}
                        </div>
                      </div>

                      <p className="repo-desc">
                        {repo.description || 'No description provided for this GitHub repository.'}
                      </p>

                      <div className="repo-footer">
                        <div className="repo-meta">
                          {repo.language && (
                            <span className="repo-lang">
                              <span className="lang-dot" style={{ backgroundColor: getLangColor(repo.language) }}></span>
                              {repo.language}
                            </span>
                          )}
                          <span>Updated: {formatDate(repo.updated_at)}</span>
                        </div>
                        <a
                          href={repo.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="repo-link"
                        >
                          View Code &rarr;
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Lab Theory & Q&A Accordion (Always visible at the bottom) */}
      <div className="qa-container">
        <div className="qa-header-section">
          <span className="qa-subtitle">Self-Study & Key Concept Verification</span>
          <h2>AWT Practical 3 Analysis 📝</h2>
          <p>Important analysis questions on asynchronous operations and hooks in React.</p>
        </div>

        <div className="qa-grid">
          {qaData.map((qa) => (
            <div
              key={qa.id}
              className={`qa-item ${expandedQaId === qa.id ? 'expanded' : ''}`}
            >
              <button
                className="qa-question"
                onClick={() => toggleQa(qa.id)}
              >
                <span>{qa.question}</span>
                <span className="qa-toggle-icon">▼</span>
              </button>
              <div className="qa-answer">
                <p><strong>Analysis:</strong></p>
                <p>{qa.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Simple color mappings for popular programming languages
function getLangColor(lang) {
  const colors = {
    JavaScript: '#f1e05a',
    TypeScript: '#3178c6',
    HTML: '#e34c26',
    CSS: '#563d7c',
    Python: '#3572A5',
    Java: '#b07219',
    C: '#555555',
    'C++': '#f34b7d',
    Rust: '#dea584',
    Go: '#00ADD8'
  }
  return colors[lang] || 'var(--accent-color)'
}

export default Projects
