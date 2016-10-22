'use strict';

var common = require('./modules/common');
var taskManager = require('./modules/managers/task-manager');
var handlers = require('./modules/handler');

// localStorage.clear();

common.setAppHeigth();
taskManager.showTasks();
handlers.init();