import axios, {AxiosError, AxiosResponse} from "axios";
import {expect} from "chai";
import {describe} from "mocha";
import {AuthController} from "../../web/controllers/AuthController";
import ControllerFactory from "../../web/controllers/ControllerFactory";
import {IResourceController} from "../../web/controllers/IResourceController";
import CryptoHelper from "../../web/CryptoHelper";
import {IUser} from "../../web/schemas/User";
import {URLS} from "../../web/URLS";
import {ITodo} from "../../web/schemas/Todo";
import {UserRoles} from "../../web/UserRoles";

describe("Middleware", () => {
  let token: string;
  let token2: string;
  let adminToken: string;
  let user: IUser;
  let user2: IUser;
  let admin: IUser;
  let todoU1: ITodo;
  let todoU2: ITodo;
  const userController: IResourceController<IUser> = ControllerFactory.getController("user");
  const todoController: IResourceController<ITodo> = ControllerFactory.getController("todo");
  const authController: AuthController = new AuthController();

  before(async  () => {
    user = await userController.store({
      iv: CryptoHelper.getRandomString(16),
      password: "secret",
      username: "tester-middleware",
    });

    user2 = await userController.store({
      iv: CryptoHelper.getRandomString(16),
      password: "secret",
      username: "tester-middleware-2",
    });
    const adminData = {
      iv: CryptoHelper.getRandomString(16),
      password: "secret",
      username: "admin",
      role: UserRoles.ADMIN
    };

    admin = await userController.store(adminData);

    todoU1 = await todoController.store({
      task: "todo",
      done: false,
      userId: user._id,
    });

    todoU2 = await todoController.store({
      task: "todo",
      done: false,
      userId: user2._id,
    });

    token = authController.generateToken(user);
    token2 = authController.generateToken(user2);
    adminToken = authController.generateToken(admin);
  });

  after( async () => {
    await userController.destroy(user._id);
    await userController.destroy(user2._id);
    await userController.destroy(admin._id);

    await todoController.destroy(todoU1._id);
    await todoController.destroy(todoU2._id);
  });

  describe("Authorization", () => {
    it("Should reject request if no token is given", (done) => {
      axios.get(`${URLS.TEST}/user/`).then()
        .catch((error) => {
          expect(error.response.status).to.equal(401);
          done()
        });
    });

    it("Should reject request if the token is invalid", (done) => {
      const invToken = `${token}0`;
      axios.get(`${URLS.TEST}/user/`, {headers: {"x-access-token": invToken}})
        .then()
        .catch((error: AxiosError) => {
          expect(error.response.status).to.equal(401);
          done()
        });
    });

    it("Should reject if resource belongs to someone else", (done) => {
      axios.get(`${URLS.TEST}/todo?id=${todoU1._id}`, {
        headers: {
          "x-access-token": token2,
        },
      })
        .then((res: AxiosResponse) => {
          console.log(res.data);
        })
        .catch((error: AxiosError) => {
          expect(error.response.status).to.equal(403);
          done()
        });
    });

    it("Should allow updating another's resource for admins", (done) => {
      axios.get(`${URLS.TEST}/todo/${todoU1._id}`, {
        headers: {
          "x-access-token": adminToken,
        },
      })
        .then((res: AxiosResponse) => {
          expect(res.status).to.equal(200);
          done()
        })
    });
  });
});
