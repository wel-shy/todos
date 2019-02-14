import mongoose = require("mongoose");
import { IUser, UserSchema } from "./schemas/user";
import {ITodo, TodoSchema} from "./schemas/todo";

/**
 * Create new object for each model using interface of model and schema
 */
export default {
  Todo: mongoose.model<ITodo>(
    "Todo", TodoSchema,
  ),
  User: mongoose.model<IUser>(
    "User", UserSchema,
  ),
};
