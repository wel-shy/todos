import * as express from "express";
import * as jwt from "jsonwebtoken";
import { IUser } from "../schemas/User";

/**
 * Verfiy a user's JWT token
 * @param {e.Request} req
 * @param {e.Response} res
 * @param {e.NextFunction} next
 */
export function checkToken(req: express.Request,
                           res: express.Response,
                           next: express.NextFunction) {
  const token: string =
    req.body.token ||
    req.query.token ||
    req.headers["x-access-token"] ||
    req.params.token;

  if (token) {
    jwt.verify(token, process.env.SECRET, (err: Error, user: IUser) => {
      if (err) {
        res.locals.customErrorMessage = "invalid token";
        res.locals.error = 401;
        next();
      } else {
        res.locals.user = user;
        return next();
      }
    });
  } else {
    res.locals.customErrorMessage = "token not provided";
    res.locals.error = 401;
    next();
  }
}
