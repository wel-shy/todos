import { Document, Schema } from "mongoose";

const schemaOptions = {
  timestamps: true,
};

/**
 * User interface extending the Mongoose.Document
 */
export interface IUser extends Document {
  username: string;
  password: string;
  iv: string;
  createdAt: string;
  updatedAt: string;
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
  username: {
    index: true,
    required: true,
    type: String,
    unique: true,
  },
}, schemaOptions);
