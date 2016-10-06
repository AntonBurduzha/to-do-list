'use strict'

var addTaskForm = document.querySelector('.form-add-task');
var addTaskInput = document.querySelector('.input-add-task');
var addTaskBtn = document.querySelector('.btn-add-task');
var taskPriority;
var taskCheck;
var taskText;
var newTask;
var taskDate;

addTaskInput.addEventListener('focus', function () {
    addTaskBtn.style.display = 'inline-block';
});
addTaskInput.addEventListener('blur', function () {
    addTaskInput.value.length > 0 ? addTaskBtn.style.display = 'inline-block' : addTaskBtn.style.display = 'none';
});
addTaskBtn.addEventListener('click', function (event) {
    event.preventDefault();
    newTask = document.createElement('div');
    newTask.classList.add('new-task');
    addTaskForm.parentNode.appendChild(newTask);

    taskPriority = document.createElement('div');
    taskPriority.classList.add('task-priority-red');// в зависимости от приоритета задается класс

    taskCheck = document.createElement('input');
    taskCheck.setAttribute('type', 'checkbox');
    taskCheck.classList.add('task-checkbox');
    taskCheck.addEventListener('click', checkTask);

    taskText = document.createElement('p');
    taskText.textContent = addTaskInput.value;
    taskText.classList.add('task-text');

    taskDate = document.createElement('p');
    taskDate.classList.add('task-date');
    var today = new Date();
    taskDate.textContent = today.toLocaleDateString('ru');

    newTask.appendChild(taskPriority);
    newTask.appendChild(taskCheck);
    newTask.appendChild(taskText);
    newTask.appendChild(taskDate);
});


function checkTask(event) {
    var target = event.target;
    var targetParent = target.parentNode;
    targetParent.classList.toggle('task-checked');
}





