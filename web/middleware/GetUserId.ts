import * as e from "express";
import {getSchema} from "../routes/Index";

export default function getUserId(res: e.Response): string {
  // @ts-ignore
  const route: routeSchema = getSchema(res.route.toString());

  if (!route.options.isOwned) {
    return null;
  }
  return res.locals.user.id;
}
