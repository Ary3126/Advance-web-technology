const test = require('node:test');
const assert = require('node:assert/strict');
const taskEvents = require('./events');

test('emits task-created without waiting for a slow listener', async () => {
  const originalListeners = taskEvents.listeners('task-created');
  taskEvents.removeAllListeners('task-created');

  let completed = false;
  taskEvents.once('task-created', () => {
    setTimeout(() => {
      completed = true;
    }, 50);
  });

  const startedAt = Date.now();
  taskEvents.emit('task-created', { title: 'Async test task' });
  const emitDuration = Date.now() - startedAt;

  assert.equal(completed, false);
  assert.ok(emitDuration < 50);

  await new Promise((resolve) => setTimeout(resolve, 70));
  assert.equal(completed, true);

  taskEvents.removeAllListeners('task-created');
  originalListeners.forEach((listener) => taskEvents.on('task-created', listener));
});

test('supports task-deleted events', () => {
  let receivedTask;
  const listener = (task) => {
    receivedTask = task;
  };

  taskEvents.once('task-deleted', listener);
  const task = { title: 'Deleted task' };
  taskEvents.emit('task-deleted', task);

  assert.equal(receivedTask, task);
});
