import {Schema} from "mongoose";
import {UserRoles} from "../UserRoles";
import IBaseMongoResource from "./IBaseMongoResource";

const schemaOptions = {
  timestamps: true,
};

/**
 * User interface extending the Mongoose.Document
 */
export interface IUser extends IBaseMongoResource {
  username: string;
  password: string;
  iv: string;
  role: UserRoles;
  createdAt: string;
  updatedAt: string;

  getTableName(): string;
}

/**
 * Model a user schema in the database
 * @type {module:mongoose.Schema}
 */
export const UserSchema = new Schema({
  iv: {
    required: true,
    type: String,
  },
  password: {
    required: true,
    type: String,
  },
  role: {
    default: UserRoles.USER,
    enum: [
      UserRoles.ADMIN,
      UserRoles.USER,
    ],
    type: String,
  },
  username: {
    index: true,
    required: true,
    type: String,
    unique: true,
  },
}, schemaOptions);

UserSchema.methods.getTableName = getTableName();

function getTableName(): string {
  return "user";
}
