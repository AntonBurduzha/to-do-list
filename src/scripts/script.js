'use strict';

//localStorage.clear();

function Task(params) {
    params = params || {};
    this.newTask = params.newTask || null;
    this.taskPriority = params.taskPriority || null;
    this.specificPriority = params.specificPriority || 'normal';
    this.taskCheck = params.taskCheck || null;
    this.taskText = params.taskText || null;
    this.specificText = params.specificText || '';
    this.taskTags = params.taskTags  || [];
    this.taskTagText = params.taskTagText || [];
    this.specificDate = params.specificDate || null;
    this.taskDate = params.taskDate || null;
    this.taskCompleted = params.taskCompleted || false;
    this.subtasks = params.subtasks || []; //массив для подзадач
    this.taskDescription = params.taskDescription || {
            icon: $('.task-description-color'),
            name: $('.task-description-text'),
            completed: $('.task-description-state'),
            priority: $('.task-description-priority'),
            tags: $('.task-description-tags'),
            date: $('.task-description-date')
        };
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
    for(var i = 0; i < tagMenuItems.length; i++){
        tagMenuItems[i].addEventListener('click', addTaskTags);
    }

    var btnRemove = $('.btn-remove');

    var priorityMenuItems = document.querySelectorAll('.list-item-priority');
    for(i = 0; i < priorityMenuItems.length; i++){
        priorityMenuItems[i].addEventListener('click', setTaskPriority);
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

    function searchCurrentTasks(event) {
        var taskNodeArray = document.querySelectorAll('.new-task');
        var subtaskNodeArray = document.querySelectorAll('.new-subtask');
        var taskCompletedNodeArrray = document.querySelectorAll('.task-terminated');
        searchFailMsg.style.display = 'none';

        var taskCurrentNodeLength = taskNodeArray.length - subtaskNodeArray.length - taskCompletedNodeArrray.length;
        for(i = 0; i < taskNodeArray.length; i++){
            taskNodeArray[i].style.display = 'none';
            if(inputSearch.value.length > 0 && taskNodeArray[i].childNodes[2].textContent.indexOf(inputSearch.value) + 1){
                taskNodeArray[i].style.display = 'block';
            }
            else if(inputSearch.value.length < 1){
                taskNodeArray[i].style.display = 'block';
            }
        }
        var displayTaskCounter = 0; //show search fail message
        for(var i = 0; i < taskCurrentNodeLength; i++){
            var tasksBodyHidden = window.getComputedStyle(taskNodeArray[i], null).getPropertyValue('display');
            tasksBodyHidden === 'none' ? displayTaskCounter++ : displayTaskCounter = 0;
        }
        if(displayTaskCounter === taskCurrentNodeLength){
            searchFailMsg.style.display = 'block';
        }
        event.preventDefault();
    }

    function clearTaskInfo(event) {
        if(event.target == tasksCompleteTab || event.target.parentNode == tasksCompleteTab
            || event.target.parentNode == tasksNoCompleteTab || event.target == tasksNoCompleteTab){
            clearTaskDescription();
            clearSubtaskDescription();
            var taskNodeNoCompleted = $('.task-checked');
            if(taskNodeNoCompleted !== null){
                taskNodeNoCompleted.classList.remove('task-checked');
                taskNodeNoCompleted.childNodes[2].classList.remove('task-text-checked');
            }
        }
    }

    function addTask(event) {
        if(addTaskInput.value.length > 0){
            var task = new Task();
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

    function addSubTask(event) {
        var taskArray = currentTasks('notcompleted');
        var taskNodeArray = document.querySelectorAll('.new-task');
        for(var i = 0; i < taskNodeArray.length; i++){
            if(addSubtaskInput.value.length > 0 && taskNodeArray[i].classList.contains('task-checked')){
                var subtask = new Subtask();
                subtask.specificText = addSubtaskInput.value;
                subtask = createSubtask(subtask);
                addSubtaskInput.value = '';
                taskArray[i].subtasks.push(subtask);
                localStorage.setItem('notcompleted', JSON.stringify(taskArray));
            }
        }
        event.preventDefault();
    }

    function completeTask() {
        var taskCompletedContainer = $('.tasks-completed');
        var taskNotCompletedContainer = $('.tasks-not-completed');
        var subtaskNotCompletedContainer = $('.subtasks-not-completed');
        var taskNotCompletedNodeArray = document.querySelectorAll('.new-task');
        var subtaskNotCompletedNodeArray = document.querySelectorAll('.new-subtask');

        var taskNotCompletedArray = currentTasks('notcompleted');
        var taskCompletedArray = currentTasks('completed');
        if(taskCompletedArray === null) taskCompletedArray = [];
        var taskCheckCounter = taskCheckedCounter();
        var newCompletedTask;
        for(var i = 0; i < taskNotCompletedNodeArray.length - subtaskNotCompletedNodeArray.length; i++){
            if(taskNotCompletedNodeArray[i].childNodes[1].checked && taskCheckCounter == 1){
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
                for(var j = 0; j < subtaskNotCompletedNodeArray.length; j++){
                    subtaskNotCompletedContainer.removeChild(subtaskNotCompletedNodeArray[j]);
                }
                clearTaskDescription();
            }
        }

        event.preventDefault();
    }

    function addTaskTags(event) {
        var taskNotCompletedNode = document.querySelectorAll('.new-task');
        var taskCompletedNode = document.querySelectorAll('.task-terminated');
        var subtaskNotCompletedNode = document.querySelectorAll('.new-subtask');
        var taskNotCompletedArray = currentTasks('notcompleted');
        var taskCheckCounter = taskCheckedCounter();
        var onlyNotCompletedTasksNode = taskNotCompletedNode.length - subtaskNotCompletedNode.length - taskCompletedNode.length;
        var currentTagText = event.target.textContent;
        for(var i = 0; i < onlyNotCompletedTasksNode; i++){
            var tagCounter = taskNotCompletedNode[i].getElementsByTagName('span').length;
            var tagTextCollection = taskNotCompletedNode[i].getElementsByTagName('span');
            for(var j = 0; j < tagTextCollection.length; j++){
                if(tagTextCollection[j].textContent == currentTagText){
                    return false;
                }
            }
            if(taskNotCompletedNode[i].childNodes[1].checked && taskCheckCounter == 1 && tagCounter < 3){
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

        var taskNotCompletedArray = currentTasks('notcompleted');
        var taskCheckCounter = taskCheckedCounter();

        for(var i = 0; i < onlyNotCompletedTasksNode; i++){
            if(taskNotCompletedNode[i].childNodes[1].checked && taskCheckCounter == 1){
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
        var taskDescriptionPriority = 'Приоритет: ';

        var taskNotCompletedArray = currentTasks('notcompleted');
        var taskCheckCounter = taskCheckedCounter();
        var onlyNotCompletedTasksNode = taskNotCompletedNode.length - subtaskNotCompletedNode.length - taskCompletedNode.length;
        var currentPriorityText = event.target.textContent;
        for(var i = 0; i < onlyNotCompletedTasksNode; i++){
            if(taskNotCompletedNode[i].childNodes[1].checked && taskCheckCounter == 1){
                if(currentPriorityText === 'Высокий'){
                    taskNotCompletedNode[i].childNodes[0].classList.remove('task-priority-grey');
                    taskNotCompletedNode[i].childNodes[0].classList.add('task-priority-red');
                    taskNotCompletedArray[i].specificPriority = 'high';
                    taskDescriptionNode.textContent = taskDescriptionPriority + 'высокий';
                }
                else if(currentPriorityText === 'Нормальный'){
                    taskNotCompletedNode[i].childNodes[0].classList.remove('task-priority-red');
                    taskNotCompletedNode[i].childNodes[0].classList.add('task-priority-grey');
                    taskNotCompletedArray[i].specificPriority = 'normal';
                    taskDescriptionNode.textContent = taskDescriptionPriority + 'нормальный';
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

        var taskNotCompletedArray = currentTasks('notcompleted');
        var taskCheckCounter = taskCheckedCounter();
        var newUserDate = inputSetTaskDate.value;
        var regexDate = /\d{2}\.\d{2}\.\d{4}/;
        var trueDate = regexDate.test(newUserDate);

        for(var i = 0; i < onlyNotCompletedTasksNode; i++){
            if(taskNotCompletedNode[i].childNodes[1].checked && taskCheckCounter == 1 && newUserDate.length > 0 && trueDate){
                var newDate = toDate(newUserDate);
                newUserDate = newDate.toLocaleDateString('ru');
                taskNotCompletedNode[i].lastChild.textContent = newUserDate;
                taskNotCompletedArray[i].specificDate = newDate;
                localStorage.setItem('notcompleted', JSON.stringify(taskNotCompletedArray));
            }
        }
        inputSetTaskDate.value = '';
    }
}

function createTask(task) {
    var addTaskForm = $('.form-add-task');

    task.newTask = document.createElement('div');
    task.newTask.classList.add('new-task');
    addTaskForm.parentNode.appendChild(task.newTask);

    task.taskPriority = document.createElement('div');
    if(task.specificPriority == 'normal'){
        task.taskPriority.classList.add('task-priority-grey');
    }
    else{
        task.taskPriority.classList.add('task-priority-red');
    }

    task.taskCheck = document.createElement('input');
    task.taskCheck.setAttribute('type', 'checkbox');
    task.taskCheck.classList.add('task-checkbox');

    task.taskText = document.createElement('p');
    task.taskText.textContent = task.specificText;
    task.taskText.classList.add('task-text');

    task.taskDate = document.createElement('p');
    task.taskDate.classList.add('task-date');
    var today;
    if(task.specificDate !== null){
        today = new Date(task.specificDate);
        task.specificDate = today;
    }
    else{
        today = new Date();
        task.specificDate = today;
    }
    task.taskDate.textContent = task.specificDate.toLocaleDateString('ru');

    task.newTask.appendChild(task.taskPriority);
    task.newTask.appendChild(task.taskCheck);
    task.newTask.appendChild(task.taskText);

    for(var i = 0; i < task.taskTags.length; i++){
        task.taskTags[i] = document.createElement('span');
        task.taskTags[i].classList.add('task-tag');
        task.taskTags[i].textContent = task.taskTagText[i];
        task.newTask.appendChild(task.taskTags[i]);
    }

    task.newTask.appendChild(task.taskDate);

    applyShowDescription(task);
    function applyShowDescription(task) {
        var statusCompleted = 'Статус: завершен';
        var statusNotCompleted = 'Статус: незавершен';
        var priorityHigh = 'Приоритет: высокий';
        var priorityNormal = 'Приоритет: нормальный';
        var tag = 'Тэги: ';
        var date = 'Срок: ';

        task.newTask.addEventListener('click', function() {
            var taskNodeArray = document.querySelectorAll('.new-task');
            var subtaskNodeArray = document.querySelectorAll('.new-subtask');
            var taskCheckCounter = taskCheckedCounter();
            for(var i = 0; i < taskNodeArray.length - subtaskNodeArray.length; i++){
                taskNodeArray[i].classList.remove('task-checked');
                if(taskNodeArray[i].childNodes[2].classList.contains('task-text-checked')){
                    taskNodeArray[i].childNodes[2].classList.remove('task-text-checked');
                }
            }
            if(!(taskCheckCounter > 1)){
                task.newTask.classList.add('task-checked');
                task.newTask.childNodes[2].classList.add('task-text-checked');
                for(i = 0; i < taskNodeArray.length; i++){
                    if(!task.newTask.classList.contains('.task-checked')){
                        for(var j = 0; j < subtaskNodeArray.length; j++){
                            subtaskNodeArray[j].remove();
                        }
                    }
                }
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

                var tagsDescriptionText = task.taskTagText.join(' ');
                task.taskDescription.tags.textContent = tag + tagsDescriptionText;

                var descriptionDate = Date.parse(task.specificDate);
                task.taskDescription.date.textContent = date + (new Date (descriptionDate).toLocaleDateString('ru'));
                showSubtasks(task);
            }

        });
        return task;
    }

    return task;
}

function createTaskDescription(taskDescription) {
    taskDescription.icon = $('.task-description-color');
    taskDescription.name = $('.task-description-text');
    taskDescription.completed = $('.task-description-state');
    taskDescription.priority = $('.task-description-priority');
    taskDescription.tags = $('.task-description-tags');
    taskDescription.date = $('.task-description-date');
    return taskDescription;
}

function createSubtask(subtask) {
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

function showTasks() {
    var taskCompletedContainer = $('.tasks-completed');
    var taskNotCompletedContainer = $('.tasks-not-completed');
    var taskArray;
    var task;
    if (localStorage.length > 0){
        for(var i = 0; i < localStorage.length; i++){
            var key = localStorage.key(i);
            if(key == 'notcompleted'){
                taskArray = currentTasks(key);
                for(var j = 0; j < taskArray.length; j++){
                    if(taskArray[j].taskCompleted == false){
                        task = new Task(taskArray[j]);
                        task = createTask(task);
                    }
                }
            }
            else if(key == 'completed'){
                taskArray = currentTasks(key);
                for(var k = 0; k < taskArray.length; k++){
                    task = new Task(taskArray[k]);
                    task = createTask(task);
                    task.newTask.style.display = 'none';
                    var completedTaskBody = task.newTask.cloneNode(true);
                    taskNotCompletedContainer.removeChild(task.newTask);
                    completedTaskBody.style.display = 'block';
                    completedTaskBody.classList.add('task-checked');
                    completedTaskBody.classList.add('task-terminated');
                    taskCompletedContainer.appendChild(completedTaskBody);
                }
            }
        }
    }
}

function showSubtasks(event) {
    var taskArray = currentTasks('notcompleted');
    var taskNodeArray = document.querySelectorAll('.new-task');
    for(var i = 0; i < taskNodeArray.length; i++){
        if(localStorage.length > 0 && event.newTask == taskNodeArray[i] && !taskNodeArray[i].classList.contains('task-terminated')){
            for(var j = 0; j < taskArray[i].subtasks.length; j++){
                var subtask = new Subtask(taskArray[i].subtasks[j]);
                subtask = createSubtask(subtask);
            }
        }
    }
}

function clearTaskDescription(taskDescription) {
    if(arguments.length == 1){
        for(var elements in taskDescription){
            if(taskDescription.hasOwnProperty(elements)){
                taskDescription[elements].textContent = '';
            }
        }
        return taskDescription;
    }
    else{
        var task = new Task();
        for(var element in task.taskDescription){
            if(task.taskDescription.hasOwnProperty(element)){
                task.taskDescription[element].textContent = '';
            }
        }
        task.taskDescription.icon.classList.remove('task-priority-grey');
        task.taskDescription.icon.classList.remove('task-priority-red');
    }

}

function clearSubtaskDescription() {
    var subtasksNotCompleteContainer = $('.subtasks-not-completed');
    var allNodeSubtasks = document.querySelectorAll('.new-subtask');
    for(var i = 0; i < allNodeSubtasks.length; i++){
        subtasksNotCompleteContainer.removeChild(allNodeSubtasks[i]);
    }
}

function currentTasks(type) {
    return localStorage.length > 0 ? JSON.parse(localStorage.getItem(type)) : [];
}

function $(class_selector) {
    return document.querySelector(class_selector);
}

function taskCheckedCounter() {
    var taskCheckCounter = 0;
    var taskNodeArray = document.querySelectorAll('.new-task');
    var subtaskNodeArray = document.querySelectorAll('.new-subtask');
    for(var i = 0; i < taskNodeArray.length - subtaskNodeArray.length; i++){
        if(taskNodeArray[i].childNodes[1].checked) taskCheckCounter++;
    }
    return taskCheckCounter;
}

function toDate(inputedDate) {
    var dateArray = inputedDate.split('.');
    return new Date(dateArray[2], dateArray[1] - 1, dateArray[0]);
}