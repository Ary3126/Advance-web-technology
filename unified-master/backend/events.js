const EventEmitter = require('events');

class UnifiedEvents extends EventEmitter {
  constructor() {
    super();
    this.history = [];
    this.maxHistory = 100;
  }

  logEvent(type, payload, status = 'completed', durationMs = 0) {
    const entry = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      type,
      payload,
      status,
      durationMs,
      timestamp: new Date().toISOString()
    };
    this.history.unshift(entry);
    if (this.history.length > this.maxHistory) {
      this.history.pop();
    }
    return entry;
  }

  getRecentLogs(limit = 30) {
    return this.history.slice(0, limit);
  }
}

module.exports = new UnifiedEvents();

