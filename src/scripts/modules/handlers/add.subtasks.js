var common = require('./../common');
var $ = require('./../common').$;
var Subtask = require('./../core/subtask');
var subtaskCreator = require('./../factory/subtask.creator');

var addSubtasks= {
  createAddSubtaskHandler: createAddSubtaskHandler
};

module.exports = addSubtasks;

function createAddSubtaskHandler() {
  var addSubtaskInput = $('.input-add-subtask');
  var addSubtaskBtn = $('.btn-add-subtask');

  addSubtaskBtn.addEventListener('click', addSubTask);

  function addSubTask(event) {
    var taskArray = common.currentTasks('notcompleted');
    var taskNodeArray = document.querySelectorAll('.new-task');
    for (var i = 0; i < taskNodeArray.length; i++) {
      if (addSubtaskInput.value.length > 0 && taskNodeArray[i].classList.contains('task-checked')) {
        var subtask = Subtask();
        subtask.specificText = addSubtaskInput.value;
        subtask = subtaskCreator.createSubtask(subtask);
        addSubtaskInput.value = '';
        taskArray[i].subtasks.push(subtask);
        localStorage.setItem('notcompleted', JSON.stringify(taskArray));
      }
    }
    event.preventDefault();
  }
}

