import React, { useState, useEffect, useCallback } from 'react';
import { getCacheStats, clearCache, getTasks } from '../services/api';

export default function CacheAnalytics({ showToast }) {
  const [stats, setStats] = useState({
    hits: 0,
    misses: 0,
    invalidations: 0,
    hitRatioPercent: 0,
    activeKeysCount: 0,
    activeKeys: [],
    ttlSeconds: 60
  });
  const [loading, setLoading] = useState(true);
  const [benchmarkLog, setBenchmarkLog] = useState([]);

  const refreshStats = useCallback(async () => {
    try {
      const data = await getCacheStats();
      setStats(data);
    } catch (err) {
      showToast('error', err.message || 'Failed to fetch cache stats');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    refreshStats();
    const timer = setInterval(refreshStats, 8000);
    return () => clearInterval(timer);
  }, [refreshStats]);

  const handleClearCache = async () => {
    try {
      const res = await clearCache();
      showToast('success', res.message || 'Cache cleared');
      setStats(res.currentStats || stats);
    } catch (err) {
      showToast('error', err.message || 'Failed to clear cache');
    }
  };

  const runBenchmark = async () => {
    const logs = [];
    logs.push('1. Fetching tasks from API (First Request: Cold Cache / MISS)...');
    const start1 = performance.now();
    const res1 = await getTasks();
    const time1 = Math.round(performance.now() - start1);
    logs.push(`   → Completed in ${time1}ms. Header: X-Cache: ${res1.cacheStatus}`);

    logs.push('2. Fetching tasks again (Second Request: Warm Cache / HIT from RAM)...');
    const start2 = performance.now();
    const res2 = await getTasks();
    const time2 = Math.round(performance.now() - start2);
    logs.push(`   → Completed in ${time2}ms. Header: X-Cache: ${res2.cacheStatus}`);

    logs.push(`⚡ Performance Gain: ~${Math.max(1, Math.round(time1 / Math.max(1, time2)))}x faster via node-cache!`);
    setBenchmarkLog(logs);
    refreshStats();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div className="badge badge-low" style={{ marginBottom: '0.5rem' }}>
            Practical 9 · Performance & In-Memory Storage
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800 }}>In-Memory Cache Analytics</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Live performance dashboard powered by process-local <code>node-cache</code> with automatic invalidation.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-secondary btn-sm" onClick={refreshStats}>
            🔄 Refresh
          </button>
          <button className="btn btn-danger btn-sm" onClick={handleClearCache}>
            🗑 Flush Cache
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid-4" style={{ marginBottom: '2rem' }}>
        <div className="glass-panel" style={{ borderLeft: '4px solid var(--success)' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Cache Hits (RAM)</div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--success)' }}>{stats.hits}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Served in &lt;1ms without DB lookup</div>
        </div>

        <div className="glass-panel" style={{ borderLeft: '4px solid var(--accent-secondary)' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Cache Misses (DB)</div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--accent-secondary)' }}>{stats.misses}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Fetched from MongoDB & cached</div>
        </div>

        <div className="glass-panel" style={{ borderLeft: '4px solid var(--warning)' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Hit Ratio</div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--warning)' }}>{stats.hitRatioPercent}%</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Efficiency percentage</div>
        </div>

        <div className="glass-panel" style={{ borderLeft: '4px solid var(--border-focus)' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Active Keys / TTL</div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--border-focus)' }}>
            {stats.activeKeysCount} <span style={{ fontSize: '1rem', fontWeight: 400 }}>({stats.ttlSeconds}s)</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Auto-expires every {stats.ttlSeconds}s</div>
        </div>
      </div>

      <div className="grid-2">
        {/* Active Cache Keys Inspector */}
        <div className="glass-panel">
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.75rem' }}>
            🔑 In-Memory Cache Key Inspector
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Keys are partitioned per authenticated user to prevent data leaks across sessions.
          </p>

          {stats.activeKeys && stats.activeKeys.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {stats.activeKeys.map((key, i) => (
                <div key={i} style={{ padding: '0.65rem 0.85rem', background: 'rgba(0,0,0,0.25)', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <code style={{ fontSize: '0.85rem', color: '#38bdf8' }}>{key}</code>
                  <span className="badge badge-low">ACTIVE</span>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              No active keys in memory. Load the Tasks page to warm the cache!
            </div>
          )}
        </div>

        {/* Live Latency Benchmark */}
        <div className="glass-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>
              ⏱️ Real-Time Latency Benchmark
            </h3>
            <button className="btn btn-primary btn-sm" onClick={runBenchmark}>
              Run Test
            </button>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Measures round-trip latency comparing cold query execution vs warm cache retrieval.
          </p>

          {benchmarkLog.length > 0 ? (
            <pre className="code-box">
              {benchmarkLog.join('\n')}
            </pre>
          ) : (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Click "Run Test" above to verify the latency speedup!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

