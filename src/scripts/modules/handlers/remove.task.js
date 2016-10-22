var $ = require('./../common').$;
var common = require('./../common');
var taskManager = require('./../services/task.service');

var removeTask = {
  createRemoveTaskHandler: createRemoveTaskHandler
};

module.exports = removeTask;

function createRemoveTaskHandler() {
  var btnRemove = $('.btn-remove');

  btnRemove.addEventListener('click', removeTask);

  function removeTask() {
    var taskNotCompletedNode = document.querySelectorAll('.new-task');
    var taskCompletedNode = document.querySelectorAll('.task-terminated');
    var subtaskNotCompletedNode = document.querySelectorAll('.new-subtask');
    var onlyNotCompletedTasksNode = taskNotCompletedNode.length - subtaskNotCompletedNode.length - taskCompletedNode.length;

    var taskNotCompletedArray = common.currentTasks('notcompleted');

    for (var i = 0; i < onlyNotCompletedTasksNode; i++) {
      if (taskNotCompletedNode[i].childNodes[1].checked || taskNotCompletedNode[i].classList.contains('task-checked')) {
        taskNotCompletedNode[i].parentNode.removeChild(taskNotCompletedNode[i]);
        taskManager.clearTaskDescription();
        taskNotCompletedArray.splice(i, 1);
        localStorage.setItem('notcompleted', JSON.stringify(taskNotCompletedArray));
      }
    }
  }
}