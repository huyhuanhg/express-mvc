import { Request, Response } from "express-serve-static-core";

class HomeController {
  index(req: Request, res: Response) {
    res.render("home");
  }
}

module.exports = new HomeController;
