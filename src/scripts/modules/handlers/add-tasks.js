var $ = require('./../common').$;
var common = require('./../common');
var Task = require('./../core/task');
var taskCreator = require('./../factory/task-creator');
var taskManager = require('./../services/task-service');

var addTasks = {
  createAddTaskHandler: createAddTaskHandler
};

module.exports = addTasks;

function createAddTaskHandler() {
  var addTaskBtn = $('.btn-add-task');
  var addTaskInput = $('.input-add-task');

  addTaskBtn.addEventListener('click', addTask);

  function addTask(event) {
    if (addTaskInput.value.length > 0) {
      var task = Task();
      task.specificText = addTaskInput.value;
      task = taskCreator.createTask(task);
      addTaskInput.value = '';
      task.taskDescription = taskManager.clearTaskDescription(task.taskDescription);

      var tasksArray = common.currentTasks('notcompleted');
      tasksArray.push(task);
      localStorage.setItem('notcompleted', JSON.stringify(tasksArray));
    }
    event.preventDefault();
  }
}
