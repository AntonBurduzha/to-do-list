var taskManager = require('./task-manager');
var Task = require('./task');
var subtaskManager = require('./subtask-manager');
var Subtask = require('./subtask');
var common = require('./common');
var $ = require('./common').$;

var handler = {
  init: createEventListeners
};

module.exports = handler;

function createEventListeners() {
  var mainWindow = $('.main');
  var searchPanel = $('.search');
  var tasksBody = parseInt(window.getComputedStyle($('.tasks'), null).getPropertyValue('padding-top'));
  var tasksContainer = $('.tasks-container');
  mainWindow.style.height = document.documentElement.clientHeight - searchPanel.offsetHeight + 'px';
  tasksContainer.style.height = document.documentElement.clientHeight - searchPanel.offsetHeight - tasksBody + 'px';

  var addTaskInput = $('.input-add-task');
  var addTaskBtn = $('.btn-add-task');
  var addSubtaskInput = $('.input-add-subtask');
  var addSubtaskBtn = $('.btn-add-subtask');

  var inputSearch = $('.input-search-task');
  var btnSearch = $('.btn-search');
  var notcompledTaskContainer = $('.tasks-not-completed');
  var searchFailMsg = document.createElement('p');
  searchFailMsg.textContent = 'Ничего не найдено';
  searchFailMsg.classList.add('text-search-fail');
  notcompledTaskContainer.appendChild(searchFailMsg);

  var btnTaskComplete = $('.btn-complete');
  //var terminatedTasks = document.querySelectorAll('.task-terminated');


  var tasksNavTab = $('.tasks-nav-tabs');
  var tasksCompleteTab = $('.tasks-complete-tab');
  var tasksNoCompleteTab = $('.tasks-nocomplete-tab');

  var tagMenuItems = document.querySelectorAll('.list-item-tag');
  for (var i = 0; i < tagMenuItems.length; i++) {
    tagMenuItems[i].addEventListener('click', addTaskTags);
  }

  var btnRemove = $('.btn-remove');

  var priorityMenuItems = document.querySelectorAll('.list-item-priority');
  for (var j = 0; j < priorityMenuItems.length; j++) {
    priorityMenuItems[j].addEventListener('click', setTaskPriority);
  }


  var btnSetTaskDate = $('.btn-add-date');
  var inputSetTaskDate = $('.input-add-date');

  addTaskBtn.addEventListener('click', addTask);
  addSubtaskBtn.addEventListener('click', addSubTask);
  btnTaskComplete.addEventListener('click', completeTask);
  tasksNavTab.addEventListener('click', clearTaskInfo);
  btnSearch.addEventListener('click', searchCurrentTasks);
  btnRemove.addEventListener('click', removeTask);
  btnSetTaskDate.addEventListener('click', setTaskDate);

  function addTask(event) {
    if (addTaskInput.value.length > 0) {
      var task = Task();
      task.specificText = addTaskInput.value;
      task = taskManager.createTask(task);
      addTaskInput.value = '';
      task.taskDescription = taskManager.clearTaskDescription(task.taskDescription);

      var tasksArray = common.currentTasks('notcompleted');
      tasksArray.push(task);
      localStorage.setItem('notcompleted', JSON.stringify(tasksArray));
    }
    event.preventDefault();
  }

  function addSubTask(event) {
    var taskArray = common.currentTasks('notcompleted');
    var taskNodeArray = document.querySelectorAll('.new-task');
    for (var i = 0; i < taskNodeArray.length; i++) {
      if (addSubtaskInput.value.length > 0 && taskNodeArray[i].classList.contains('task-checked')) {
        var subtask = Subtask();
        subtask.specificText = addSubtaskInput.value;
        subtask = subtaskManager.createSubtask(subtask);
        addSubtaskInput.value = '';
        taskArray[i].subtasks.push(subtask);
        localStorage.setItem('notcompleted', JSON.stringify(taskArray));
      }
    }
    event.preventDefault();
  }

  function searchCurrentTasks(event) {
    var taskNodeArray = document.querySelectorAll('.new-task');
    var subtaskNodeArray = document.querySelectorAll('.new-subtask');
    var taskCompletedNodeArrray = document.querySelectorAll('.task-terminated');
    searchFailMsg.style.display = 'none';

    var taskCurrentNodeLength = taskNodeArray.length - subtaskNodeArray.length - taskCompletedNodeArrray.length;
    for (var i = 0; i < taskNodeArray.length; i++) {
      taskNodeArray[i].style.display = 'none';
      if (inputSearch.value.length > 0 && taskNodeArray[i].childNodes[2].textContent.indexOf(inputSearch.value) + 1) {
        taskNodeArray[i].style.display = 'block';
      }
      else if (inputSearch.value.length < 1) {
        taskNodeArray[i].style.display = 'block';
      }
    }
    var displayTaskCounter = 0; //show search fail message
    for (var j = 0; j < taskCurrentNodeLength; j++) {
      var tasksBodyHidden = window.getComputedStyle(taskNodeArray[j], null).getPropertyValue('display');
      tasksBodyHidden === 'none' ? displayTaskCounter++ : displayTaskCounter = 0;
    }
    if (displayTaskCounter === taskCurrentNodeLength) {
      searchFailMsg.style.display = 'block';
    }
    event.preventDefault();
  }

  function clearTaskInfo(event) {
    if (event.target == tasksCompleteTab || event.target.parentNode == tasksCompleteTab
      || event.target.parentNode == tasksNoCompleteTab || event.target == tasksNoCompleteTab) {
      taskManager.clearTaskDescription();
      subtaskManager.clearSubtaskDescription();
      var taskNodeNoCompleted = $('.task-checked');
      if (taskNodeNoCompleted !== null) {
        taskNodeNoCompleted.classList.remove('task-checked');
        taskNodeNoCompleted.childNodes[1].checked = false;
        taskNodeNoCompleted.childNodes[2].classList.remove('task-text-checked');
      }
    }
  }

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

  function addTaskTags(event) {
    var taskNotCompletedNode = document.querySelectorAll('.new-task');
    var taskCompletedNode = document.querySelectorAll('.task-terminated');
    var subtaskNotCompletedNode = document.querySelectorAll('.new-subtask');
    var taskNotCompletedArray = common.currentTasks('notcompleted');
    var taskCheckCounter = common.taskCheckedCounter();
    var onlyNotCompletedTasksNode = taskNotCompletedNode.length - subtaskNotCompletedNode.length - taskCompletedNode.length;
    var currentTagText = event.target.textContent;
    for (var i = 0; i < onlyNotCompletedTasksNode; i++) {
      var tagCounter = taskNotCompletedNode[i].getElementsByTagName('span').length;
      var tagTextCollection = taskNotCompletedNode[i].getElementsByTagName('span');
      for (var j = 0; j < tagTextCollection.length; j++) {
        if (tagTextCollection[j].textContent === currentTagText && taskNotCompletedNode[i].childNodes[1].checked) {
          return false;
        }
      }
      if (taskNotCompletedNode[i].childNodes[1].checked && taskCheckCounter == 1 && tagCounter < 3) {
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

  function removeTask() {
    var taskNotCompletedNode = document.querySelectorAll('.new-task');
    var taskCompletedNode = document.querySelectorAll('.task-terminated');
    var subtaskNotCompletedNode = document.querySelectorAll('.new-subtask');
    var onlyNotCompletedTasksNode = taskNotCompletedNode.length - subtaskNotCompletedNode.length - taskCompletedNode.length;

    var taskNotCompletedArray = common.currentTasks('notcompleted');
    var taskCheckCounter = common.taskCheckedCounter();

    for (var i = 0; i < onlyNotCompletedTasksNode; i++) {
      if (taskNotCompletedNode[i].childNodes[1].checked && taskCheckCounter == 1) {
        taskNotCompletedNode[i].parentNode.removeChild(taskNotCompletedNode[i]);
        taskNotCompletedArray.splice(i, 1);
        localStorage.setItem('notcompleted', JSON.stringify(taskNotCompletedArray));
      }
    }
  }

  function setTaskPriority(event) {
    var taskNotCompletedNode = document.querySelectorAll('.new-task');
    var taskCompletedNode = document.querySelectorAll('.task-terminated');
    var subtaskNotCompletedNode = document.querySelectorAll('.new-subtask');
    var taskDescriptionNode = $('.task-description-priority');
    var taskDescriptionColor = $('.task-description-color');
    var taskDescriptionPriority = 'Приоритет: ';

    var taskNotCompletedArray = common.currentTasks('notcompleted');
    var taskCheckCounter = common.taskCheckedCounter();
    var onlyNotCompletedTasksNode = taskNotCompletedNode.length - subtaskNotCompletedNode.length - taskCompletedNode.length;
    var currentPriorityText = event.target.textContent;
    for (var i = 0; i < onlyNotCompletedTasksNode; i++) {
      if (taskNotCompletedNode[i].childNodes[1].checked && taskCheckCounter == 1) {
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

  function setTaskDate() {
    var taskNotCompletedNode = document.querySelectorAll('.new-task');
    var taskCompletedNode = document.querySelectorAll('.task-terminated');
    var subtaskNotCompletedNode = document.querySelectorAll('.new-subtask');
    var onlyNotCompletedTasksNode = taskNotCompletedNode.length - subtaskNotCompletedNode.length - taskCompletedNode.length;

    var taskNotCompletedArray = common.currentTasks('notcompleted');
    var taskCheckCounter = common.taskCheckedCounter();
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

    for (var i = 0; i < onlyNotCompletedTasksNode; i++) {
      if (taskNotCompletedNode[i].childNodes[1].checked && taskCheckCounter == 1 && newUserDate.length > 0 && trueDate) {
        var newDate = new Date(newUserDate.replace(regexDate, "$2/$1/$3"));
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
