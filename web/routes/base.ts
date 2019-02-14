import { Handler, Router } from "express";
import { Methods } from "../methods";

/**
 * @apiDefine isAuthenticated
 * @apiHeader {String} x-access-token Users authentication token
 */

/**
 * Base router class. All routers extend this class.
 */
export abstract class BaseRouter {
  public router: Router;
  public fileUploadHandler: Handler;

  protected constructor() {
    this.router = Router();
  }

  /**
   * Add a route to the router.
   * @param {string} path
   * @param {Methods} method
   * @param handler
   */
  public addRoute(
    path: string,
    method: Methods,
    handler: Handler) {
    switch (method) {
      case Methods.GET:
        this.router.get(path, handler);
        break;
      case Methods.POST:
        this.router.post(path, handler);
        break;
      case Methods.PUT:
        this.router.put(path, handler);
        break;
      case Methods.DELETE:
        this.router.delete(path, handler);
    }
  }

  /**
   * Return the router.
   * @returns {e.Router}
   */
  public getRouter(): Router {
    return this.router;
  }

  /**
   * Add middleware to the router.
   * @param middleware
   */
  public addMiddleware(middleware: Handler): void {
    this.router.use(middleware);
  }
}
