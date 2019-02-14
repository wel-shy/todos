import * as crypto from "crypto";
import { Schema } from "mongoose";
import models from "../models";
import { IUser } from "../schemas/user";
import { IResourceController } from "./base";

export class UserController implements IResourceController<IUser> {
  /**
   * Delete a user
   * @param {Schema.Types.ObjectId} id
   * @returns {Promise<void>}
   */
  public async destroy(id: Schema.Types.ObjectId): Promise<any> {
    return await models.User.deleteOne({ _id: id });
  }

  public edit(id: Schema.Types.ObjectId, data: any): Promise<IUser> {
    return undefined;
  }

  /**
   * Get a user.
   * @param {Schema.Types.ObjectId} id
   * @returns {Promise<IUser>}
   */
  public async get(id: Schema.Types.ObjectId): Promise<IUser> {
    return await models.User.findOne({ _id: id });
  }

  public async getByUsername(username: string): Promise<IUser> {
    return await models.User.findOne({ username })
  }

  public getAll(): Promise<IUser[]> {
    return undefined;
  }

  /**
   * Store the user.
   * @param {{username: string; password: string}} data
   * @returns {Promise<IUser>}
   */
  public async store(data: { username: string, password: string }): Promise<IUser> {
    let sUser: IUser;
    try {
      sUser = await models.User.findOne({ username: data.username });
    } catch (error) {
      error.message = "500";
      throw error;
    }

    if (sUser) {
      throw new Error("403");
    }

    let iv: string;
    const hash: crypto.Hash = crypto.createHash("sha256");
    iv = crypto.randomBytes(16).toString("hex");
    hash.update(`${iv}${data.password}`);
    const hashedPassword = hash.digest("hex");

    let user: IUser = null;

    try {
      user = await models.User.create({ iv, username: data.username, password: hashedPassword });
      await user.save();
    } catch (error) {
      error.message = "500";
      throw error;
    }

    return user;
  }
}
