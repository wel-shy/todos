import { Handler, Router } from "express";
import { HTTPMethods } from "../HTTPMethods";

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
   * @param {HTTPMethods} method
   * @param handler
   */
  public addRoute(
    path: string,
    method: HTTPMethods,
    handler: Handler) {
    switch (method) {
      case HTTPMethods.GET:
        this.router.get(path, handler);
        break;
      case HTTPMethods.POST:
        this.router.post(path, handler);
        break;
      case HTTPMethods.PUT:
        this.router.put(path, handler);
        break;
      case HTTPMethods.DELETE:
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
