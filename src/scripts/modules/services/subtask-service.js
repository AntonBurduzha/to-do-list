var common = require('./../common');
var $ = require('./../common').$;
var Subtask = require('./../core/subtask');
var subtaskCreator = require('./../factory/subtask-creator');

var subtaskManager = {
  showSubtasks: showSubtasks,
  clearSubtaskDescription: clearSubtaskDescription
};

module.exports = subtaskManager;

function showSubtasks(event) {
  var taskArray = common.currentTasks('notcompleted');
  var taskNodeArray = document.querySelectorAll('.new-task');
  for (var i = 0; i < taskNodeArray.length; i++) {
    if (localStorage.length > 0 && event.newTask == taskNodeArray[i] && !taskNodeArray[i].classList.contains('task-terminated')) {
      for (var j = 0; j < taskArray[i].subtasks.length; j++) {
        var subtask = Subtask(taskArray[i].subtasks[j]);
        subtask = subtaskCreator.createSubtask(subtask);
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