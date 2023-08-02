import { Request, Response } from "express-serve-static-core";
import Policy from '../../enums/Policy';
import Status from '../../enums/Status';

interface Test extends Request {
  all: Function
}

class TaskController {
  _taskService = require('../../services/TaskService');

  index(req: Request, res: Response) {
    const tasks = this._taskService.find(1);

    console.log('tasks :>> ', tasks);

    res.render("task", { tasks });
  }

  create(req: Request, res: Response) {
    res.render("task/create-or-edit", {
      status: Status,
      policies: Policy,
    });
  }

  edit(req: Request, res: Response) {
    res.render("task/create-or-edit", {
      status: Status,
      policies: Policy,
      task: {}
    });
  }

  store(req: Test, res: Response) {
    console.log('req.body :>> ', req.body);
    res.redirect('/task');
  }

  update(req: Request, res: Response) {
    console.log('req.body :>> ', req.body);
    res.redirect('/task');
  }
}

module.exports = new TaskController;
