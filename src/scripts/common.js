var common = {
  currentTasks: currentTasks,
  taskCheckedCounter: taskCheckedCounter,
  $: $
};

module.exports = common;

function currentTasks(type) {
  return localStorage.length > 0 ? JSON.parse(localStorage.getItem(type)) : [];
}

function taskCheckedCounter() {
  var taskCheckCounter = 0;
  var taskNodeArray = document.querySelectorAll('.new-task');
  var subtaskNodeArray = document.querySelectorAll('.new-subtask');
  for (var i = 0; i < taskNodeArray.length - subtaskNodeArray.length; i++) {
    if (taskNodeArray[i].childNodes[1].checked) {
      taskCheckCounter++;
    }
  }
  return taskCheckCounter;
}

function $(class_selector) {
  return document.querySelector(class_selector);
}