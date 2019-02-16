import {NextFunction, Request, Response} from "express";
import {BaseRouter} from "./BaseRouter";
import {HTTPMethods} from "../HTTPMethods";

/**
 * A router that handles a resource.
 * Should implement methods to:
 *  - Fetch
 *  - Fetch all
 *  - Update
 *  - Store
 *  - Destroy
 *  the resource it handles.
 */
export abstract class ResourceRouter extends BaseRouter {

  /**
   * Get the resource by id.
   * @param {e.Request} req
   * @param {e.Response} res
   * @param {e.NextFunction} next
   * @returns {Promise<void | e.Response>}
   */
  public abstract index(req: Request, res: Response, next: NextFunction): Promise<void | Response> | void;

  /**
   * Store a resource
   * @param {e.Request} req
   * @param {e.Response} res
   * @param {e.NextFunction} next
   * @returns {Promise<void | e.Response> | void}
   */
  public abstract store(req: Request, res: Response, next: NextFunction):
    Promise<void | Response> | void;

  /**
   * Update the resource
   * @param {e.Request} req
   * @param {e.Response} res
   * @param {e.NextFunction} next
   * @returns {Promise<void | e.Response>}
   */
  public abstract update(req: Request, res: Response, next: NextFunction): Promise<void | Response> | void;

  /**
   * Destroy the resource
   * @param {e.Request} req
   * @param {e.Response} res
   * @param {e.NextFunction} next
   * @returns {Promise<void | e.Response>}
   */
  public abstract destroy(req: Request, res: Response, next: NextFunction):
    Promise<void | Response> | void;

  /**
   * Show all resources.
   * @returns {Promise<void | e.Response>}
   * @param req
   * @param res
   * @param next
   */
  public abstract show(req: Request, res: Response, next: NextFunction): Promise<void | Response> | void;

  /**
   * Setup router
   * Add all default routes to router.
   */
  public addDefaultRoutes(): void {
    this.addRoute("/:id", HTTPMethods.GET, this.show);
    this.addRoute("/:id", HTTPMethods.DELETE, this.destroy);
    this.addRoute("/update", HTTPMethods.POST, this.update);
    this.addRoute("/", HTTPMethods.POST, this.store);
    this.addRoute("/", HTTPMethods.GET, this.index);
  }
}
