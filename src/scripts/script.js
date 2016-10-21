'use strict';

var taskManager = require('./task-manager');
var handlers = require('./handlers');

// localStorage.clear();

taskManager.showTasks();
handlers.init();