import IBaseMongoResource from "../schemas/BaseMongoResource";
import {ITodo} from "../schemas/Todo";
import {IUser} from "../schemas/User";
import {IResourceController} from "./IResourceController";
import {MongoController} from "./MongoResourceController";

export default class ControllerFactory {

  public static getController(resName: string): IResourceController<IBaseMongoResource | any> {
    switch (process.env.DB_TYPE) {
      case "MONGO":
        return ControllerFactory.getMongoController(resName);
      default:
        return ControllerFactory.getMongoController(resName);
    }
  }

  private static getMongoController(res: string): MongoController<IBaseMongoResource> {
    let cont: MongoController<IBaseMongoResource>;

    switch (res) {
      case "user":
        cont = new MongoController<IUser>();
        break;
      case "todo":
        cont = new MongoController<ITodo>();
        break;
      default:
        cont = new MongoController<IBaseMongoResource>();
        break;
    }

    cont.setTableName(res);
    return cont;
  }
}
