import { NextFunction, Request, Response } from "express";
import { AuthController } from "../../controllers/auth";
import { UserController } from "../../controllers/user";
import { Methods } from "../../methods";
import { Reply } from "../../reply";
import { IUser } from "../../schemas/user";
import { BaseRouter } from "../base";

const userController: UserController = new UserController();
const authController: AuthController = new AuthController();

export class AuthRouter extends BaseRouter {
  /**
   * Add routes to the Auth Router.
   */
  constructor() {
    super();
    this.addRoute("/authenticate", Methods.POST, this.authenticateUser);
    this.addRoute("/register", Methods.POST, this.registerUser);
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
    const password: string = req.body.password;

    // abort if either username or password are null
    if (!username || !password) {
      const e: Error = new Error("400");
      return next(e);
    }

    let user: IUser;
    try {
      user = await userController.store({ username, password });
    } catch (error) {
      console.log(error);
      return next(error);
    }

    const token = authController.generateToken(user);

    const response = new Reply(200, "success", false, { user, token });
    return res.json(response);
  }
}
