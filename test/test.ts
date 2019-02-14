import Axios, {AxiosError, AxiosResponse} from "axios";
import {expect} from "chai";
import {Server} from "http";
import {describe} from "mocha";
import {App} from "../web/server";

let server: Server;
const URL: string = "http://localhost:8888";
let token: string;

describe("api", () => {
  // let server = null
  before(() => {
    const port: number = 8888;
    process.env.TEST = "true";

    try {
      server = new App().express.listen(port)
    } catch (e) {
      console.error(e)
    }
  });

  after(async () => {
    await server.close()
  });

  // For the home routes.
  describe("Home", () => {
    // Test the landing page renders
    describe("Render", () => {
      it("Should return the home page from '/'", (done) => {
        Axios.get(`${URL}/`).then((response: AxiosResponse) => {
          expect(response.status).to.equal(200)
          done()
        })
      })
    })
  })

  describe("Auth", () => {
    describe("Register", () => {
      it("Should register a user and return a token", (done) => {
        const userData = {
          password: "secret",
          username: "tester",
        };
        Axios.post(`${URL}/api/auth/register`, userData).then((response: AxiosResponse) => {
          expect(response.data.payload.token).to.have.length.above(10);
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
        Axios.post(`${URL}/api/auth/register`, userData)
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
        Axios.post(`${URL}/api/auth/authenticate`, userData).then((response: AxiosResponse) => {
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
        Axios.post(`${URL}/api/auth/authenticate`, userData)
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
        Axios.post(`${URL}/api/auth/authenticate`, userData)
          .then()
          .catch((error: AxiosError) => {
            expect(error.response.status).to.equal(401);
            done()
        })
      })
    })
  });

  describe("Middleware", () => {
    describe("Authentication", () => {
      describe("Require token", () => {
        it("Should reject request if no token is given", (done) => {
          Axios.get(`${URL}/api/user/me`).then()
            .catch((error) => {
            expect(error.response.status).to.equal(401);
            done()
          })
        })
      });

      describe("Check token is valid", () => {
        it("Should reject request if the token is invalid", (done) => {
          const invToken = `${token}0`;
          Axios.get(`${URL}/api/user/me`, {headers: {"x-access-token": invToken}})
            .then()
            .catch((error: AxiosError) => {
              expect(error.response.status).to.equal(401);
              done()
            })
        })
      })
    })
  });

  describe("User", () => {
    describe("Profile", () => {
      it("Should return the users information", (done) => {
        Axios.get(`${URL}/api/user/me`, {headers: {"x-access-token": token}})
          .then((response: AxiosResponse) => {
            expect(response.data.payload.user.username).to.equal("tester");
            done()
        })
      })
    });

    describe("Destroy", () => {
      it("Should delete users profile", (done) => {
        Axios.delete(`${URL}/api/user/destroy`, {headers: {"x-access-token": token}})
          .then((response: AxiosResponse) => {
            expect(response.status).to.equal(200)
            done()
        })
      })
    })
  })
});
