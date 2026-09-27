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

const allTasksKey = (userId) => `tasks:all:${userId}`;
const taskKey = (userId, taskId) => `tasks:one:${userId}:${taskId}`;

const get = (key) => {
  const value = cache.get(key);
  if (value === undefined) {
    stats.misses += 1;
    return undefined;
  }

  stats.hits += 1;
  return value;
};

const set = (key, value) => cache.set(key, value);

const invalidateTasks = (userId, taskId) => {
  const keys = [allTasksKey(userId)];
  if (taskId) {
    keys.push(taskKey(userId, taskId));
  }

  stats.invalidations += cache.del(keys);
};

const getStats = () => ({
  ...stats,
  keys: cache.keys(),
  ttlSeconds: CACHE_TTL_SECONDS
});

module.exports = {
  allTasksKey,
  taskKey,
  get,
  set,
  invalidateTasks,
  getStats
};
