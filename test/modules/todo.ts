import {expect} from "chai";
import {TodoController} from "../../web/controllers/todo";
import {UserController} from "../../web/controllers/user";
import {ITodo} from "../../web/schemas/todo";
import {IUser} from "../../web/schemas/user";

describe("todo", () => {
  describe("Controller", () => {
    const userController: UserController = new UserController();
    const todoController: TodoController = new TodoController();
    let user: IUser;
    let todo: ITodo;

    before(async () => {
      user = await userController.store({
        password: "secret",
        username: "tester-todo",
      });
    });

    it("Should create a todo item", (done) => {
      const todoData = {
        task: "test todo",
        userId: user._id,
      };
      todoController.store(todoData)
        .then((newTodo: ITodo) => {
          expect(newTodo.task).to.equal(todoData.task);
          todo = newTodo;
          done();
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
    });
  });
});
