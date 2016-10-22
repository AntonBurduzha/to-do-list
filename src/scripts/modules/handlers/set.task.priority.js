var $ = require('./../common').$;
var common = require('./../common');

var setTaskPriority = {
  createSetTaskPriorityHandler: createSetTaskPriorityHandler
};

module.exports = setTaskPriority;

function createSetTaskPriorityHandler() {
  var priorityMenuItems = document.querySelectorAll('.list-item-priority');
  for (var j = 0; j < priorityMenuItems.length; j++) {
    priorityMenuItems[j].addEventListener('click', setTaskPriority);
  }

  function setTaskPriority(event) {
    var taskNotCompletedNode = document.querySelectorAll('.new-task');
    var taskCompletedNode = document.querySelectorAll('.task-terminated');
    var subtaskNotCompletedNode = document.querySelectorAll('.new-subtask');
    var taskDescriptionNode = $('.task-description-priority');
    var taskDescriptionColor = $('.task-description-color');
    var taskDescriptionPriority = 'Приоритет: ';
    var taskNotCompletedArray = common.currentTasks('notcompleted');
    var onlyNotCompletedTasksNode = taskNotCompletedNode.length - subtaskNotCompletedNode.length - taskCompletedNode.length;
    var currentPriorityText = event.target.textContent;
    for (var i = 0; i < onlyNotCompletedTasksNode; i++) {
      if (taskNotCompletedNode[i].childNodes[1].checked || taskNotCompletedNode[i].classList.contains('task-checked')) {
        if (currentPriorityText === 'Высокий') {
          taskNotCompletedNode[i].childNodes[0].classList.remove('task-priority-grey');
          taskNotCompletedNode[i].childNodes[0].classList.add('task-priority-red');
          taskNotCompletedArray[i].specificPriority = 'high';
          taskDescriptionNode.textContent = taskDescriptionPriority + 'высокий';
          taskDescriptionColor.classList.remove('task-priority-grey');
          taskDescriptionColor.classList.add('task-priority-red');
        }
        else if (currentPriorityText === 'Нормальный') {
          taskNotCompletedNode[i].childNodes[0].classList.remove('task-priority-red');
          taskNotCompletedNode[i].childNodes[0].classList.add('task-priority-grey');
          taskNotCompletedArray[i].specificPriority = 'normal';
          taskDescriptionNode.textContent = taskDescriptionPriority + 'нормальный';
          taskDescriptionColor.classList.remove('task-priority-red');
          taskDescriptionColor.classList.add('task-priority-grey');
        }
        localStorage.setItem('notcompleted', JSON.stringify(taskNotCompletedArray));
      }
    }
  }
}