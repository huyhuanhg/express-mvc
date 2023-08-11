class TaskService {
  _task = require('../models/Task');

  constructor(){

  }

  getFilteredPaginator(requestData: any) {
    return this._task.getFilteredPaginator(requestData);
  }

  find(taskId: number) {
    return this._task.find(taskId);
  }

  create(requestData: any) {
    return this._task.insert(requestData);
  }

  update(taskId: number, requestData: any) {
    return this._task.update(taskId, requestData);
  }

  delete(taskId: number) {
    return this._task.delete(taskId);
  }
}

module.exports = new TaskService
