module.exports = function Task(params) {
  params = params || {};
  this.newTask = params.newTask || null;
  this.taskPriority = params.taskPriority || null;
  this.specificPriority = params.specificPriority || 'normal';
  this.taskCheck = params.taskCheck || null;
  this.taskText = params.taskText || null;
  this.specificText = params.specificText || '';
  this.taskTags = params.taskTags || [];
  this.taskTagText = params.taskTagText || [];
  this.specificDate = params.specificDate || null;
  this.taskDate = params.taskDate || null;
  this.taskCompleted = params.taskCompleted || false;
  this.subtasks = params.subtasks || []; //массив для подзадач
  this.taskDescription = params.taskDescription || {
      icon: $('.task-description-color'),
      name: $('.task-description-text'),
      completed: $('.task-description-state'),
      priority: $('.task-description-priority'),
      tags: $('.task-description-tags'),
      date: $('.task-description-date')
    };
};