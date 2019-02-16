import {NextFunction, Response, Request} from "express";
import RouterSchema from "../routes/RouterSchema";
import {getSchema} from "../routes/Index";
import IBaseMongoResource from "../schemas/IBaseMongoResource";
import ControllerFactory from "../controllers/ControllerFactory";
import {IResourceController} from "../controllers/IResourceController";

/**
 * Verfiy a user's JWT token
 * @param {e.Request} req
 * @param {e.Response} res
 * @param {e.NextFunction} next
 */
export default async function checkPermission(req: Request,
                           res: Response,
                           next: NextFunction) {
  let id: string =
    req.body.id ||
    req.query.id ||
    req.headers["id"] ||
    req.params.id ||
    req.params["id"];

  if (id === undefined || null || "") {
    return next();
  }

  const routeSchema: RouterSchema = getSchema(req.originalUrl);

  if (!routeSchema.options.isOwned) {
    return next();
  }

  let resource: IBaseMongoResource;
  const resController: IResourceController<IBaseMongoResource> = ControllerFactory.getController(routeSchema.table);
  try {
    resource = await resController.get(id);
    if(res.locals.user.id === resource.getUserId().toString()) {
      return next();
    }
    else {
      res.locals.customErrorMessage = "Resource does not belong to user";
      res.locals.error = 403;
      next();
    }
  } catch (e) {
    res.locals.customErrorMessage = e.message;
    res.locals.error = 500;
    next();
  }

  return next();
}
