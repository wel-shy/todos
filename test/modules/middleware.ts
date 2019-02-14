import Axios, {AxiosError} from "axios";
import {expect} from "chai";
import {describe} from "mocha";
import {AuthController} from "../../web/controllers/auth";
import {UserController} from "../../web/controllers/user";
import {IUser} from "../../web/schemas/user";
import {Urls} from "../../web/urls";

describe("Middleware", () => {
  let token: string;
  let user: IUser;
  const userController: UserController = new UserController();
  const authController: AuthController = new AuthController();

  before(async  () => {
    user = await userController.store({
      password: "secret",
      username: "tester-middleware",
    });

    token = authController.generateToken(user);
  });

  after( async () => {
    userController.destroy(user._id);
  });

  describe("Authentication", () => {
    describe("Require token", () => {
      it("Should reject request if no token is given", (done) => {
        Axios.get(`${Urls.TEST}/user/me`).then()
          .catch((error) => {
            expect(error.response.status).to.equal(401);
            done()
          })
      })
    });

    describe("Check token is valid", () => {
      it("Should reject request if the token is invalid", (done) => {
        const invToken = `${token}0`;
        Axios.get(`${Urls.TEST}/user/me`, {headers: {"x-access-token": invToken}})
          .then()
          .catch((error: AxiosError) => {
            expect(error.response.status).to.equal(401);
            done()
          })
      })
    })
  })
});
