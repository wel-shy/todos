import {NextFunction, Request, Response} from "express";
import {BaseRouter} from "./base";

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
    this.router.get("/:id", this.show);
    this.router.delete("/:id", this.destroy);
    this.router.post("/update", this.update);
    this.router.get("/", this.index);

    if (this.fileUploadHandler) {
      this.router.post("/", this.fileUploadHandler, this.store);
    } else {
      this.router.post("/", this.store);
    }
  }
}