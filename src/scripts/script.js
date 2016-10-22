'use strict';

var common = require('./modules/common');
var taskManager = require('./modules/services/task.service');
var handlers = require('./modules/handler');

// localStorage.clear();

common.setAppHeigth();
taskManager.showTasks();
handlers.init();