var addTaskHandler = require('./handlers/add.tasks');
var addSubtaskHandler = require('./handlers/add.subtasks');
var addTaskTagsHandler = require('./handlers/add.task.tag');
var cleareTaskInfoHandler = require('./handlers/clear.task.info');
var completeTaskHandler = require('./handlers/complete.task');
var removeTaskHandler = require('./handlers/remove.task');
var searchTaskHandler = require('./handlers/search.task');
var setTaskDateHandler = require('./handlers/set.task.date');
var setTaskPriority = require('./handlers/set.task.priority');
var showCompletedTaskInfo = require('./handlers/show.completed.task.info');

var handler = {
  init: createEventListeners
};

module.exports = handler;

function createEventListeners() {
  addTaskHandler.createAddTaskHandler();
  addSubtaskHandler.createAddSubtaskHandler();
  addTaskTagsHandler.createAddTaskTagHandler();
  cleareTaskInfoHandler.createClearTaskInfoHandler();
  completeTaskHandler.createCompleteTaskHandler();
  removeTaskHandler.createRemoveTaskHandler();
  searchTaskHandler.createSearchTaskHandler();
  setTaskDateHandler.createSetTaskDateHandler();
  setTaskPriority.createSetTaskPriorityHandler();
  showCompletedTaskInfo.createCompletedTaskInfoHandler();
}
