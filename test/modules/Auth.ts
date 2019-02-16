import Axios, {AxiosError, AxiosResponse} from "axios";
import {expect} from "chai";
import {describe} from "mocha";
import ControllerFactory from "../../web/controllers/ControllerFactory";
import {IResourceController} from "../../web/controllers/IResourceController";
import CryptoHelper from "../../web/CryptoHelper";
import {IUser} from "../../web/schemas/User";
import {URLS} from "../../web/URLS";

describe("Auth", () => {
  let user: IUser;
  let token: string;
  const userController: IResourceController<IUser> = ControllerFactory.getController("user");

  after(async () => {
    await userController.destroy(user._id);
  });

  it("Should register a user and return a token", (done) => {
    const userData = {
      password: "secret",
      username: "tester",
    };

    Axios.post(`${URLS.TEST}/auth/register`, userData)
      .then((response: AxiosResponse) => {
        expect(response.data.payload.token).to.have.length.above(10);

        user = response.data.payload.user;
        token = response.data.payload.token;
        done()
      });
  });

  it("Should prevent the user from creating an account with an existing username", (done) => {
    const userData = {
      iv: CryptoHelper.getRandomString(16),
      password: "secret",
      username: "tester",
    };
    Axios.post(`${URLS.TEST}/auth/register`, userData)
      .then()
      .catch((error: AxiosError) => {
        expect(error.response.status).to.equal(403);
        done()
      })
  });

  it("Should return a JWT token", (done) => {
    const userData = {
      password: "secret",
      username: "tester",
    };
    Axios.post(`${URLS.TEST}/auth/authenticate`, userData).then((response: AxiosResponse) => {
      expect(response.data.payload.token).to.have.length.above(10);
      token = response.data.payload.token;
      done()
    });
  });

  it("Should reject request if invalid password is given", (done) => {
    const userData = {
      password: "password",
      username: "tester",
    };
    Axios.post(`${URLS.TEST}/auth/authenticate`, userData)
      .then()
      .catch((error: AxiosError) => {
        expect(error.response.status).to.equal(401);
        done()
      })
  });

  it("Should reject request if invalid username is given", (done) => {
    const userData = {
      password: "secret",
      username: "tester1",
    };
    Axios.post(`${URLS.TEST}/auth/authenticate`, userData)
      .then()
      .catch((error: AxiosError) => {
        expect(error.response.status).to.equal(401);
        done()
      })
  });
});
