var Task = require('./../core/task');
var taskCreator = require('./../factory/task.creator');
var common = require('./../common');
var $ = require('./../common').$;

var taskManager = {
  clearTaskDescription: clearTaskDescription,
  showTasks: showTasks
};

module.exports = taskManager;

function clearTaskDescription (taskDescription) {
  if (arguments.length == 1) {
    for (var elements in taskDescription) {
      if (taskDescription.hasOwnProperty(elements)) {
        taskDescription[elements].textContent = '';
        taskDescription[elements].classList.remove('task-priority-grey');
        taskDescription[elements].classList.remove('task-priority-red');
      }
    }
    return taskDescription;
  }
  else {
    var task = Task();
    for (var element in task.taskDescription) {
      if (task.taskDescription.hasOwnProperty(element)) {
        task.taskDescription[element].textContent = '';
      }
    }
    task.taskDescription.icon.classList.remove('task-priority-grey');
    task.taskDescription.icon.classList.remove('task-priority-red');
  }
}

function showTasks() {
  var taskCompletedContainer = $('.tasks-completed');
  var taskNotCompletedContainer = $('.tasks-not-completed');
  var taskArray;
  var task;
  if (localStorage.length > 0) {
    for (var i = 0; i < localStorage.length; i++) {
      var key = localStorage.key(i);
      if (key == 'notcompleted') {
        taskArray = common.currentTasks(key);
        for (var j = 0; j < taskArray.length; j++) {
          if (taskArray[j].taskCompleted == false) {
            task = Task(taskArray[j]);
            task = taskCreator.createTask(task);
          }
        }
      }
      else if (key == 'completed') {
        taskArray = common.currentTasks(key);
        for (var k = 0; k < taskArray.length; k++) {
          task = Task(taskArray[k]);
          task = taskCreator.createTask(task);
          task.newTask.style.display = 'none';
          var completedTaskBody = task.newTask.cloneNode(true);
          taskNotCompletedContainer.removeChild(task.newTask);
          completedTaskBody.style.display = 'block';
          completedTaskBody.classList.add('task-checked');
          completedTaskBody.classList.add('task-terminated');
          taskCompletedContainer.appendChild(completedTaskBody);
        }
      }
    }
  }
}