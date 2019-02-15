import * as jwt from "jsonwebtoken";
import CryptoHelper from "../CryptoHelper";
import { IUser } from "../schemas/User";
import ControllerFactory from "./ControllerFactory";
import {IResourceController} from "./IResourceController";

const userController: IResourceController<IUser> = ControllerFactory.getController("user");

export class AuthController {
  public async authenticateUser(username: string, password: string): Promise<IUser> {
    let user: IUser;
    try {
      user = await userController.findOneWithFilter({username})
    } catch (error) {
      throw error;
    }

    if (!user) {
      throw new Error("401");
    }

    const hashedPassword: string = CryptoHelper.hashString(password, user.iv);

    // Compare passwords and abort if no match
    if (user.password !== hashedPassword) {
      throw new Error("401");
    }

    return user;
  }

  public generateToken(user: IUser): string {
    const payload = {
      id: user._id,
      username: user.username,
    };
    // create and sign token against the app secret
    return jwt.sign(payload, process.env.SECRET, {
      expiresIn: "1 day", // expires in 24 hours
    });
  }
}
