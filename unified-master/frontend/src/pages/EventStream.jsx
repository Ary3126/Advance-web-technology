import React, { useState, useEffect, useCallback } from 'react';
import { getEventLogs, simulateEvent } from '../services/api';

export default function EventStream({ showToast }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [simulating, setSimulating] = useState(false);

  const fetchLogs = useCallback(async () => {
    try {
      const data = await getEventLogs(25);
      if (data && data.events) {
        setEvents(data.events);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 2500);
    return () => clearInterval(interval);
  }, [fetchLogs]);

  const handleSimulate = async () => {
    setSimulating(true);
    try {
      const res = await simulateEvent({
        title: 'Asynchronous Background Task Demo',
        priority: 'high'
      });
      showToast('info', 'Dispatched async event! Background worker active for 2s...');
      fetchLogs();
      setTimeout(() => {
        setSimulating(false);
        fetchLogs();
        showToast('success', 'Background notification task finished!');
      }, 2100);
    } catch (err) {
      showToast('error', err.message || 'Simulation error');
      setSimulating(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div className="badge badge-low" style={{ marginBottom: '0.5rem' }}>
            Practical 10 · Event-Driven Architecture
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800 }}>Asynchronous Event Streamer</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Native Node.js <code>EventEmitter</code> worker logs decoupled notifications without blocking HTTP responses.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-secondary btn-sm" onClick={fetchLogs}>
            🔄 Refresh Feed
          </button>
          <button className="btn btn-primary btn-sm" disabled={simulating} onClick={handleSimulate}>
            {simulating ? '⏳ Processing (2s)...' : '⚡ Simulate Background Event'}
          </button>
        </div>
      </div>

      {/* Architecture Explanation Card */}
      <div className="glass-panel" style={{ marginBottom: '1.5rem', borderLeft: '4px solid #8b5cf6' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.35rem' }}>
          🧠 How Asynchronous Processing Decouples Workflows
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.6 }}>
          1. <strong>Immediate HTTP Response:</strong> When a user creates or modifies a task, MongoDB saves the document and the API sends a <code>201 Created</code> response in ~5-10ms.<br />
          2. <strong>Asynchronous Event Emission:</strong> After sending the response, <code>taskEvents.emit('task-created', task)</code> fires in the background.<br />
          3. <strong>Decoupled Listener:</strong> Registered listeners simulate sending push notifications, webhooks, or emails after a 2-second asynchronous delay without slowing down the client!
        </p>
      </div>

      {/* Live Event Stream Timeline */}
      <div className="glass-panel">
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem' }}>
          📡 Emitted Event Timeline ({events.length} logs)
        </h3>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
            Loading event stream...
          </div>
        ) : events.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
            <p>No recent events recorded yet.</p>
            <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>
              Create a task in the Tasks page or click "Simulate Background Event" above!
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '540px', overflowY: 'auto' }}>
            {events.map((ev) => (
              <div
                key={ev.id}
                style={{
                  padding: '1rem',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '1rem',
                  flexWrap: 'wrap'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
                    <span className={`badge ${ev.status === 'completed' ? 'badge-low' : 'badge-medium'}`}>
                      {ev.type}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {new Date(ev.timestamp).toLocaleTimeString()}
                    </span>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: ev.status === 'completed' ? 'var(--success)' : 'var(--warning)'
                      }}
                    >
                      {ev.status === 'completed' ? `✓ Completed (${ev.durationMs}ms)` : '⏳ Processing in background...'}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    Payload: <strong>{ev.payload?.title || ev.payload?.name || JSON.stringify(ev.payload)}</strong>
                  </div>
                </div>

                <div style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                  ID: {ev.id.substring(0, 14)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

