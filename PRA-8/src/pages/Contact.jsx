import { useState } from 'react';

export default function Contact() {
  const [txt, setTxt] = useState('');
  return (
    <div className="page contact">
      <h2>Contact (Baseline)</h2>
      <textarea value={txt} onChange={(e) => setTxt(e.target.value)} rows={6} cols={40} />
      <div style={{ marginTop: '1rem' }}>Typed: {txt.slice(0, 200)}</div>
    </div>
  );
}
