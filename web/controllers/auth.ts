import * as crypto from "crypto";
import * as jwt from "jsonwebtoken";
import { IUser } from "../schemas/user";
import { UserController } from "./user";

const userController: UserController = new UserController();

export class AuthController {
  public async authenticateUser(username: string, password: string): Promise<IUser> {
    let user: IUser;
    try {
      user = await userController.getByUsername(username);
    } catch (error) {
      throw error;
    }

    if (!user) {
      throw new Error("401");
    }

    // Hash given password with matching user's stored iv
    const hash: crypto.Hash = crypto.createHash("sha256");
    hash.update(`${user.iv}${password}`);
    const hashedPassword = hash.digest("hex");
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
