import {Schema} from "mongoose";
import {getModel} from "../Models";
import IBaseMongoResource from "../schemas/BaseMongoResource";
import {IResourceController} from "./IResourceController";

export class MongoController<T extends IBaseMongoResource> implements IResourceController<T> {
  private table: string;

  public async destroy(id: Schema.Types.ObjectId): Promise<void> {
    await getModel(this.getTableName()).deleteOne({_id: id});
  }

  public edit(id: Schema.Types.ObjectId, data: any): Promise<T> {
    return undefined;
  }

  public async get(id: Schema.Types.ObjectId): Promise<T> {
    return await getModel(this.getTableName()).findOne({_id: id}) as T;
  }

  public async findManyWithFilter(filter: {}): Promise<T[]> {
    return await getModel(this.getTableName()).find(filter) as T[];
  }

  public async findOneWithFilter(filter: {}): Promise<T> {
    return await getModel(this.getTableName()).findOne(filter) as T;
  }

  public getAll(): Promise<T[]> {
    return undefined;
  }

  public async store(data: any): Promise<T> {
    return await getModel(this.getTableName()).create(data) as T;
  }

  public getTableName(): string {
    return this.table;
  }

  public setTableName(table: string): void {
    this.table = table;
  }
}
