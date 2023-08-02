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

    if (!name) {
      this._err.name = ["Name is required!"];
    }

    if (!policy) {
      this._err.policy = ["Policy is required!"];
    }

    if (!status) {
      this._err.status = ["Status is required!"];
    }

    if (typeof assigned_user_id !== 'number') {
      this._err.assigned_user_id = ["Assigned User Id must be type number!"];
    }

    if (start_date) {
      req.body.start_date = moment(start_date);
    }

    if (due_date) {
      req.body.due_date = moment(due_date);
    }

    // todo validate user

    if (_.isEmpty(this._err)) {
      next();
    }

    res.render("task/create-or-edit", {
      errors: {
        ...this._err,
      },
    });
  }
}

export default new TaskStoreValidationMiddleware();
