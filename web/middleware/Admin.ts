import ControllerFactory from "../controllers/ControllerFactory";
import {IResourceController} from "../controllers/IResourceController";
import {IUser} from "../schemas/User";
import {UserRoles} from "../UserRoles";
import {NextFunction, Request, Response} from "express";

/**
 * Verfiy a user's JWT token
 * @param {e.Request} req
 * @param {e.Response} res
 * @param {e.NextFunction} next
 */
export default async function checkAdmin(req: Request,
                                              res: Response,
                                              next: NextFunction) {

  const userController: IResourceController<IUser> = ControllerFactory.getController("user");
  let user: IUser;
  if (res.locals.error) {
    if (!(res.locals.error === 403)) return next();
  }


  try {
    user = await userController.get(res.locals.user.id);
  } catch (e) {
    res.locals.customErrorMessage = e.message;
    res.locals.error = 500;
    return next();
  }

  if (user.role === UserRoles.ADMIN) {
    res.locals.admin = UserRoles.ADMIN;
  }

  return next();
}

