module.exports = function Subtask(params) {
  params = params || {};
  this.newSubtask = params.newSubtask || null;
  this.subtaskPriority = params.subtaskPriority || null;
  this.specificPriority = params.specificPriority || 'normal';
  this.subtaskText = params.subtaskText || null;
  this.specificText = params.specificText || '';
};
