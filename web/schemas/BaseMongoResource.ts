import { Document } from "mongoose";

export default interface IBaseMongoResource extends Document {
  getTableName(): string;
}
