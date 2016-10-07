'use strict'

var addTaskForm = document.querySelector('.form-add-task');
var addTaskInput = document.querySelector('.input-add-task');
var addTaskBtn = document.querySelector('.btn-add-task');

var task = {
    newTask: null,
    taskPriority: null,
    taskCheck: null,
    taskText: null,
    taskDate: null
};
var taskPriority;
var taskCheck;
var taskText;
var newTask;
var taskDate;

addTaskBtn.addEventListener('click', function (event) {
    if(addTaskInput.value.length > 0){
        event.preventDefault();
        task.newTask = document.createElement('div');
        task.newTask.classList.add('new-task');
        addTaskForm.parentNode.appendChild(task.newTask);

        task.taskPriority = document.createElement('div');
        task.taskPriority.classList.add('task-priority-grey');

        task.taskCheck = document.createElement('input');
        task.taskCheck.setAttribute('type', 'checkbox');
        task.taskCheck.classList.add('task-checkbox');
        task.taskCheck.addEventListener('click', checkTask);

        task.taskText = document.createElement('p');
        task.taskText.textContent = addTaskInput.value;
        task.taskText.classList.add('task-text');

        task.taskDate = document.createElement('p');
        task.taskDate.classList.add('task-date');
        var today = new Date();
        //taskDate.textContent = today.toLocaleDateString('ru');

        task.newTask.appendChild(task.taskPriority);
        task.newTask.appendChild(task.taskCheck);
        task.newTask.appendChild(task.taskText);
        task.newTask.appendChild(task.taskDate);
        addTaskInput.value = '';
    }
});


function checkTask(event) {
    var target = event.target;
    var targetParent = target.parentNode;
    targetParent.classList.toggle('task-checked');
    targetParent.childNodes[2].classList.toggle('task-text-checked');
}





