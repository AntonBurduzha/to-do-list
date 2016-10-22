var $ = require('./../common').$;
var common = require('./../common');

var setTaskDate = {
  createSetTaskDateHandler: createSetTaskDateHandler
};

module.exports = setTaskDate;

function createSetTaskDateHandler() {
  var btnSetTaskDate = $('.btn-add-date');
  var inputSetTaskDate = $('.input-add-date');

  btnSetTaskDate.addEventListener('click', setTaskDate);

  function setTaskDate() {
    var taskNotCompletedNode = document.querySelectorAll('.new-task');
    var taskCompletedNode = document.querySelectorAll('.task-terminated');
    var subtaskNotCompletedNode = document.querySelectorAll('.new-subtask');
    var onlyNotCompletedTasksNode = taskNotCompletedNode.length - subtaskNotCompletedNode.length - taskCompletedNode.length;

    var taskNotCompletedArray = common.currentTasks('notcompleted');
    var newUserDate = inputSetTaskDate.value;
    var trueDate;
    var regexDate = /(\d{2})-(\d{2})-(\d{4})/;
    if(regexDate.test(newUserDate)){
      trueDate = true;
    }
    else{
      inputSetTaskDate.value = 'Неверный формат ввода';
      return false;
    }
    var newDate = new Date(newUserDate.replace(regexDate, "$2/$1/$3"));
    for (var i = 0; i < onlyNotCompletedTasksNode; i++) {
      if ((taskNotCompletedNode[i].childNodes[1].checked || taskNotCompletedNode[i].classList.contains('task-checked'))
        && newUserDate.length > 0 && trueDate) {
        newUserDate = newDate.toLocaleDateString('ru');
        taskNotCompletedNode[i].lastChild.textContent = newUserDate;
        taskNotCompletedArray[i].specificDate = newDate;
        localStorage.setItem('notcompleted', JSON.stringify(taskNotCompletedArray));
        var taskDescriptionDate = $('.task-description-date');
        taskDescriptionDate.textContent = 'Срок: ' + newUserDate;
      }
    }
    inputSetTaskDate.value = '';
  }
}
