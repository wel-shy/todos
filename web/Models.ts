import mongoose = require("mongoose");
import {ITodo, TodoSchema} from "./schemas/Todo";
import { IUser, UserSchema } from "./schemas/User";

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

export function getModel(t: string): mongoose.Model<mongoose.Document> {
 switch (t) {
   case "todo":
     return mongoose.model<ITodo>(
       "Todo", TodoSchema,
     );
   case "user":
     return mongoose.model<IUser>(
       "User", UserSchema,
     );
   default:
     return null;
 }
}
