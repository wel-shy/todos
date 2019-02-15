import { Express } from "express";

import { AuthRouter } from "./api/AuthRouter";
import { UserRouter } from "./api/UserRouter";
import { HomeRouter } from "./HomeRouter";

/**
 * Add routes to app
 * @param {e.Express} app
 * @returns {e.Express}
 */
const addRoutes = (app: Express) => {
  app.use("/", new HomeRouter().getRouter());
  app.use("/api/auth", new AuthRouter().getRouter());
  app.use("/api/user", new UserRouter().getRouter());
  return app
};

export default addRoutes;
