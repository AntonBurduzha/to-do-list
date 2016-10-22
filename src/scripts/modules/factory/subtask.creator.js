var $ = require('./../common').$;

var subtaskCreator = {
  createSubtask: createSubtask
};

module.exports = subtaskCreator;

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
