var $ = require('./../common').$;

var searchTask = {
  createSearchTaskHandler: createSearchTaskHandler
};

module.exports = searchTask;

function createSearchTaskHandler() {
  var inputSearch = $('.input-search-task');
  var btnSearch = $('.btn-search');
  var notcompledTaskContainer = $('.tasks-not-completed');
  var searchFailMsg = document.createElement('p');
  searchFailMsg.textContent = 'Ничего не найдено';
  searchFailMsg.classList.add('text-search-fail');
  notcompledTaskContainer.appendChild(searchFailMsg);

  btnSearch.addEventListener('click', searchCurrentTasks);

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
    var displayTaskCounter = 0;
    for (var j = 0; j < taskCurrentNodeLength; j++) {
      var tasksBodyHidden = window.getComputedStyle(taskNodeArray[j], null).getPropertyValue('display');
      tasksBodyHidden === 'none' ? displayTaskCounter++ : displayTaskCounter = 0;
    }
    if (displayTaskCounter === taskCurrentNodeLength) {
      searchFailMsg.style.display = 'block';
    }
    event.preventDefault();
  }
}