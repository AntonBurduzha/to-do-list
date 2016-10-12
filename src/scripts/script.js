'use strict'

//localStorage.clear();

function Task(params) {
    params = params || {};
    this.newTask = params.newTask || null;
    this.taskPriority = params.taskPriority || null;
    this.specificPriority = params.specificPriority || 'normal';
    this.taskCheck = params.taskCheck || null;
    this.taskText = params.taskText || null;
    this.specificText = params.specificText || '';
    this.specificDate = params.specificDate || null;
    this.taskDate = params.taskDate || null;
    this.taskCompleted = params.taskCompleted || false;
    this.subtasks = params.subtasks || []; //массив для подзадач
    this.taskDescription = params.taskDescription || {
            name: document.querySelector('.task-description-text'),
            completed: document.querySelector('.task-description-state'),
            priority: document.querySelector('.task-description-priority'),
            date: document.querySelector('.task-description-date')
        }
}

function Subtask(params){
    params = params || {};
    this.newSubtask = params.newSubtask || null;
    this.subtaskPriority = params.subtaskPriority || null;
    this.specificPriority = params.specificPriority || 'normal';
    this.subtaskText = params.subtaskText || null;
    this.specificText = params.specificText || '';
}

var taskMap = []; //хранит задачи

var completedTasks = [];
var notCompletedTasks = [];

showTasks();
createEventListeners();

function createEventListeners() {
    var mainWindow = document.querySelector('.main');
    mainWindow.style.height = document.documentElement.clientHeight + 'px';

    var addTaskInput = document.querySelector('.input-add-task');
    var addTaskBtn = document.querySelector('.btn-add-task');
    var addSubtaskInput = document.querySelector('.input-add-subtask');
    var addSubtaskBtn = document.querySelector('.btn-add-subtask');
    var btnTaskComplete = document.querySelector('.btn-complete');

    addTaskBtn.addEventListener('click', addTask);
    //addSubtaskBtn.addEventListener('click', addSubTask);
    //btnTaskComplete.addEventListener('click', completeTask);

    function addTask(event) {
        if(addTaskInput.value.length > 0){
            var task = new Task(); //блок создающий задачу
            task.specificText = addTaskInput.value;
            task = createTask(task);
            addTaskInput.value = '';
            task.taskDescription = clearTaskDescription(task.taskDescription);

            var tasksArray = currentTasks('notcompleted');
            tasksArray.push(task);
            localStorage.setItem('notcompleted', JSON.stringify(tasksArray));
        }
        event.preventDefault();
    }

    /*function addSubTask(event) {
        var checkCounter = 0;
        for(var i = 0; i < taskMap.length; i++){
            if(taskMap[i].taskCheck.checked){
                checkCounter++;
            }
        }
        for(var i = 0; i < taskMap.length; i++){
            if(addSubtaskInput.value.length > 0 && (checkCounter == 1 && taskMap[i].taskCheck.checked)){
                var subtask = new Subtask(); //блок создающий подзадачу
                subtask.specificText = addSubtaskInput.value;
                var currentSubtask = createSubtask(subtask);
                addSubtaskInput.value = '';
                taskMap[i].subtasks.push(currentSubtask);
                localStorage.setItem('Idsubtask' + (i + 1) + taskMap[i].subtasks.length, JSON.stringify(currentSubtask));
            }
        }
        event.preventDefault();
    }*/

    /*function completeTask() {
        var taskCompletedContainer = document.querySelector('.tasks-completed');

        for(var i = 0; i < taskMap.length; i++){
            if(taskMap[i].taskCheck.checked){
                taskMap[i].taskCompleted = true;
                completedTasks.push(taskMap[i]);
                localStorage.setItem('completed', JSON.stringify(completedTasks));
                notCompletedTasks = JSON.parse(localStorage.getItem('notcompleted'));
                notCompletedTasks[i].taskCompleted = true;
                localStorage.setItem('notcompleted', JSON.stringify(notCompletedTasks));
                taskMap[i].newTask.style.display = 'none';
                var completedTaskBody = taskMap[i].newTask.cloneNode(true);
                completedTaskBody.style.display = 'block';
                taskCompletedContainer.appendChild(completedTaskBody);
            }
        }

        event.preventDefault();
    }*/
}

/*function checkTask(event) {
    var target = event.target;
    var targetParent = target.parentNode;
    targetParent.classList.toggle('task-checked');
    targetParent.childNodes[2].classList.toggle('task-text-checked');
    showSubtasks();
}*/

function createTask(task) { //описывает обьект task
    var addTaskForm = document.querySelector('.form-add-task');

    task.newTask = document.createElement('div');
    task.newTask.classList.add('new-task');
    addTaskForm.parentNode.appendChild(task.newTask);
    task.newTask.addEventListener('click', showTaskDescription);

    task.taskPriority = document.createElement('div');
    task.taskPriority.classList.add('task-priority-grey');

    task.taskCheck = document.createElement('input');
    task.taskCheck.setAttribute('type', 'checkbox');
    task.taskCheck.classList.add('task-checkbox');
    //task.taskCheck.addEventListener('click', checkTask);

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

function showTasks() { //загружает обьеты tasks из locale storage
    var taskCompletedContainer = document.querySelector('.tasks-completed');

    if (localStorage.length > 0){
        for(var i = 0; i < localStorage.length; i++){
            var key = localStorage.key(i);
            if(key == 'notcompleted'){
                var taskArray = currentTasks(key);
                for(var j = 0; j < taskArray.length; j++){
                    if(taskArray[j].taskCompleted == false){
                        var task = new Task(taskArray[j]);
                        task = createTask(task);
                    }
                }
            }
            else if(key == 'completed'){
                var taskArray = currentTasks(key);
                for(var k = 0; k < taskArray.length; k++){
                    var task = new Task(taskArray[k]);
                    task = createTask(task);
                    task.newTask.style.display = 'none';
                    var completedTaskBody = task.newTask.cloneNode(true);
                    completedTaskBody.style.display = 'block';
                    taskCompletedContainer.appendChild(completedTaskBody);
                }
            }
        }
    }
}

function clearTaskDescription(taskDescription) {
    taskDescription.name.textContent = '';
    taskDescription.completed.textContent = '';
    taskDescription.priority.textContent = '';
    taskDescription.date.textContent = '';
    return taskDescription;
}

function createTaskDescription(taskDescription) {
    taskDescription.name = document.querySelector('.task-description-text');
    taskDescription.completed = document.querySelector('.task-description-state');
    taskDescription.priority = document.querySelector('.task-description-priority');
    taskDescription.date = document.querySelector('.task-description-date');
    return taskDescription;
}

function showTaskDescription(event) {
    var taskArray = currentTasks('notcompleted');

    for(var i = 0; i < taskArray.length; i++){
        if(event.target){
            taskArray[i].taskDescription = createTaskDescription(taskArray[i].taskDescription);
            taskArray[i].taskDescription.name.textContent = taskArray[i].specificText;
            taskArray[i].taskCompleted == false ? taskArray[i].taskDescription.completed.textContent = 'Статус: незавершен'
                : taskArray[i].taskDescription.completed.textContent = 'Статус: завершен';

            if(taskArray[i].specificPriority == 'normal'){
                taskArray[i].taskDescription.priority.textContent = 'Приоритет: нормальный';
                taskArray[i].taskDescription.priority.parentNode.firstElementChild.classList.add('task-priority-grey');
            }
            else {
                taskArray[i].taskDescription.priority.textContent = 'Приоритет: высокий';
                taskArray[i].taskDescription.priority.parentNode.firstElementChild.classList.add('task-priority-red');
            }
            var descriptionDate = Date.parse(taskArray[i].specificDate);
            taskArray[i].taskDescription.date.textContent = 'Дата выполнения: ' + (new Date (descriptionDate).toLocaleDateString('ru'));
            break;
        }
        else {
            if(taskArray[i].specificPriority == 'normal'){
                //taskArray[i].taskDescription.priority.parentNode.firstChild.classList.remove('task-priority-grey');
            }
            else {
                taskArray[i].taskDescription.priority.parentNode.firstElementChild.classList.remove('task-priority-red');
            }
            taskArray[i].taskDescription = clearTaskDescription(taskArray[i].taskDescription);
        }
    }
}

/*function createSubtask(subtask) { //описывает обьект подздачи
    var addSubtaskForm = document.querySelector('.form-add-subtask');
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

/*function showSubtasks() { //загружает обьеты subtasks из locale storage
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
                    var subtask = new Subtask(JSON.parse(localStorage.getItem(key))); //блок создающий задачу
                    var currentSubtask = createSubtask(subtask);
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
*/

function currentTasks(type) {
    var currentTasksArray = [];
    if(localStorage.length > 0){
        for(var i = 0; i < localStorage.length; i++){
            var key = localStorage.key(i);
            if(key == type){
                currentTasksArray = JSON.parse(localStorage.getItem(type));
                return currentTasksArray;
            }
        }
    }
    else{
        return currentTasksArray;
    }
}