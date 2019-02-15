import {Server} from "http";
import {describe} from "mocha";
import {App} from "../web/Server";

let server: Server;

describe("App", () => {
  // let server = null
  before(() => {
    const port: number = 8888;
    process.env.TEST = "true";

    try {
      server = new App().express.listen(port)
    } catch (e) {
      console.error(e)
    }
  });

  after(async () => {
    await server.close()
  });

  require("./modules/User");
  require("./modules/Home");
  require("./modules/Auth");
  require("./modules/Middleware");
  require("./modules/Todo");
});
