import { create } from 'express-handlebars';
import { Request, Response } from "express-serve-static-core";
import Policy from '../../enums/Policy';
import Status from '../../enums/Status';

class TaskController {
  _taskService = require('../../services/TaskService');

  async index(req: Request, res: Response) {
    const tasks = await this._taskService.getFilteredPaginator(req.query);

    return res.render("task", { tasks });
  }

  create(req: Request, res: Response) {
    const { errors, olds } = req.session

    res.render("task/create-or-edit", {
      status: Status,
      policies: Policy,
      errors,
      olds
    });
  }

  async edit(req: Request, res: Response) {
    const { errors, olds } = req.session

    const task = await this._taskService.find(req.params.taskId);

    return res.render("task/create-or-edit", {
      status: Status,
      policies: Policy,
      errors,
      olds,
      task
    });
  }

  async store(req: Request, res: Response) {
    await this._taskService.create(req.body)

    return res.redirect('/task');
  }

  update(req: Request, res: Response) {
    console.log('req.body :>> ', req.body);
    return res.redirect('/task');
  }
}

module.exports = new TaskController;
