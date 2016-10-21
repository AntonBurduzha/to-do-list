var subtask = function (params) {
  var Subtask = function (params) {
    var param = params || {};
    this.newSubtask = param.newSubtask || null;
    this.subtaskPriority = param.subtaskPriority || null;
    this.specificPriority = param.specificPriority || 'normal';
    this.subtaskText = param.subtaskText || null;
    this.specificText = param.specificText || '';
  }
  return new Subtask(params);
};

module.exports = subtask;
