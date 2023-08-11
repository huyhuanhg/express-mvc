import Request from "../../../lib/request";
import {
  Request as HttpRequest,
  Response,
  NextFunction,
} from "express-serve-static-core";
import _ from "lodash";
import moment from "moment";

class TaskStoreValidationMiddleware {
  _err: Record<string, string[]> = {};
  // rules(): Record<string, any> {
  //   return {
  //     name: "require|string",
  //     policy: "require|string",
  //     status: "require|string",
  //     assign: "nullable|int",
  //     start_date: "nullable|date",
  //     due_date: "nullable|date",
  //     description: "nullable|string",
  //   };
  // }

  validate(req: HttpRequest, res: Response, next: NextFunction) {
    const { name, policy, status, assigned_user_id, start_date, due_date } = req.body;
    this._err = {}

    if (!name) {
      this._err.name = ["Name is required!"];
    }

    if (!policy) {
      this._err.policy = ["Policy is required!"];
    }

    if (!status) {
      this._err.status = ["Status is required!"];
    }

    if (assigned_user_id !== undefined && typeof assigned_user_id !== 'number') {
      this._err.assigned_user_id = ["Assigned User Id must be type number!"];
    }

    if (start_date) {
      req.body.start_date = moment(start_date);
    } else {
      req.body.start_date = null;
    }

    if (due_date) {
      req.body.due_date = moment(due_date);
    } else {
      req.body.due_date = null;
    }

    if (_.isEmpty(this._err)) {
      return next();
    }

    req.session.errors = {
      ...this._err
    }

    return res.redirect("task/create");
  }
}

export default new TaskStoreValidationMiddleware();
