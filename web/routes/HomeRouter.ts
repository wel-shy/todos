import {NextFunction, Request, Response} from "express";
import {HTTPMethods} from "../HTTPMethods";
import {BaseRouter} from "./BaseRouter";

export class HomeRouter extends BaseRouter {
  constructor() {
    super();
    this.addRoute("/", HTTPMethods.GET, this.home);
  }

  public home(req: Request, res: Response, next: NextFunction): Response {
    return res.send("Hello World");
  }
}
