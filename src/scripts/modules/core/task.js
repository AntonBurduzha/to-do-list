var $ = require('./../common').$;

var task = function (params) {
  var Task = function (params) {
    var param = params || {};
    this.newTask = param.newTask || null;
    this.taskPriority = param.taskPriority || null;
    this.specificPriority = param.specificPriority || 'normal';
    this.taskCheck = param.taskCheck || null;
    this.taskText = param.taskText || null;
    this.specificText = param.specificText || '';
    this.taskTags = param.taskTags || [];
    this.taskTagText = param.taskTagText || [];
    this.specificDate = param.specificDate || null;
    this.taskDate = param.taskDate || null;
    this.taskCompleted = param.taskCompleted || false;
    this.subtasks = param.subtasks || [];
    this.taskDescription = param.taskDescription || {
      icon: $('.task-description-color'),
      name: $('.task-description-text'),
      completed: $('.task-description-state'),
      priority: $('.task-description-priority'),
      tags: $('.task-description-tags'),
      date: $('.task-description-date')
    };
  }

  Task.prototype.createTaskDescription = function() {
    var taskDescription = this.taskDescription;
    taskDescription.icon = $('.task-description-color');
    taskDescription.name = $('.task-description-text');
    taskDescription.completed = $('.task-description-state');
    taskDescription.priority = $('.task-description-priority');
    taskDescription.tags = $('.task-description-tags');
    taskDescription.date = $('.task-description-date');
    return taskDescription;
  };

  return new Task(params);
};

module.exports = task;
