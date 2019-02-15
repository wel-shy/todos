import {Schema} from "mongoose";
import {getModel} from "../Models";
import IBaseMongoResource from "../schemas/BaseMongoResource";
import {IResourceController} from "./IResourceController";

/**
 * MongoDB specific resource controller.
 */
export class MongoController<T extends IBaseMongoResource> implements IResourceController<T> {
  private table: string;

  /**
   * Destroy a record
   * @param {Schema.Types.ObjectId} id
   * @returns {Promise<void>}
   */
  public async destroy(id: Schema.Types.ObjectId): Promise<void> {
    await getModel(this.getTableName()).deleteOne({_id: id});
  }

  /**
   * Update a record
   * @param {Schema.Types.ObjectId} id
   * @param {{}} data
   * @returns {Promise<T>}
   */
  public async edit(id: Schema.Types.ObjectId, data: {}): Promise<T> {
    return await getModel(this.getTableName()).findByIdAndUpdate(id, data, {new: true}) as T;
  }

  /**
   * Get a record
   * @param {Schema.Types.ObjectId} id
   * @returns {Promise<T>}
   */
  public async get(id: Schema.Types.ObjectId): Promise<T> {
    return await getModel(this.getTableName()).findOne({_id: id}) as T;
  }

  /**
   * Find a record matching search params
   * @param {{}} filter
   * @returns {Promise<T[]>}
   */
  public async findManyWithFilter(filter: {}): Promise<T[]> {
    return await getModel(this.getTableName()).find(filter) as T[];
  }

  /**
   * Find many matching records with search params
   * @param {{}} filter
   * @returns {Promise<T>}
   */
  public async findOneWithFilter(filter: {}): Promise<T> {
    return await getModel(this.getTableName()).findOne(filter) as T;
  }

  /**
   * Get all records
   * @returns {Promise<T[]>}
   */
  public async getAll(): Promise<T[]> {
    return await getModel(this.getTableName()).find() as T[];
  }

  /**
   * Store a record.
   * @param data
   * @returns {Promise<T>}
   */
  public async store(data: any): Promise<T> {
    return await getModel(this.getTableName()).create(data) as T;
  }

  /**
   * Get the table name for record type.
   * @returns {string}
   */
  public getTableName(): string {
    return this.table;
  }

  /**
   * Set the table name for record type.
   * @param {string} table
   */
  public setTableName(table: string): void {
    this.table = table;
  }
}
