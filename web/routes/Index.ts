import {Express} from "express";
import {AuthRouter} from "./api/AuthRouter";
import {HomeRouter} from "./HomeRouter";
import ResourceRouterFactory from "./ResourceRouterFactory";
import RouterSchema from "./RouterSchema";

/**
 * Add routes to app
 * @param {e.Express} app
 * @returns {e.Express}
 */
const addRoutes = (app: Express) => {
  app.use("/", new HomeRouter().getRouter());
  app.use("/api/auth", new AuthRouter().getRouter());

  routes.forEach((schema: RouterSchema) => {
    app.use(schema.route, ResourceRouterFactory.getResourceRouter(schema.table, schema.options).getRouter());
  });

  return app
};

export default addRoutes;

export const routes: RouterSchema[] = [
  new RouterSchema({
      isOwned: true,
      isProtected: true,
    },
    "/api/todo",
    "todo"),
  new RouterSchema({
      isOwned: false,
      isProtected: true,
    },
    "/api/user",
    "user"),
];

export function getSchema(route: string): RouterSchema {
  return routes.find((schema: RouterSchema) => route.indexOf(schema.route) > -1);
}
