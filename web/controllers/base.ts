import { Document, Schema } from "mongoose";

export interface IResourceController<Document> {
  get(id: Schema.Types.ObjectId): Promise<Document>;
  getAll(): Promise<Document[]>;
  edit(id: Schema.Types.ObjectId, data: any): Promise<Document>;
  store(data: any): Promise<Document>;
  destroy(id: Schema.Types.ObjectId): Promise<void>;
}
