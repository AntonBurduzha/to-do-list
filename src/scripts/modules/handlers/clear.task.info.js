var $ = require('./../common').$;
var taskManager = require('./../services/task.service');
var subtaskManager = require('./../services/subtask.service');

var clearTaskInfo = {
  createClearTaskInfoHandler: createClearTaskInfoHandler
};

module.exports = clearTaskInfo;

function createClearTaskInfoHandler() {
  var tasksNavTab = $('.tasks-nav-tabs');
  var tasksCompleteTab = $('.tasks-complete-tab');
  var tasksNoCompleteTab = $('.tasks-nocomplete-tab');

  tasksNavTab.addEventListener('click', clearTaskInfo);

  function clearTaskInfo(event) {
    if (event.target == tasksCompleteTab || event.target.parentNode == tasksCompleteTab
      || event.target.parentNode == tasksNoCompleteTab || event.target == tasksNoCompleteTab) {
      taskManager.clearTaskDescription();
      subtaskManager.clearSubtaskDescription();
      var taskNodeNoCompleted = $('.task-checked');
      if (taskNodeNoCompleted !== null) {
        taskNodeNoCompleted.classList.remove('task-checked');
        taskNodeNoCompleted.childNodes[1].checked = false;
        taskNodeNoCompleted.childNodes[2].classList.remove('task-text-checked');
      }
    }
  }
}