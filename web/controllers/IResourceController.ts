import { Schema } from "mongoose";
import IBaseMongoResource from "../schemas/BaseMongoResource";

/**
 * Interface for resource controllers.
 * All controllers for all dbs should implement this if they manage a resource.
 */
export interface IResourceController<T extends IBaseMongoResource> {
  get(id: Schema.Types.ObjectId | string): Promise<T>;
  getAll(): Promise<T[]>;
  edit(id: Schema.Types.ObjectId | string, data: any): Promise<T>;
  store(data: any): Promise<T>;
  destroy(id: Schema.Types.ObjectId | string): Promise<void>;

  findOneWithFilter(filter: {}): Promise<T>;
  findManyWithFilter(filter: {}): Promise<T[]>;

  setTableName(table: string): void;
  getTableName(): string;
}
