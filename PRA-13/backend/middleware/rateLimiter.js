// Simple in-memory rate limiter for AI API endpoints (Supplementary Problem 2)
// Restricts excessive calls to prevent quota exhaustion and high API costs

const rateLimitStore = new Map();

const aiRateLimiter = (options = {}) => {
  const windowMs = options.windowMs || 60 * 1000; // 1 minute window
  const maxRequests = options.maxRequests || 5;    // Max 5 requests per window

  return (req, res, next) => {
    // In test environment or health checks, skip rate limiter
    if (process.env.NODE_ENV === 'test' && !req.headers['x-test-ratelimit']) {
      return next();
    }

    const key = req.ip || req.headers['x-forwarded-for'] || 'anonymous';
    const currentTime = Date.now();

    let clientData = rateLimitStore.get(key);
    if (!clientData || currentTime - clientData.startTime > windowMs) {
      clientData = {
        count: 1,
        startTime: currentTime
      };
      rateLimitStore.set(key, clientData);
    } else {
      clientData.count += 1;
    }

    const remaining = Math.max(0, maxRequests - clientData.count);
    const resetTime = Math.ceil((clientData.startTime + windowMs - currentTime) / 1000);

    res.setHeader('X-RateLimit-Limit', maxRequests);
    res.setHeader('X-RateLimit-Remaining', remaining);
    res.setHeader('X-RateLimit-Reset', resetTime);

    if (clientData.count > maxRequests) {
      return res.status(429).json({
        success: false,
        fallback: true,
        message: 'Rate limit exceeded: Maximum 5 AI requests per minute allowed. Please try again shortly.',
        retryAfter: resetTime
      });
    }

    next();
  };
};

module.exports = aiRateLimiter;
