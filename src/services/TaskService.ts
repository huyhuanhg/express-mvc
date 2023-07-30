class TaskService {
  _task = require('../models/Task');

  constructor(){

  }

  getFilteredPaginator(requestData: any) {
    const count = this._task.count(requestData);
    //TODO: get paginateInfo
    const tasks = this._task.get(requestData);

    return tasks;
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

  delete() {

  }
}

module.exports = new TaskService
