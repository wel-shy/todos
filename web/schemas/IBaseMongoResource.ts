import {Document, Schema} from "mongoose";

export default interface IBaseMongoResource extends Document {
  getTableName(): string;
  getUserId(): Schema.Types.ObjectId;
}
