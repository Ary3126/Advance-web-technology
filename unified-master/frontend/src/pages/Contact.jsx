import React, { useState } from 'react';

export default function Contact({ showToast }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      showToast('warning', 'Please complete all required fields.');
      return;
    }

    setSubmitted(true);
    showToast('success', `Thank you, ${form.name}! Your message has been received.`);
  };

  return (
    <div style={{ maxWidth: '640px', margin: '1rem auto' }}>
      <div className="glass-panel">
        <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
          <div className="badge badge-medium" style={{ marginBottom: '0.5rem' }}>
            Practical 2 · Interactive State Handling
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Contact & Academic Inquiry</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Demonstrates controlled form inputs, useState state synchronization, and dynamic submission handling.
          </p>
        </div>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🎉</div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Message Dispatched!</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Your inquiry has been stored in state and logged to the developer console.
            </p>
            <button
              className="btn btn-secondary"
              onClick={() => {
                setSubmitted(false);
                setForm({ name: '', email: '', subject: '', message: '' });
              }}
            >
              Send Another Inquiry
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Name *</label>
              <input
                className="form-control"
                placeholder="Ary Patel"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Email Address *</label>
              <input
                type="email"
                className="form-control"
                placeholder="ary@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Subject</label>
              <input
                className="form-control"
                placeholder="Evaluation of Practical 6 Integration"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Message *</label>
              <textarea
                className="form-control"
                rows="4"
                placeholder="Enter inquiry details or feedback..."
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
              Submit Form via React State
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

