var $ = require('./../common').$;
var common = require('./../common');
var taskManager = require('./../managers/task-manager');

var completeTask = {
  createCompleteTaskHandler: createCompleteTaskHandler
};

module.exports = completeTask;

function createCompleteTaskHandler() {
  var btnTaskComplete = $('.btn-complete');

  btnTaskComplete.addEventListener('click', completeTask);

  function completeTask() {
    var taskCompletedContainer = $('.tasks-completed');
    var taskNotCompletedContainer = $('.tasks-not-completed');
    var subtaskNotCompletedContainer = $('.subtasks-not-completed');
    var taskNotCompletedNodeArray = document.querySelectorAll('.new-task');
    var subtaskNotCompletedNodeArray = document.querySelectorAll('.new-subtask');

    var taskNotCompletedArray = common.currentTasks('notcompleted');
    var taskCompletedArray = common.currentTasks('completed');
    if (taskCompletedArray === null) taskCompletedArray = [];
    var taskCheckCounter = common.taskCheckedCounter();
    var newCompletedTask;
    for (var i = 0; i < taskNotCompletedNodeArray.length - subtaskNotCompletedNodeArray.length; i++) {
      if (taskNotCompletedNodeArray[i].childNodes[1].checked && taskCheckCounter == 1) {
        taskNotCompletedNodeArray[i].style.display = 'none';
        newCompletedTask = taskNotCompletedNodeArray[i].cloneNode(true);
        taskNotCompletedContainer.removeChild(taskNotCompletedNodeArray[i]);
        newCompletedTask.style.display = 'block';
        newCompletedTask.classList.add('task-terminated');
        newCompletedTask.childNodes[1].checked = false;
        newCompletedTask.childNodes[2].classList.remove('task-text-checked');
        taskCompletedContainer.appendChild(newCompletedTask);
        taskNotCompletedArray[i].taskCompleted = true;
        taskCompletedArray.push(taskNotCompletedArray[i]);
        localStorage.setItem('completed', JSON.stringify(taskCompletedArray));

        taskNotCompletedArray.splice(i, 1);
        localStorage.setItem('notcompleted', JSON.stringify(taskNotCompletedArray));
        for (var j = 0; j < subtaskNotCompletedNodeArray.length; j++) {
          subtaskNotCompletedContainer.removeChild(subtaskNotCompletedNodeArray[j]);
        }
        taskManager.clearTaskDescription();
      }
    }

    event.preventDefault();
  }
}
