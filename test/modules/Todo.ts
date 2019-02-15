import {expect} from "chai";
import ControllerFactory from "../../web/controllers/ControllerFactory";
import {IResourceController} from "../../web/controllers/IResourceController";
import {ITodo} from "../../web/schemas/Todo";
import {IUser} from "../../web/schemas/User";
import CryptoHelper from "../../web/CryptoHelper";

describe("todo", () => {
  describe("Controller", () => {
    const userController: IResourceController<IUser> = ControllerFactory.getController("user");
    const todoController: IResourceController<ITodo> = ControllerFactory.getController("todo");
    let user: IUser;
    let todo: ITodo;

    before(async () => {
      user = await userController.store({
        iv: CryptoHelper.getRandomString(16),
        password: "secret",
        username: "tester-todo",
      });
    });

    after(async () => {
      userController.destroy(user._id);
    });

    it("Should create a todo item", (done) => {
      const todoData = {
        done: false,
        task: "test todo",
        userId: user._id,
      };
      todoController.store(todoData)
        .then((newTodo: ITodo) => {
          expect(newTodo.task).to.equal(todoData.task);
          todo = newTodo;
          done();
        })
        .catch((e) => {
          console.error(e);
        })
    });

    it("Should delete a todo item", (done) => {
      todoController.destroy(todo._id)
        .then(() => {
          todoController.get(todo._id)
            .then((oldTodo: ITodo) => {
              expect(oldTodo).to.equal(null);
              done();
            });
        })
        .catch((e) => {
          console.error(e);
        })
    });
  });
});
