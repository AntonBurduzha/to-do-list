var $ = require('./../common').$;
var common = require('./../common');

var completedTaskInfo = {
  createCompletedTaskInfoHandler: createCompletedTaskInfoHandler
};

module.exports = completedTaskInfo;

function createCompletedTaskInfoHandler() {
  var completedTaskNode = document.querySelectorAll('.task-terminated');

  for(var j = 0; j < completedTaskNode.length; j++){
    completedTaskNode[j].addEventListener('click', showCompletedTaskInfo);
  }

  function showCompletedTaskInfo(event) {
    var icon = $('.task-description-color');
    var name = $('.task-description-text');
    var completed = $('.task-description-state');
    var priority = $('.task-description-priority');
    var tags = $('.task-description-tags');
    var date = $('.task-description-date');
    var completedTask = common.currentTasks('completed');
    for(var i = 0; i < completedTaskNode.length; i++) {
      if (event.target === completedTaskNode[i] || event.target.parentNode === completedTaskNode[i]) {
        name.textContent = completedTask[i].specificText;
        completedTask[i].taskCompleted === false ? completed.textContent = 'Статус: незавершен'
          : completed.textContent = 'Статус: завершен';

        if (completedTask[i].specificPriority === 'normal') {
          priority.textContent = 'Приоритет: нормальный';
          icon.classList.remove('task-priority-red');
          icon.classList.add('task-priority-grey');
        }
        else {
          priority.textContent = 'Приоритет: высокий';
          icon.classList.remove('task-priority-grey');
          icon.classList.add('task-priority-red');
        }
        tags.textContent = 'Тэги: ' + completedTask[i].taskTagText.join(' ');
        date.textContent = 'Срок: ' + (new Date(Date.parse(completedTask[i].specificDate)).toLocaleDateString('ru'));
      }
    }
  }
}