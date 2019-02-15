import { NextFunction, Request, Response } from "express";
import {MongoError} from "mongodb";
import { AuthController } from "../../controllers/AuthController";
import ControllerFactory from "../../controllers/ControllerFactory";
import {IResourceController} from "../../controllers/IResourceController";
import CryptoHelper from "../../CryptoHelper";
import { HTTPMethods } from "../../HTTPMethods";
import { Reply } from "../../Reply";
import { IUser } from "../../schemas/User";
import { BaseRouter } from "../BaseRouter";

const userController: IResourceController<IUser> = ControllerFactory.getController("user");
const authController: AuthController = new AuthController();

export class AuthRouter extends BaseRouter {
  /**
   * Add routes to the Auth Router.
   */
  constructor() {
    super();
    this.addRoute("/authenticate", HTTPMethods.POST, this.authenticateUser);
    this.addRoute("/register", HTTPMethods.POST, this.registerUser);
  }

  /**
   * @api {post} /api/authenticate Authenticate user.
   * @apiGroup Auth
   *
   * @apiParam {String} username  User's username
   * @apiParam {String} password  User's password
   *
   * @apiSuccessExample {json} Success-Response:
   *  HTTP/1.1 200 OK
   *  {
   *     "code": 200,
   *     "message": "success",
   *     "errors": false,
   *     "payload": {
   *       "token": "token"
   *     }
   *  }
   *
   * @apiDescription Authenticate user against username and password.
   * Return a JWT token.
   *
   * @param {e.Request} req
   * @param {e.Response} res
   * @param {e.NextFunction} next
   * @returns {Promise<e.Response | void>}
   */
  public async authenticateUser(req: Request, res: Response, next: NextFunction):
    Promise<Response | void> {
    // Get username and password from request
    const username: string = req.body.username;
    const password: string = req.body.password;

    let user: IUser;
    try {
      user = await authController.authenticateUser(username, password);
    } catch (error) {
      return next(error);
    }

    const token = authController.generateToken(user);

    const response = new Reply(200, "success", false, { token });
    return res.json(response);
  }

  /**
   * @api {post} /api/register Register a user.
   * @apiGroup Auth
   *
   * @apiParam {String} username  User's username
   * @apiParam {String} password  User's password
   *
   * @apiSuccessExample {json} Success-Response:
   *  HTTP/1.1 200 OK
   *  {
   *     "code": 200,
   *     "message": "success",
   *     "errors": false,
   *     "payload": {
   *       "user": {
   *         "devices": [],
   *         "media": [],
   *         "_id": "user_id",
   *        "iv": "iv_string",
   *        "username": "user",
   *        "password": "hashed_password",
   *        "createdAt": "2018-12-12T16:13:59.352Z",
   *        "updatedAt": "2018-12-12T16:13:59.352Z",
   *        "__v": 0
   *      },
   *      "token": "token"
   *    }
   * }
   *
   * @apiDescription Registers a user.
   * Returns a JWT token.
   *
   * @param {e.Request} req
   * @param {e.Response} res
   * @param {e.NextFunction} next
   * @returns {Promise<e.Response | void>}
   */
  public async registerUser(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    // Get username and password
    const username: string = req.body.username;
    let password: string = req.body.password;

    // abort if either username or password are null
    if (!username || !password) {
      const e: Error = new Error("400");
      return next(e);
    }

    let user: IUser;
    let e: Error;
    try {
      const iv: string = CryptoHelper.getRandomString(16);
      password = CryptoHelper.hashString(password, iv);
      user = await userController.store({ iv, username, password });
    } catch (error) {
      if ((error as MongoError).errmsg.indexOf("duplicate key error collection")) {
        e = new Error("403");
      } else {
        e = new Error("500");
      }

      return next(e);
    }

    const token = authController.generateToken(user);

    const response = new Reply(200, "success", false, { user, token });
    return res.json(response);
  }
}
