import { useState } from 'react';

function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [showHelp, setShowHelp] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const MAX_CHAR_LIMIT = 250;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setSubmitted(true);
  };

  const handleReset = () => {
    setName('');
    setEmail('');
    setMessage('');
    setSubmitted(false);
  };

  return (
    <div className="contact-page main-content">
      <div className="contact-container">
        <section className="contact-card">
          <div className="form-header">
            <h2>Get In Touch 📩</h2>
            <button
              type="button"
              className="tooltip-toggle-btn"
              onClick={() => setShowHelp(!showHelp)}
            >
              {showHelp ? '✕ Hide Tips' : '💡 Help Tips'}
            </button>
          </div>

          {showHelp && (
            <div className="help-tooltip-box">
              <strong>Tips for reaching out:</strong>
              <ul>
                <li>Provide a clear subject and your professional email address.</li>
                <li>Messages are reflected live in the preview card on the right.</li>
                <li>Character count updates dynamically as you type.</li>
              </ul>
            </div>
          )}

          {submitted ? (
            <div className="success-alert">
              <h3>Thank you, {name}! 🎉</h3>
              <p style={{ marginTop: '0.4rem', color: 'inherit' }}>
                Your message has been recorded successfully.
              </p>
              <button
                type="button"
                className="cta-button"
                style={{ marginTop: '1rem', padding: '0.5rem 1.2rem', fontSize: '0.85rem' }}
                onClick={handleReset}
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label htmlFor="name-input">Your Name</label>
                <input
                  id="name-input"
                  type="text"
                  placeholder="e.g. Alex Johnson"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email-input">Email Address</label>
                <input
                  id="email-input"
                  type="email"
                  placeholder="e.g. alex@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="message-input">Message</label>
                <div className="textarea-wrapper">
                  <textarea
                    id="message-input"
                    rows="4"
                    maxLength={MAX_CHAR_LIMIT}
                    placeholder="Type your message here..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                  />
                  <div
                    className={`char-counter ${
                      message.length >= MAX_CHAR_LIMIT - 20 ? 'warning' : ''
                    }`}
                  >
                    Character Count: {message.length} / {MAX_CHAR_LIMIT}
                  </div>
                </div>
              </div>

              <button type="submit" className="cta-button">
                Send Message &rarr;
              </button>
            </form>
          )}
        </section>

        <section className="preview-card">
          <span className="live-badge">⚡ Real-Time Live Preview</span>
          <h3>Form Input State</h3>
          <p>Demonstrates reactive state updates using React <code>useState</code> hook.</p>

          <div className="preview-content">
            <div className="preview-field">
              <small>Name State</small>
              <span>{name || '(Waiting for input...)'}</span>
            </div>

            <div className="preview-field">
              <small>Email State</small>
              <span>{email || '(Waiting for input...)'}</span>
            </div>

            <div className="preview-field">
              <small>Message State ({message.length} chars)</small>
              <span>{message || '(Waiting for input...)'}</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Contact;
