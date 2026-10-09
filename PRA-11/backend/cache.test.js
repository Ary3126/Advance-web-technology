const assert = require('node:assert/strict');
const test = require('node:test');

const cache = require('./cache');

test('uses stable per-user keys and records hits and misses', () => {
  const key = cache.allTasksKey('user-a');
  assert.equal(key, 'tasks:all:user-a');

  cache.set(key, [{ title: 'Cached task' }]);
  assert.deepEqual(cache.get(key), [{ title: 'Cached task' }]);
  assert.equal(cache.get('missing-key'), undefined);
});

test('invalidates collection and single-task entries for one user', () => {
  const userId = 'user-b';
  const taskId = 'task-b';
  cache.set(cache.allTasksKey(userId), ['list']);
  cache.set(cache.taskKey(userId, taskId), { title: 'single' });
  cache.set(cache.allTasksKey('user-c'), ['other-user']);

  cache.invalidateTasks(userId, taskId);

  assert.equal(cache.get(cache.allTasksKey(userId)), undefined);
  assert.equal(cache.get(cache.taskKey(userId, taskId)), undefined);
  assert.deepEqual(cache.get(cache.allTasksKey('user-c')), ['other-user']);
});
