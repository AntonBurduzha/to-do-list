var $ = require('./../common').$;
var common = require('./../common');
var subtaskManager = require('./../services/subtask.service');

var taskCreator = {
  createTask: createTask
};

module.exports = taskCreator;

function createTask(task) {
  var addTaskForm = $('.form-add-task');

  task.newTask = document.createElement('div');
  task.newTask.classList.add('new-task');
  addTaskForm.parentNode.appendChild(task.newTask);

  task.taskPriority = document.createElement('div');
  if (task.specificPriority == 'normal') {
    task.taskPriority.classList.add('task-priority-grey');
  }
  else {
    task.taskPriority.classList.add('task-priority-red');
  }

  task.taskCheck = document.createElement('input');
  task.taskCheck.setAttribute('type', 'checkbox');
  task.taskCheck.classList.add('task-checkbox');

  task.taskText = document.createElement('p');
  task.taskText.textContent = task.specificText;
  task.taskText.classList.add('task-text');

  task.taskDate = document.createElement('p');
  task.taskDate.classList.add('task-date');
  var today;
  if (task.specificDate !== null) {
    today = new Date(task.specificDate);
    task.specificDate = today;
  }
  else {
    today = new Date();
    task.specificDate = today;
  }
  task.taskDate.textContent = task.specificDate.toLocaleDateString('ru');

  task.newTask.appendChild(task.taskPriority);
  task.newTask.appendChild(task.taskCheck);
  task.newTask.appendChild(task.taskText);

  for (var i = 0; i < task.taskTags.length; i++) {
    task.taskTags[i] = document.createElement('span');
    task.taskTags[i].classList.add('task-tag');
    task.taskTags[i].textContent = task.taskTagText[i];
    task.newTask.appendChild(task.taskTags[i]);
  }

  task.newTask.appendChild(task.taskDate);

  (function applyShowDescription(task) {
    task.newTask.addEventListener('click', showTaskDescription);

    function showTaskDescription() {
      var statusCompleted = 'Статус: завершен';
      var statusNotCompleted = 'Статус: незавершен';
      var priorityHigh = 'Приоритет: высокий';
      var priorityNormal = 'Приоритет: нормальный';
      var tag = 'Тэги: ';
      var date = 'Срок: ';

      var taskNodeArray = document.querySelectorAll('.new-task');
      var subtaskNodeArray = document.querySelectorAll('.new-subtask');
      var taskCheckCounter = common.taskCheckedCounter();
      for (var i = 0; i < taskNodeArray.length - subtaskNodeArray.length; i++) {
        taskNodeArray[i].classList.remove('task-checked');
        if (taskNodeArray[i].childNodes[2].classList.contains('task-text-checked')) {
          taskNodeArray[i].childNodes[2].classList.remove('task-text-checked');
        }
      }
      if (!(taskCheckCounter > 1)) {
        task.newTask.classList.add('task-checked');
        task.newTask.childNodes[2].classList.add('task-text-checked');
        for (var k = 0; k < taskNodeArray.length; k++) {
          if (!task.newTask.classList.contains('.task-checked')) {
            for (var j = 0; j < subtaskNodeArray.length; j++) {
              subtaskNodeArray[j].remove();
            }
          }
        }
        task.taskDescription = task.createTaskDescription();
        task.taskDescription.name.textContent = task.specificText;
        task.taskCompleted == false ? task.taskDescription.completed.textContent = statusNotCompleted
          : task.taskDescription.completed.textContent = statusCompleted;

        if (task.specificPriority === 'normal') {
          task.taskDescription.priority.textContent = priorityNormal;
          task.taskDescription.icon.classList.remove('task-priority-red');
          task.taskDescription.icon.classList.add('task-priority-grey');
        }
        else {
          task.taskDescription.priority.textContent = priorityHigh;
          task.taskDescription.icon.classList.remove('task-priority-grey');
          task.taskDescription.icon.classList.add('task-priority-red');
        }

        var tagsDescriptionText = task.taskTagText.join(' ');
        task.taskDescription.tags.textContent = tag + tagsDescriptionText;

        task.taskDescription.date.textContent = date + (new Date(Date.parse(task.specificDate)).toLocaleDateString('ru'));
        subtaskManager.showSubtasks(task);
      }
    }
  })(task);

  return task;
}