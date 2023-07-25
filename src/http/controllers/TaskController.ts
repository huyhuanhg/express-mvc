import { Request, Response } from "express-serve-static-core";

class TaskController {
  index(req: Request, res: Response) {
    res.render("task");
  }

  create(req: Request, res: Response) {
    res.render("task/create-or-edit");
  }

  edit(req: Request, res: Response) {
    res.render("task/create-or-edit");
  }
}

module.exports = new TaskController;
