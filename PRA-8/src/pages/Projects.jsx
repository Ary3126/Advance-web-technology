import { useState } from 'react';

const heavy = new Array(2000).fill(0).map((_, i) => ({ id: i + 1, name: `Project ${i + 1}` }));

export default function Projects() {
  const [q, setQ] = useState('');
  const filtered = heavy.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="page projects">
      <h2>Projects (Baseline)</h2>
      <input placeholder="Filter" value={q} onChange={(e) => setQ(e.target.value)} />
      <div style={{ marginTop: '1rem' }}>
        {filtered.slice(0, 50).map((p) => (
          <div key={p.id}>{p.name}</div>
        ))}
      </div>
    </div>
  );
}
