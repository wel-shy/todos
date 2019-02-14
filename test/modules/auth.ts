import Axios, {AxiosError, AxiosResponse} from "axios";
import {expect} from "chai";
import {describe} from "mocha";
import {Urls} from "../../web/urls";
import {UserController} from "../../web/controllers/user";
import {IUser} from "../../web/schemas/user";

describe("Auth", () => {
  let user: IUser;
  let token: string;
  const userController: UserController = new UserController();

  after(async () => {
    await userController.destroy(user._id);
  });

  describe("Register", () => {
    it("Should register a user and return a token", (done) => {
      const userData = {
        password: "secret",
        username: "tester",
      };

      Axios.post(`${Urls.TEST}/auth/register`, userData)
        .then((response: AxiosResponse) => {
          expect(response.data.payload.token).to.have.length.above(10);

          user = response.data.payload.user;
          token = response.data.payload.token;
          done()
      })
    })
  });

  describe("Rejects creating existing account", () => {
    it("Should prevent the user from creating an account with an existing username", (done) => {
      const userData = {
        password: "secret",
        username: "tester",
      };
      Axios.post(`${Urls.TEST}/auth/register`, userData)
        .then()
        .catch((error: AxiosError) => {
          expect(error.response.status).to.equal(403);
          done()
        })
    })
  });

  describe("Authenticate", () => {
    it("Should return a JWT token", (done) => {
      const userData = {
        password: "secret",
        username: "tester",
      };
      Axios.post(`${Urls.TEST}/auth/authenticate`, userData).then((response: AxiosResponse) => {
        expect(response.data.payload.token).to.have.length.above(10);
        token = response.data.payload.token;
        done()
      })
    })
  });

  describe("Reject incorrect password", () => {
    it("Should reject request if invalid password is given", (done) => {
      const userData = {
        password: "password",
        username: "tester",
      };
      Axios.post(`${Urls.TEST}/auth/authenticate`, userData)
        .then()
        .catch((error: AxiosError) => {
          expect(error.response.status).to.equal(401);
          done()
        })
    })
  });

  describe("Reject incorrect username", () => {
    it("Should reject request if invalid username is given", (done) => {
      const userData = {
        password: "secret",
        username: "tester1",
      };
      Axios.post(`${Urls.TEST}/auth/authenticate`, userData)
        .then()
        .catch((error: AxiosError) => {
          expect(error.response.status).to.equal(401);
          done()
        })
    })
  })
});
