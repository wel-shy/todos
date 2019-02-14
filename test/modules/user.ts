import Axios, {AxiosResponse} from "axios";
import {expect} from "chai";
import {describe} from "mocha";
import {AuthController} from "../../web/controllers/auth";
import {UserController} from "../../web/controllers/user";
import {IUser} from "../../web/schemas/user";
import {Urls} from "../../web/urls";

describe("User", () => {
  const userController: UserController = new UserController();

  describe("Controller", () => {
    let user: IUser;

    describe("Store", () => {
      it("Should store a user's profile",(done) => {
        const userData = {
          password: "secret",
          username: "test-user",
        };

        userController.store(userData)
          .then((storedUser) => {
            expect(storedUser.username).to.equal(userData.username);
            user = storedUser;
            done();
          });
      })
    });

    describe("Should get user", () => {
      it("Should fetch a user's profile",(done) => {
        userController.get(user._id)
          .then((stored) => {
            expect(stored.username.length).to.be.greaterThan(0);
            expect(stored.password.length).to.be.greaterThan(0);
            done();
          });
      })
    });

    describe("Destroy", () => {
      it("Should destroy the user",(done) => {
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
  });

  describe("API", () => {
    const authController: AuthController = new AuthController();
    let user: IUser;
    let token: string;

    before(async () => {
      user = await userController.store({
        password: "secret",
        username: "tester-user",
      });

      token = authController.generateToken(user);
    });

    after( async () => {
      userController.destroy(user._id);
    });

    describe("Profile", () => {
      it("Should return the users information", (done) => {
        Axios.get(`${Urls.TEST}/user/me`, {headers: {"x-access-token": token}})
          .then((response: AxiosResponse) => {
            expect(response.data.payload.user.username).to.equal(user.username);
            done()
          })
      })
    });

    describe("Destroy", () => {
      it("Should delete users profile", (done) => {
        Axios.delete(`${Urls.TEST}/user/destroy`, {headers: {"x-access-token": token}})
          .then((response: AxiosResponse) => {
            expect(response.status).to.equal(200);
            done()
          })
      })
    })
  });
});
