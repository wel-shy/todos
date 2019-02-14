import {Schema} from "mongoose";
import models from "../models";
import {ITodo} from "../schemas/todo";
import {IResourceController} from "./base";

export class TodoController implements IResourceController<ITodo> {
  public async destroy(id: Schema.Types.ObjectId): Promise<void> {
    await models.Todo.deleteOne({_id: id});
  }

  public edit(id: Schema.Types.ObjectId, data: any): Promise<ITodo> {
    return undefined;
  }

  public async get(id: Schema.Types.ObjectId): Promise<ITodo> {
    return await models.Todo.findOne({_id: id});
  }

  public getAll(): Promise<ITodo[]> {
    return undefined;
  }

  public async store(data: {
    task: string,
    userId: Schema.Types.ObjectId,
    done?: boolean,
  }): Promise<ITodo> {
    data.done = false;
    return await models.Todo.create(data);
  }
}
