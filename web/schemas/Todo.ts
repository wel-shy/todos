import { Schema } from "mongoose";
import IBaseMongoResource from "./BaseMongoResource";

const schemaOptions = {
  timestamps: true,
};

/**
 * User interface extending the Mongoose.Document
 */
export interface ITodo extends IBaseMongoResource {
  task: string;
  done: boolean;
  userId: Schema.Types.ObjectId,
  createdAt: string;
  updatedAt: string;

  getTableName(): string;
}

/**
 * Model a user schema in the database
 * @type {module:mongoose.Schema}
 */
export const TodoSchema = new Schema({
  done: {
    required: true,
    type: Boolean,
  },
  task: {
    required: true,
    type: String,
  },
  userId: {
    ref: "User",
    required: true,
    type: Schema.Types.ObjectId,
  },
}, schemaOptions);

TodoSchema.methods.getTableName = getTableName();

function getTableName(): string {
  return "todo";
}
