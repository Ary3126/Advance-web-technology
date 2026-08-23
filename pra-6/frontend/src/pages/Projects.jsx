import { useState, useEffect } from 'react';

const mockRepos = [
  {
    id: 101,
    name: 'fullstack-task-manager',
    language: 'JavaScript',
    description: 'Complete CRUD Task Management system wiring React 19 to Express and MongoDB with Mongoose.',
    html_url: 'https://github.com/Ary3126',
    stargazers_count: 28,
    forks_count: 5,
    open_issues_count: 0,
    updated_at: new Date().toISOString()
  },
  {
    id: 102,
    name: 'express-mongoose-api',
    language: 'JavaScript',
    description: 'RESTful API with schema validation, CORS, error handling middleware, and MongoDB database persistence.',
    html_url: 'https://github.com/Ary3126',
    stargazers_count: 19,
    forks_count: 3,
    open_issues_count: 0,
    updated_at: new Date().toISOString()
  },
  {
    id: 103,
    name: 'react-spa-portfolio',
    language: 'React',
    description: 'Interactive single-page portfolio built with React Router v6, controlled state, and dark mode.',
    html_url: 'https://github.com/Ary3126',
    stargazers_count: 14,
    forks_count: 2,
    open_issues_count: 0,
    updated_at: new Date().toISOString()
  }
];

function Projects() {
  const [repos, setRepos] = useState(mockRepos);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('All');
  const [expandedId, setExpandedId] = useState(null);

  const categories = ['All', 'React', 'JavaScript'];

  const filteredRepos = repos.filter((repo) => {
    const matchesSearch =
      repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (repo.description && repo.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = filter === 'All' || repo.language === filter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="projects-page main-content">
      <section className="section-card page-header">
        <h2>Web Development Projects 🚀</h2>
        <p>Explore full-stack and frontend practical projects developed throughout the curriculum.</p>
      </section>

      <div className="search-controls">
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
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="filter-bar">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`filter-btn ${filter === cat ? 'active' : ''}`}
            onClick={() => {
              setFilter(cat);
              setExpandedId(null);
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="projects-grid">
        {filteredRepos.map((repo) => (
          <div key={repo.id} className="project-card">
            <div>
              <div className="repo-header">
                <span className="project-tag">{repo.language}</span>
                <span className="repo-stars-badge" title="Stars">
                  ⭐ {repo.stargazers_count}
                </span>
              </div>

              <div style={{ marginTop: '0.8rem', marginBottom: '0.5rem' }}>
                <h3 style={{ fontSize: '1.25rem' }}>{repo.name}</h3>
                <p style={{ marginTop: '0.45rem', fontSize: '0.9rem' }}>
                  {repo.description}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
              <button
                type="button"
                className="toggle-details-btn"
                onClick={() => setExpandedId(expandedId === repo.id ? null : repo.id)}
              >
                {expandedId === repo.id ? 'Hide Details ▲' : 'Show Details ▼'}
              </button>

              {expandedId === repo.id && (
                <div className="project-details-box">
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem 1rem', fontSize: '0.82rem' }}>
                    <div><strong>Forks:</strong> {repo.forks_count}</div>
                    <div><strong>Issues:</strong> {repo.open_issues_count}</div>
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
                View Repository &rarr;
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Projects;
