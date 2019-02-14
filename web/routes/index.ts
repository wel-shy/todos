import { Express } from "express";

import { AuthRouter } from "./api/auth";
import { UserRouter } from "./api/user";
import { HomeRouter } from "./home";

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
