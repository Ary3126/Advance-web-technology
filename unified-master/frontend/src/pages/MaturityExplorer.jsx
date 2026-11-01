import React, { useState } from 'react';
import { executeMaturityRequest } from '../services/api';

export default function MaturityExplorer({ showToast }) {
  const [activeLevel, setActiveLevel] = useState('v3');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const levelsInfo = {
    v0: {
      name: 'Level 0: The Swamp of POX (Plain Old XML/JSON)',
      desc: 'Single URI RPC tunneling via POST. HTTP is used solely as a transport protocol. Ignores HTTP verbs and always returns HTTP 200 OK even when errors occur.',
      endpoint: 'POST /api/v0/taskManager'
    },
    v1: {
      name: 'Level 1: Individual Resource URIs',
      desc: 'Introduces separate URIs per resource (e.g. /api/v1/tasks/1, /api/v1/tasks/create), but does not use proper HTTP verbs (e.g. POST for delete) and returns inaccurate status codes.',
      endpoint: '/api/v1/tasks/*'
    },
    v2: {
      name: 'Level 2: Standard HTTP Verbs & Status Codes',
      desc: 'Standard REST compliance. Correct HTTP verbs (GET, POST, PUT, DELETE) and standard HTTP status codes (200 OK, 201 Created + Location header, 400 Bad Request, 404 Not Found).',
      endpoint: 'GET/POST/PUT/DELETE /api/v2/tasks'
    },
    v3: {
      name: 'Level 3: Hypermedia Controls (HATEOAS)',
      desc: 'Hypermedia As The Engine Of Application State. Resources include dynamic _links pointing to permissible next actions (self, update, delete, toggleComplete, collection).',
      endpoint: 'GET /api/v3/tasks'
    }
  };

  const handleAction = async (action, payload = {}) => {
    setLoading(true);
    try {
      const data = await executeMaturityRequest(activeLevel, action, payload);
      setResult(data);
      showToast('info', `Executed ${data.request.method} ${data.request.url} (${data.response.status})`);
    } catch (err) {
      showToast('error', err.message || 'Execution error');
    } finally {
      setLoading(false);
    }
  };

  const handleHateoasLinkClick = async (linkObj) => {
    setLoading(true);
    try {
      const data = await executeMaturityRequest('v3', 'customUri', {
        customUri: linkObj.href,
        method: linkObj.method
      });
      setResult(data);
      showToast('success', `Navigated HATEOAS link: ${linkObj.method} ${linkObj.href}`);
    } catch (err) {
      showToast('error', err.message || 'Link navigation error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <div className="badge badge-medium" style={{ marginBottom: '0.5rem' }}>
          Week 4 Assignment · REST Architecture
        </div>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800 }}>Richardson Maturity Model Explorer</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Interactive playground evaluating all 4 levels of Leonard Richardson’s REST Maturity model.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', flexWrap: 'wrap' }}>
        {Object.entries(levelsInfo).map(([key, info]) => (
          <button
            key={key}
            className={`btn btn-sm ${activeLevel === key ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => {
              setActiveLevel(key);
              setResult(null);
            }}
          >
            {key.toUpperCase()}: {info.name.split(':')[0]}
          </button>
        ))}
      </div>

      {/* Level Summary Banner */}
      <div className="glass-panel" style={{ marginBottom: '1.5rem', borderLeft: '4px solid var(--accent-primary)' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.35rem' }}>
          {levelsInfo[activeLevel].name}
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.75rem' }}>
          {levelsInfo[activeLevel].desc}
        </p>
        <div style={{ fontSize: '0.85rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-primary)' }}>
          Target: {levelsInfo[activeLevel].endpoint}
        </div>
      </div>

      {/* Action Controls */}
      <div className="glass-panel" style={{ marginBottom: '1.5rem' }}>
        <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem' }}>
          ⚡ Trigger Live Test Operations on {activeLevel.toUpperCase()}
        </h4>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button className="btn btn-secondary btn-sm" disabled={loading} onClick={() => handleAction('getAllTasks')}>
            Fetch All Tasks
          </button>
          <button className="btn btn-secondary btn-sm" disabled={loading} onClick={() => handleAction('getTaskById', { id: '1' })}>
            Fetch Task ID: 1
          </button>
          <button
            className="btn btn-primary btn-sm"
            disabled={loading}
            onClick={() =>
              handleAction('createTask', {
                title: `Demo ${activeLevel.toUpperCase()} Task`,
                description: 'Verifying HTTP status and payload semantics',
                priority: 'high'
              })
            }
          >
            Create Task
          </button>
          <button className="btn btn-danger btn-sm" disabled={loading} onClick={() => handleAction('deleteTask', { id: '1' })}>
            Delete Task ID: 1
          </button>
        </div>
      </div>

      {/* Side-by-Side Request & Response Inspection */}
      {result && (
        <div className="grid-2">
          {/* Request Inspection */}
          <div className="glass-panel">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>📤 HTTP Request</span>
              <span className="badge badge-low">{result.request.method}</span>
            </h3>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', wordBreak: 'break-all' }}>
              <strong>URL:</strong> <code>{result.request.url}</code>
            </div>
            {result.request.body && (
              <div>
                <strong style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Body Payload:</strong>
                <pre className="code-box" style={{ marginTop: '0.4rem' }}>
                  {JSON.stringify(result.request.body, null, 2)}
                </pre>
              </div>
            )}
          </div>

          {/* Response Inspection */}
          <div className="glass-panel">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>📥 HTTP Response</span>
              <span className={`badge ${result.response.status < 300 ? 'badge-low' : 'badge-high'}`}>
                {result.response.status} {result.response.statusText}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                ({result.response.durationMs}ms)
              </span>
            </h3>

            {/* If Level 3, render interactive HATEOAS link navigator */}
            {activeLevel === 'v3' && result.response.data && (
              <div style={{ marginBottom: '1rem', padding: '0.75rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>
                  🔗 Navigable HATEOAS Hypermedia Links Found:
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {/* Extract _links */}
                  {result.response.data._links &&
                    Object.entries(result.response.data._links).map(([rel, link]) => (
                      <button
                        key={rel}
                        className="btn btn-secondary btn-sm"
                        style={{ fontSize: '0.75rem' }}
                        onClick={() => handleHateoasLinkClick(link)}
                      >
                        {rel} ({link.method || 'GET'})
                      </button>
                    ))}
                </div>
              </div>
            )}

            <div style={{ marginBottom: '0.5rem' }}>
              <strong style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Response Payload:</strong>
              <pre className="code-box" style={{ marginTop: '0.4rem' }}>
                {JSON.stringify(result.response.data, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

