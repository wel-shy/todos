// For the home routes.
import Axios, {AxiosResponse} from "axios";
import {expect} from "chai";
import {describe} from "mocha";

describe("Home", () => {
  // Test the landing page renders
  describe("Render", () => {
    it("Should return the home page from '/'", (done) => {
      Axios.get(`http://localhost:8888/`).then((response: AxiosResponse) => {
        expect(response.status).to.equal(200);
        done()
      })
    })
  })
});
