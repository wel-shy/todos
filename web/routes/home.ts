import {NextFunction, Request, Response} from "express";
import {Methods} from "../methods";
import {BaseRouter} from "./base";

export class HomeRouter extends BaseRouter {
  constructor() {
    super();
    this.addRoute("/", Methods.GET, this.home);
  }

  public home(req: Request, res: Response, next: NextFunction): Response {
    return res.send("Hello World");
  }
}
