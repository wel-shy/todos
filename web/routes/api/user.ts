import models from "../../models";
import { Reply } from "../../reply";
import {IUser} from "../../schemas/user";

import { NextFunction, Request, Response } from "express";
import {checkToken} from "../../middleware/authenticate";
import {ResourceRouter} from "../resource";

export class UserRouter extends ResourceRouter {
  constructor() {
    super();
    this.addMiddleware(checkToken);
    this.addDefaultRoutes();
  }

  /**
   * Destory a user
   * @param {e.Request} req
   * @param {e.Response} res
   * @param {e.NextFunction} next
   * @returns {Promise<void | e.Response>}
   */
  public async destroy(req: Request, res: Response, next: NextFunction): Promise<void | Response> {
    if (res.locals.error) {
      return next(new Error(`${res.locals.error}`));
    }
    const userId: string = res.locals.user.id;
    try {
      await models.User.deleteOne({_id: userId});
    } catch (e) {
      return next(e);
    }

    return res.json(new Reply(200, "success", false, {}))
  }

  /**
   * Get all users
   * @param {e.Request} req
   * @param {e.Response} res
   * @param {e.NextFunction} next
   * @returns {Promise<void | e.Response> | void}
   */
  public index(req: Request, res: Response, next: NextFunction): Promise<void | Response> | void {
    return undefined;
  }

  /**
   * Get a user
   * @param {e.Request} req
   * @param {e.Response} res
   * @param {e.NextFunction} next
   * @returns {Promise<void | e.Response>}
   */
  public async show(req: Request, res: Response, next: NextFunction): Promise<void | Response> {
    if (res.locals.error) {
      return next(new Error(`${res.locals.error}`))
    }

    // Get user from id collected from 'checkToken middleware'
    const userId: string = res.locals.user.id;
    let user: IUser;
    try {
      user = await models.User.findOne({_id: userId})
    } catch (e) {
      e.message = "500";
      return next(e)
    }
    return res.json(new Reply(200, "success", false, {user}));
  }

  /**
   * Store a user, handled in auth
   * @param {e.Request} req
   * @param {e.Response} res
   * @param {e.NextFunction} next
   * @returns {Promise<void | e.Response> | void}
   */
  public store(req: Request, res: Response, next: NextFunction): Promise<void | Response> | void {
    return undefined;
  }

  /**
   * Update a user.
   * @param {e.Request} req
   * @param {e.Response} res
   * @param {e.NextFunction} next
   * @returns {Promise<void | e.Response> | void}
   */
  public update(req: Request, res: Response, next: NextFunction): Promise<void | Response> | void {
    return undefined;
  }
}
