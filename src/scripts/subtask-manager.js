var common = require('./common');
var $ = require('./common').$;
var Subtask = require('./subtask');

var subtaskManager = {
  createSubtask: createSubtask,
  showSubtasks: showSubtasks,
  clearSubtaskDescription: clearSubtaskDescription
};

module.exports = subtaskManager;

function createSubtask(subtask) {
  var addSubtaskForm = $('.form-add-subtask');
  subtask.newSubtask = document.createElement('div');
  subtask.newSubtask.classList.add('new-task');
  subtask.newSubtask.classList.add('new-subtask');
  addSubtaskForm.parentNode.appendChild(subtask.newSubtask);

  subtask.subtaskPriority = document.createElement('div');
  subtask.subtaskPriority.classList.add('task-priority-grey');

  subtask.subtaskText = document.createElement('p');
  subtask.subtaskText.textContent = subtask.specificText;
  subtask.subtaskText.classList.add('task-text');

  subtask.newSubtask.appendChild(subtask.subtaskPriority);
  subtask.newSubtask.appendChild(subtask.subtaskText);
  return subtask;
}

function showSubtasks(event) {
  var taskArray = common.currentTasks('notcompleted');
  var taskNodeArray = document.querySelectorAll('.new-task');
  for (var i = 0; i < taskNodeArray.length; i++) {
    if (localStorage.length > 0 && event.newTask == taskNodeArray[i] && !taskNodeArray[i].classList.contains('task-terminated')) {
      for (var j = 0; j < taskArray[i].subtasks.length; j++) {
        var subtask = Subtask(taskArray[i].subtasks[j]);
        subtask = createSubtask(subtask);
      }
    }
  }
}

function clearSubtaskDescription() {
  var subtasksNotCompleteContainer = $('.subtasks-not-completed');
  var allNodeSubtasks = document.querySelectorAll('.new-subtask');
  for (var i = 0; i < allNodeSubtasks.length; i++) {
    subtasksNotCompleteContainer.removeChild(allNodeSubtasks[i]);
  }
}