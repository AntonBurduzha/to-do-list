var common = require('./../common');

var addTaskTag = {
  createAddTaskTagHandler: createAddTaskTagHandler
};

module.exports = addTaskTag;

function createAddTaskTagHandler() {
  var tagMenuItems = document.querySelectorAll('.list-item-tag');
  for (var i = 0; i < tagMenuItems.length; i++) {
    tagMenuItems[i].addEventListener('click', addTaskTags);
  }

  function addTaskTags(event) {
    var taskNotCompletedNode = document.querySelectorAll('.new-task');
    var taskCompletedNode = document.querySelectorAll('.task-terminated');
    var subtaskNotCompletedNode = document.querySelectorAll('.new-subtask');
    var taskNotCompletedArray = common.currentTasks('notcompleted');
    var onlyNotCompletedTasksNode = taskNotCompletedNode.length - subtaskNotCompletedNode.length - taskCompletedNode.length;
    var currentTagText = event.target.textContent;
    for (var i = 0; i < onlyNotCompletedTasksNode; i++) {
      var tagTextCollection = taskNotCompletedNode[i].getElementsByTagName('span');
      for (var j = 0; j < tagTextCollection.length; j++) {
        if (tagTextCollection[j].textContent === currentTagText &&
          (taskNotCompletedNode[i].childNodes[1].checked || taskNotCompletedNode[i].classList.contains('task-checked'))) {
          return false;
        }
      }
      if (taskNotCompletedNode[i].childNodes[1].checked || taskNotCompletedNode[i].classList.contains('task-checked')) {
        var taskTag = document.createElement('span');
        taskTag.classList.add('task-tag');
        taskTag.textContent = currentTagText;
        taskNotCompletedNode[i].insertBefore(taskTag, taskNotCompletedNode[i].childNodes[3]);
        taskNotCompletedArray[i].taskTags.push(taskTag);
        taskNotCompletedArray[i].taskTagText.push(currentTagText);
        localStorage.setItem('notcompleted', JSON.stringify(taskNotCompletedArray));
      }
    }
  }
}
