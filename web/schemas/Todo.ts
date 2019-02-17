import { Schema } from "mongoose";
import IBaseMongoResource from "./IBaseMongoResource";

const schemaOptions = {
  timestamps: true,
};

/**
 * User interface extending the Mongoose.Document
 */
export interface ITodo extends IBaseMongoResource {
  task: string;
  done: boolean;
  archived: boolean;
  userId: Schema.Types.ObjectId,
  createdAt: string;
  updatedAt: string;

  getTableName(): string;
  getUserId(): Schema.Types.ObjectId;
}

/**
 * Model a user schema in the database
 * @type {module:mongoose.Schema}
 */
export const TodoSchema = new Schema({
  archived: {
    default: false,
    required: true,
    type: Boolean,
  },
  done: {
    default: false,
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
TodoSchema.methods.getUserId = function(): Schema.Types.ObjectId {
  return this.userId;
};

function getTableName(): string {
  return "todo";
}
