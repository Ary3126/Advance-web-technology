const taskEvents = require('./events');

const registerTaskListeners = () => {
  taskEvents.on('task-created', (task) => {
    try {
      const startedAt = new Date().toISOString();
      console.log(`[Notification] Started for task "${task.title}" at ${startedAt}`);

      setTimeout(() => {
        try {
          const assignedUser = task.user || task.assignedUser || 'unassigned';
          console.log(
            `[Notification] Task "${task.title}" created at ${startedAt}; ` +
            `assigned user: ${assignedUser}; completed at ${new Date().toISOString()}`
          );
        } catch (error) {
          taskEvents.emit('error', error);
        }
      }, 2000);
    } catch (error) {
      taskEvents.emit('error', error);
    }
  });

  taskEvents.on('task-deleted', (task) => {
    console.log(
      `[Notification] Task "${task.title}" deleted at ${new Date().toISOString()}`
    );
  });

  taskEvents.on('error', (error) => {
    console.error(`[Notification Error] ${error.message}`);
  });
};

registerTaskListeners();

module.exports = registerTaskListeners;
