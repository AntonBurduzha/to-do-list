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
            icon: $('.task-description-color'),
            name: $('.task-description-text'),
            completed: $('.task-description-state'),
            priority: $('.task-description-priority'),
            date: $('.task-description-date')
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

showTasks();
createEventListeners();

function createEventListeners() {
    var mainWindow = $('.main');
    mainWindow.style.height = document.documentElement.clientHeight + 'px';

    var addTaskInput = $('.input-add-task');
    var addTaskBtn = $('.btn-add-task');
    var addSubtaskInput = $('.input-add-subtask');
    var addSubtaskBtn = $('.btn-add-subtask');
    var btnTaskComplete = $('.btn-complete');

    addTaskBtn.addEventListener('click', addTask);
    //addSubtaskBtn.addEventListener('click', addSubTask);
    //btnTaskComplete.addEventListener('click', completeTask);
    document.body.addEventListener('click', deleteTaskDescription);

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
        var taskCompletedContainer = $('.tasks-completed');

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
    var addTaskForm = $('.form-add-task');

    task.newTask = document.createElement('div');
    task.newTask.classList.add('new-task');
    addTaskForm.parentNode.appendChild(task.newTask);
    //task.newTask.addEventListener('click', showTaskDescription);

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

    applyShowDescription(task);
    function applyShowDescription(task) {
        var statusCompleted = 'Статус: завершен';
        var statusNotCompleted = 'Статус: незавершеy';
        var priorityHigh = 'Приоритет: высокий';
        var priorityNormal = 'Приоритет: нормальный';
        var date = 'Дата выполнения:';

        task.newTask.addEventListener('click', function() {
            task.taskDescription = createTaskDescription(task.taskDescription);
            task.taskDescription.name.textContent = task.specificText;
            task.taskCompleted == false ? task.taskDescription.completed.textContent = statusNotCompleted
                : task.taskDescription.completed.textContent = statusCompleted;

            if(task.specificPriority === 'normal'){
                task.taskDescription.priority.textContent = priorityNormal;
                task.taskDescription.icon.classList.add('task-priority-grey');
            }
            else {
                task.taskDescription.priority.textContent = priorityHigh;
                task.taskDescription.icon.classList.add('task-priority-red');
            }
            var descriptionDate = Date.parse(task.specificDate);
            task.taskDescription.date.textContent = date + (new Date (descriptionDate).toLocaleDateString('ru'));
        });
        return task;
    }

    return task;
}

function showTasks() { //загружает обьеты tasks из locale storage
    var taskCompletedContainer = $('.tasks-completed');

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
    for(var elements in taskDescription){
        taskDescription[elements].textContent = '';
    }
    return taskDescription;
}

function createTaskDescription(taskDescription) {
    taskDescription.icon = $('.task-description-color');
    taskDescription.name = $('.task-description-text');
    taskDescription.completed = $('.task-description-state');
    taskDescription.priority = $('.task-description-priority');
    taskDescription.date = $('.task-description-date');
    return taskDescription;
}

/*function createSubtask(subtask) { //описывает обьект подздачи
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
    return localStorage.length > 0 ? JSON.parse(localStorage.getItem(type)) : [];
}

function deleteTaskDescription(event) {
    var taskNodeArray = document.querySelectorAll('.new-task');
    var taskNodeDescription = $('.tasks-description').children;
    for(var i = 0; i < taskNodeArray.length; i++){
        if(!event.target.classList.contains('new-task')){
            taskNodeDescription[0].classList.remove('task-priority-grey');
            for(var j = 0; j < taskNodeDescription.length; j++){
                taskNodeDescription[j].textContent = '';
            }
            break;
        }
    }
}

function $(class_selector) {
    return document.querySelector(class_selector);
}