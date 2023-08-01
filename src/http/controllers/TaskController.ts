import { Request, Response } from "express-serve-static-core";

class TaskController {
  _taskService = require('../../services/TaskService');

  index(req: Request, res: Response) {
    const tasks = this._taskService.find(1);

    console.log('tasks :>> ', tasks);

    res.render("task", { tasks });
  }

  create(req: Request, res: Response) {
    res.render("task/create-or-edit");
  }

  edit(req: Request, res: Response) {
    res.render("task/create-or-edit");
  }
}

module.exports = new TaskController;
