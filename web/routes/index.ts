import { Express } from "express";

import auth from "./api/auth";
import user from "./api/user";
import home from "./home";

/**
 * Add routes to app
 * @param {e.Express} app
 * @returns {e.Express}
 */
const addRoutes = (app: Express) => {
  app.use("/", home());
  app.use("/api/auth", auth());
  app.use("/api/user", user());
  return app
};

export default addRoutes;
