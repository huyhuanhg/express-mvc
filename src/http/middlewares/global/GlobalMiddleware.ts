import { NextFunction, Request, Response } from 'express';
import Middleware from "../Middleware";

class GlobalMiddleware extends Middleware {
  register(req: Request, res: Response, next: NextFunction) {
    const { query, body, method } = req

    if(method === 'POST') {
      req.session.olds = {
        ...query,
        ...body
      }
    }

    return next()
  }
}

export default GlobalMiddleware
