'use strict'

var mainWindow = document.querySelector('.main');
mainWindow.style.height = document.documentElement.clientHeight + 'px';

var addTaskForm = document.querySelector('.form-add-task');
var addTaskInput = document.querySelector('.input-add-task');
var addTaskBtn = document.querySelector('.btn-add-task');

var addSubtaskForm = document.querySelector('.form-add-subtask');
var addSubtaskInput = document.querySelector('.input-add-subtask');
var addSubtaskBtn = document.querySelector('.btn-add-subtask');

//localStorage.clear();

function Task() {
    this.newTask = null;
    this.taskPriority = null;
    this.specificPriority = 'normal';
    this.taskCheck = null;
    this.taskText = null;
    this.specificText = '';
    this.specificDate = null;
    this.taskDate = null;
    this.taskCompleted = false;
    this.subtasks = []; //массив для подзадач
}

function Subtask(){
    this.newSubtask = null;
    this.subtaskPriority = null;
    this.specificPriority = 'normal';
    this.subtaskCheck = null;
    this.subtaskCompleted = false;
    this.subtaskText = null;
    this.specificText = '';
}

function TaskDescription() {
    this.name = document.querySelector('.task-description-text');
    this.completed = document.querySelector('.task-description-state');
    this.priority = document.querySelector('.task-description-priority');
    this.date = document.querySelector('.task-description-date');
}

var task; //обьект задачи
var subtask; //обьект подзадачи
var taskDescription; //обьект описания задачи

var taskMap = []; //хранит задачи
var taskDescriptionMap = []; //хранит описание задачи

ShowTasks(); //localstorage

addTaskBtn.addEventListener('click', function (event) {
    if(addTaskInput.value.length > 0){
        task = new Task(); //блок создающий задачу
        task.specificText = addTaskInput.value;
        var currentTask = CreateTask(task);
        addTaskInput.value = '';
        taskMap.push(currentTask);

        localStorage.setItem('Idtask' + taskMap.length, JSON.stringify(currentTask));

        taskDescription = new TaskDescription();//блок описывающий задачу
        taskDescription.name.textContent = '';
        taskDescription.completed.textContent = '';
        taskDescription.priority.textContent = '';
        //тэги
        taskDescription.date.textContent = '';
        taskDescriptionMap.push(taskDescription);
    }
    event.preventDefault();
});

addSubtaskBtn.addEventListener('click', function (event) {
    var checkCounter = 0;
    for(var i = 0; i < taskMap.length; i++){
        if(taskMap[i].taskCheck.checked){
            checkCounter++;
        }
    }
    for(var i = 0; i < taskMap.length; i++){
        if(addSubtaskInput.value.length > 0 && (checkCounter == 1 && taskMap[i].taskCheck.checked)){
            subtask = new Subtask(); //блок создающий подзадачу
            subtask.specificText = addSubtaskInput.value;
            var currentSubtask = CreateSubtask(subtask);
            addSubtaskInput.value = '';
            taskMap[i].subtasks.push(currentSubtask);
            localStorage.setItem('Idsubtask' + (i + 1) + taskMap[i].subtasks.length, JSON.stringify(currentSubtask));
        }
    }
    event.preventDefault();
});

function showTaskDescription(event) {
    for(var i = 0; i < taskMap.length; i++){
        if(event.target == taskMap[i].newTask || taskMap[i].taskCheck.checked){
            taskDescriptionMap[i].name.textContent = taskMap[i].taskText.textContent;

            taskMap[i].taskCompleted == false ? taskDescriptionMap[i].completed.textContent = 'Статус: незавершен'
                : taskDescriptionMap[i].completed.textContent = 'Статус: завершен';

            if(taskMap[i].specificPriority == 'normal'){
                taskDescriptionMap[i].priority.textContent = 'Приоритет: нормальный';
                taskDescriptionMap[i].priority.parentNode.firstElementChild.classList.add('task-priority-grey');
            }
            else {
                taskDescriptionMap[i].priority.textContent = 'Приоритет: высокий';
                taskDescriptionMap[i].priority.parentNode.firstChild.classList.add('task-priority-red');
            }
            //тэги
            taskDescriptionMap[i].date.textContent = 'Дата выполнения: ' + taskMap[i].specificDate.toLocaleDateString('ru');
            break;
        }
        else {
            if(taskMap[i].specificPriority == 'normal'){
                taskDescriptionMap[i].priority.parentNode.firstElementChild.classList.remove('task-priority-grey');
            }
            else {
                taskDescriptionMap[i].priority.parentNode.firstChild.classList.remove('task-priority-red');
            }
            taskDescriptionMap[i].name.textContent = '';
            taskDescriptionMap[i].completed.textContent = '';
            taskDescriptionMap[i].priority.textContent = '';
            taskDescriptionMap[i].date.textContent = '';
        }
    }
}

function checkTask(event) {
    var target = event.target;
    var targetParent = target.parentNode;
    targetParent.classList.toggle('task-checked');
    targetParent.childNodes[2].classList.toggle('task-text-checked');
    ShowSubtasks();
}

function CreateTask(task) { //описывает обьект task
    task.newTask = document.createElement('div');
    task.newTask.classList.add('new-task');
    addTaskForm.parentNode.appendChild(task.newTask);
    task.newTask.addEventListener('click', showTaskDescription);

    task.taskPriority = document.createElement('div');
    task.taskPriority.classList.add('task-priority-grey');

    task.taskCheck = document.createElement('input');
    task.taskCheck.setAttribute('type', 'checkbox');
    task.taskCheck.classList.add('task-checkbox');
    task.taskCheck.addEventListener('click', checkTask);

    task.taskText = document.createElement('p');
    task.taskText.textContent = task.specificText;
    task.taskText.classList.add('task-text');

    task.taskDate = document.createElement('p');
    task.taskDate.classList.add('task-date');//указать позже день в зависимости от даты
    var today = new Date();
    task.specificDate = today;

    task.newTask.appendChild(task.taskPriority);
    task.newTask.appendChild(task.taskCheck);
    task.newTask.appendChild(task.taskText);
    task.newTask.appendChild(task.taskDate);
    return task;
}

function ShowTasks() { //загружает обьеты tasks из locale storage
    if (localStorage.length > 0){
        for(var i = 0; i < localStorage.length; i++){
            var key = localStorage.key(i);
            if(key.indexOf('Idtask') == 0){
                task = new Task(); //блок создающий задачу
                task = JSON.parse(localStorage.getItem(key));
                var currentTask = CreateTask(task);
                taskMap.push(currentTask);

                taskDescription = new TaskDescription();
                taskDescriptionMap.push(taskDescription);
            }
        }
    }
}

function ShowSubtasks() { //загружает обьеты subtasks из locale storage
    var checkCounter = 0;
    for(var i = 0; i < taskMap.length; i++){
        if(taskMap[i].taskCheck.checked){
            checkCounter++;
        }
    }
    for(var i = 0; i < taskMap.length; i++){
        if(localStorage.length > 0 && (checkCounter == 1 && taskMap[i].taskCheck.checked)){
            for(var j = 0; j < localStorage.length; j++){
                var key = localStorage.key(j);
                if(key.indexOf('Idsubtask') == 0 && parseInt(key.charAt(9), 10) == (i + 1)){
                    subtask = new Subtask(); //блок создающий задачу
                    subtask = JSON.parse(localStorage.getItem(key));
                    var currentSubtask = CreateSubtask(subtask);
                    taskMap[i].subtasks.push(currentSubtask);
                }
            }
        }
        else{
            for(var k = 0; k < taskMap[i].subtasks.length; k++){
                taskMap[i].subtasks[k].newSubtask.classList.add('delete');
            }
            var deletedSubtasks = document.querySelectorAll('.delete');
            for(var k = 0; k < deletedSubtasks.length; k++){
                deletedSubtasks[k].remove();
            }
        }
    }
}

function CreateSubtask(subtask) { //описывает обьект подздачи
    subtask.newSubtask = document.createElement('div');
    subtask.newSubtask.classList.add('new-task');
    subtask.newSubtask.classList.add('new-subtask');
    addSubtaskForm.parentNode.appendChild(subtask.newSubtask);

    subtask.subtaskPriority = document.createElement('div');
    subtask.subtaskPriority.classList.add('task-priority-grey');

    subtask.subtaskCheck = document.createElement('input');
    subtask.subtaskCheck.setAttribute('type', 'checkbox');
    subtask.subtaskCheck.classList.add('task-checkbox');

    subtask.subtaskText = document.createElement('p');
    subtask.subtaskText.textContent = subtask.specificText;
    subtask.subtaskText.classList.add('task-text');

    subtask.newSubtask.appendChild(subtask.subtaskPriority);
    subtask.newSubtask.appendChild(subtask.subtaskCheck);
    subtask.newSubtask.appendChild(subtask.subtaskText);
    return subtask;
}
