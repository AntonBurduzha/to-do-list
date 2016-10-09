'use strict'

var mainWindow = document.querySelector('.main');
mainWindow.style.height = document.documentElement.clientHeight + 'px';

var addTaskForm = document.querySelector('.form-add-task');
var addTaskInput = document.querySelector('.input-add-task');
var addTaskBtn = document.querySelector('.btn-add-task');

var addSubtaskForm = document.querySelector('.form-add-subtask');
var addSubtaskInput = document.querySelector('.input-add-subtask');
var addSubtaskBtn = document.querySelector('.btn-add-subtask');

function Task() {
    this.newTask = null;
    this.taskPriority = null;
    this.specificPriority = 'normal';
    this.taskCheck = null;
    this.specificDate = null;
    this.taskDate = null;
    this.taskCompleted = false;
    this.subtasks = []; //массив для подзадач
}
var task; //обьект задачи

function Subtask(){
    this.newSubtask = null;
    this.subtaskPriority = null;
    this.specificPriority = 'normal';
    this.subtaskCheck = null;
    this.subtaskCompleted = false;
    this.subtaskText = null;
}

var subtask; //обьект подзадачи

function TaskDescription() {
    this.name = null;
    this.completed = null;
    this.priority = null;
    this.date = null;
}
var taskDescription; //обьект описания задачи

var taskMap = []; //хранит задачи
var taskDescriptionMap = []; //хранит описание задачи

addTaskBtn.addEventListener('click', function (event) {
    if(addTaskInput.value.length > 0){
        task = new Task(); //блок создающий задачу
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
        task.taskText.textContent = addTaskInput.value;
        task.taskText.classList.add('task-text');

        task.taskDate = document.createElement('p');
        task.taskDate.classList.add('task-date');//указать позже день в зависимости от даты
        var today = new Date();
        task.specificDate = today;

        task.newTask.appendChild(task.taskPriority);
        task.newTask.appendChild(task.taskCheck);
        task.newTask.appendChild(task.taskText);
        task.newTask.appendChild(task.taskDate);
        addTaskInput.value = '';
        taskMap.push(task);

        taskDescription = new TaskDescription();//блок описывающий задачу
        taskDescription.name = document.querySelector('.task-description-text');
        taskDescription.name.textContent = '';

        taskDescription.completed = document.querySelector('.task-description-state');
        taskDescription.completed.textContent = '';

        taskDescription.priority = document.querySelector('.task-description-priority');
        taskDescription.priority.textContent = '';
        //тэги
        taskDescription.date = document.querySelector('.task-description-date');
        taskDescription.date.textContent = '';
        taskDescriptionMap.push(taskDescription);
    }
    event.preventDefault();
});

function checkTask(event) {
    var target = event.target;
    var targetParent = target.parentNode;
    targetParent.classList.toggle('task-checked');
    targetParent.childNodes[2].classList.toggle('task-text-checked');
}

function showTaskDescription(event) {
    for(var i = 0; i < taskMap.length; i++){
        if(event.target == taskMap[i].newTask){
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

            //обновлять при новой задаче
            addSubtaskBtn.addEventListener('click', function (event) {
                if(addSubtaskInput.value.length > 0){
                    subtask = new Subtask(); //блок создающий подзадачу
                    subtask.newSubtask = document.createElement('div');
                    subtask.newSubtask.classList.add('new-task');
                    addSubtaskForm.parentNode.appendChild(subtask.newSubtask);

                    subtask.subtaskPriority = document.createElement('div');
                    subtask.subtaskPriority.classList.add('task-priority-grey');

                    subtask.subtaskCheck = document.createElement('input');
                    subtask.subtaskCheck.setAttribute('type', 'checkbox');
                    subtask.subtaskCheck.classList.add('task-checkbox');

                    subtask.subtaskText = document.createElement('p');
                    subtask.subtaskText.textContent = addSubtaskInput.value;
                    subtask.subtaskText.classList.add('task-text');

                    subtask.newSubtask.appendChild(subtask.subtaskPriority);
                    subtask.newSubtask.appendChild(subtask.subtaskCheck);
                    subtask.newSubtask.appendChild(subtask.subtaskText);
                    addSubtaskInput.value = '';
                    taskMap[i].subtasks.push(subtask);
                }

                event.preventDefault();
            });
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



