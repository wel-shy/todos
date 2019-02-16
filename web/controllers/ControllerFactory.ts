import IBaseMongoResource from "../schemas/IBaseMongoResource";
import {ITodo} from "../schemas/Todo";
import {IUser} from "../schemas/User";
import {IResourceController} from "./IResourceController";
import {MongoController} from "./MongoResourceController";

/**
 * Generate a controller for the type of database
 */
export default class ControllerFactory {

  /**
   * Determine database type and return fitting controller.
   * @param {string} resName
   * @returns {IResourceController<IBaseMongoResource | any>}
   */
  public static getController(resName: string): IResourceController<IBaseMongoResource | any> {
    switch (process.env.DB_TYPE) {
      case "MONGO":
        return ControllerFactory.getMongoController(resName);
      default:
        return ControllerFactory.getMongoController(resName);
    }
  }

  /**
   * Determine table and return controller for that table.
   * @param {string} res
   * @returns {MongoController<IBaseMongoResource>}
   */
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
