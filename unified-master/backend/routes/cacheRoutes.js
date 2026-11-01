const express = require('express');
const cache = require('../cache');

const router = express.Router();

// GET /api/cache/stats (Practical 9)
router.get('/stats', (req, res) => {
  res.status(200).json(cache.getStats());
});

// POST /api/cache/clear (Testing & live demonstration)
router.post('/clear', (req, res) => {
  const flushedCount = cache.clearAll();
  res.status(200).json({
    message: `Cache successfully flushed. ${flushedCount} keys invalidated.`,
    flushedCount,
    currentStats: cache.getStats()
  });
});

module.exports = router;

