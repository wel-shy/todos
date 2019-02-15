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

/**
 * Authentication router
 */
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
   * Handler for /register endpoint
   * Takes users credentials and returns token
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

    /*
     * Get the user
     */
    let user: IUser;
    try {
      user = await authController.authenticateUser(username, password);
    } catch (error) {
      return next(error);
    }

    // return err if not found
    if (!user) {
      return next(new Error("404"));
    }

    // Generate a token
    const token = authController.generateToken(user);

    // Construct and send reply.
    const response = new Reply(200, "success", false, { token });
    return res.json(response);
  }

  /**
   * Register the user.
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
      return next(new Error("400"));
    }

    /*
     * Generate an IV for the user.
     * Hash the user password against iv.
     * Store the user.
     *
     * Throws 403 if user exists
     * Throws 500 if insertion fails.
     */
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

    // Return user and token.
    const token = authController.generateToken(user);
    user.password = "";

    const response = new Reply(200, "success", false, { user, token });
    return res.json(response);
  }
}
