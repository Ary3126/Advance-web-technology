const NodeCache = require('node-cache');

const CACHE_TTL_SECONDS = Number(process.env.CACHE_TTL_SECONDS) || 60;
const cache = new NodeCache({
  stdTTL: CACHE_TTL_SECONDS,
  checkperiod: Math.max(1, Math.floor(CACHE_TTL_SECONDS / 2)),
  useClones: true
});

const stats = {
  hits: 0,
  misses: 0,
  invalidations: 0
};

const allTasksKey = (userId = 'guest') => `tasks:all:${userId}`;
const taskKey = (userId = 'guest', taskId) => `tasks:one:${userId}:${taskId}`;

const get = (key) => {
  const value = cache.get(key);
  if (value === undefined) {
    stats.misses += 1;
    return undefined;
  }
  stats.hits += 1;
  return value;
};

const set = (key, value, ttl = CACHE_TTL_SECONDS) => cache.set(key, value, ttl);

const invalidateTasks = (userId = 'guest', taskId = null) => {
  const keys = [allTasksKey(userId), allTasksKey('all'), allTasksKey('guest')];
  if (taskId) {
    keys.push(taskKey(userId, taskId));
    keys.push(taskKey('guest', taskId));
  }
  const deletedCount = cache.del(keys);
  stats.invalidations += deletedCount;
  return deletedCount;
};

const clearAll = () => {
  const totalKeys = cache.keys().length;
  cache.flushAll();
  stats.invalidations += totalKeys;
  return totalKeys;
};

const getStats = () => {
  const totalRequests = stats.hits + stats.misses;
  const hitRatio = totalRequests === 0 ? 0 : Number(((stats.hits / totalRequests) * 100).toFixed(2));
  return {
    hits: stats.hits,
    misses: stats.misses,
    invalidations: stats.invalidations,
    hitRatioPercent: hitRatio,
    activeKeysCount: cache.keys().length,
    activeKeys: cache.keys(),
    ttlSeconds: CACHE_TTL_SECONDS
  };
};

module.exports = {
  allTasksKey,
  taskKey,
  get,
  set,
  invalidateTasks,
  clearAll,
  getStats
};

