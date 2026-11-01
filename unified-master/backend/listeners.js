const taskEvents = require('./events');

const registerListeners = () => {
  // Listen for task creation (Practical 10 Requirement)
  taskEvents.on('task-created', (task) => {
    const startedAt = Date.now();
    const isoStart = new Date(startedAt).toISOString();
    console.log(`[Event-Driven Async Worker] Started background notification for task "${task.title}" at ${isoStart}`);
    
    // Initial in-progress log entry
    const entry = taskEvents.logEvent('task-created', {
      title: task.title,
      id: task._id || task.id,
      priority: task.priority,
      user: task.user || 'guest'
    }, 'processing', 0);

    // Decoupled asynchronous background processing (2-second simulation)
    setTimeout(() => {
      try {
        const completedAt = Date.now();
        const duration = completedAt - startedAt;
        const assignedUser = task.user || 'guest';
        
        console.log(
          `[Event-Driven Async Worker] Notification delivered for "${task.title}"; ` +
          `assigned to: ${assignedUser}; duration: ${duration}ms; completed at ${new Date(completedAt).toISOString()}`
        );

        // Update logged entry status
        entry.status = 'completed';
        entry.durationMs = duration;
      } catch (error) {
        taskEvents.emit('error', error);
      }
    }, 2000);
  });

  // Listen for task update
  taskEvents.on('task-updated', (task) => {
    console.log(`[Event-Driven Async Worker] Task updated: "${task.title}" (ID: ${task._id || task.id})`);
    taskEvents.logEvent('task-updated', {
      title: task.title,
      id: task._id || task.id,
      completed: task.completed,
      priority: task.priority
    }, 'completed', 5);
  });

  // Listen for task deletion (Practical 10 Requirement)
  taskEvents.on('task-deleted', (task) => {
    console.log(`[Event-Driven Async Worker] Task deleted: "${task.title}" at ${new Date().toISOString()}`);
    taskEvents.logEvent('task-deleted', {
      title: task.title,
      id: task._id || task.id
    }, 'completed', 4);
  });

  // Listen for user registration (Practical 7 Event Hook)
  taskEvents.on('user-registered', (user) => {
    console.log(`[Event-Driven Async Worker] User registered: "${user.name}" (${user.email})`);
    taskEvents.logEvent('user-registered', {
      name: user.name,
      email: user.email,
      id: user._id || user.id
    }, 'completed', 10);
  });

  // Listen for cache invalidation (Practical 9 Event Hook)
  taskEvents.on('cache-invalidated', (meta) => {
    taskEvents.logEvent('cache-invalidated', meta, 'completed', 1);
  });

  // Listen for error
  taskEvents.on('error', (error) => {
    console.error(`[Event-Driven Notification Error] ${error.message}`);
    taskEvents.logEvent('error', { error: error.message }, 'failed', 0);
  });
};

registerListeners();

module.exports = registerListeners;

