import { Request as HttpRequest, Response, NextFunction } from "express-serve-static-core";
import moment from "moment";

class Request {
  rules () {
    throw new Error("Method rules is not defined!");
  }

  handle() {

  }

  all() {

  }

  validated(req: HttpRequest) {

  }

  // validate(req: HttpRequest, res: Response, next: NextFunction) {
  //   const { name, policy, status, assign, start_date, due_date, description } =
  //     req.body;

  //   if (start_date) {
  //     req.body.start_date = moment(start_date);
  //   }

  //   if (due_date) {
  //     req.body.due_date = moment(due_date);
  //   }

  //   next();
  // }
}

export default Request
