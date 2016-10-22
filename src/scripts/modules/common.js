var common = {
  currentTasks: currentTasks,
  taskCheckedCounter: taskCheckedCounter,
  $: $,
  setAppHeigth: setAppHeigth,
  taskCompletedCheckedCounter: taskCompletedCheckedCounter
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

function taskCompletedCheckedCounter() {
  var taskCheckCounter = 0;
  var completedTaskNode = document.querySelectorAll('.task-terminated');
  for (var i = 0; i < completedTaskNode.length; i++) {
    if (completedTaskNode[i].childNodes[1].checked) {
      taskCheckCounter++;
    }
  }
  return taskCheckCounter;
}

function $(class_selector) {
  return document.querySelector(class_selector);
}

function setAppHeigth() {
  var mainWindow = $('.main');
  var searchPanel = $('.search');
  var tasksBody = parseInt(window.getComputedStyle($('.tasks'), null).getPropertyValue('padding-top'));
  var tasksContainer = $('.tasks-container');
  mainWindow.style.height = document.documentElement.clientHeight - searchPanel.offsetHeight + 'px';
  tasksContainer.style.height = document.documentElement.clientHeight - searchPanel.offsetHeight - tasksBody + 'px';
}