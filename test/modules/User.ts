import Axios, {AxiosResponse} from "axios";
import {expect} from "chai";
import {describe} from "mocha";
import {AuthController} from "../../web/controllers/AuthController";
import ControllerFactory from "../../web/controllers/ControllerFactory";
import {IResourceController} from "../../web/controllers/IResourceController";
import CryptoHelper from "../../web/CryptoHelper";
import {IUser} from "../../web/schemas/User";
import {URLS} from "../../web/URLS";

describe("User", () => {
  const userController: IResourceController<IUser> = ControllerFactory.getController("user");

  describe("Controller", () => {
    let user: IUser;

    it("Should store a user's profile", (done) => {
      const userData = {
        iv: CryptoHelper.getRandomString(16),
        password: "secret",
        username: "test-user",
      };

      userController.store(userData)
        .then((storedUser) => {
          expect(storedUser.username).to.equal(userData.username);
          user = storedUser;
          done();
        });
    });

    it("Should fetch a user's profile", (done) => {
      userController.get(user._id)
        .then((stored) => {
          expect(stored.username.length).to.be.greaterThan(0);
          expect(stored.password.length).to.be.greaterThan(0);
          done();
        });
    });

    it("Should destroy the user", (done) => {
      userController.destroy(user._id)
        .then(() => {
          userController.get(user._id)
            .then((storedUser) => {
              expect(storedUser).to.equal(null);
              done();
            })
        });
    });
  });

  describe("API", () => {
    const authController: AuthController = new AuthController();
    let user: IUser;
    let token: string;
    const iv: string = CryptoHelper.getRandomString(16);

    before(async () => {
      user = await userController.store({
        iv,
        password: "secret",
        username: "tester-user",
      });

      token = authController.generateToken(user);
    });

    after( async () => {
      userController.destroy(user._id);
    });

    it("Should return the users information", (done) => {
      Axios.get(`${URLS.TEST}/user/me`, {headers: {"x-access-token": token}})
        .then((response: AxiosResponse) => {
          expect(response.data.payload.user.username).to.equal(user.username);
          done()
        });
    });

    it("Should delete users profile", (done) => {
      Axios.delete(`${URLS.TEST}/user/destroy`, {headers: {"x-access-token": token}})
        .then((response: AxiosResponse) => {
          expect(response.status).to.equal(200);
          done()
        });
    });
  });
});
