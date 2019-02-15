import {expect} from "chai";
import {Schema} from "mongoose";
import ControllerFactory from "../../web/controllers/ControllerFactory";
import {IResourceController} from "../../web/controllers/IResourceController";
import CryptoHelper from "../../web/CryptoHelper";
import {ITodo} from "../../web/schemas/Todo";
import {IUser} from "../../web/schemas/User";

describe("todo", () => {
  describe("Controller", () => {
    const userController: IResourceController<IUser> = ControllerFactory.getController("user");
    const todoController: IResourceController<ITodo> = ControllerFactory.getController("todo");
    let user: IUser;
    let secondUser: IUser;
    let todo: ITodo;
    let secondTodo: ITodo;
    let updateTodo: ITodo;
    let updateTodoData: any = {
      done: false,
      task: "test todo",
      userId: new Schema.Types.ObjectId(""),
    };

    before(async () => {
      user = await userController.store({
        iv: CryptoHelper.getRandomString(16),
        password: "secret",
        username: "tester-todo",
      });

      secondUser = await userController.store({
        iv: CryptoHelper.getRandomString(16),
        password: "secret",
        username: "tester-todo-2",
      });

      updateTodoData.userId = user._id;
      updateTodo = await todoController.store(updateTodoData);

      updateTodoData.userId = secondUser._id;
      secondTodo = await todoController.store(updateTodoData);
    });

    after(async () => {
      await userController.destroy(user._id);
      await userController.destroy(secondUser._id);
      await todoController.destroy(updateTodo._id);
      await todoController.destroy(secondTodo._id);
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
    });

    it("Should get a todo item", (done) => {
      todoController.get(todo._id)
        .then((t: ITodo) => {
          expect(t.task).to.equal(todo.task);
          done();
        })
    });

    it("Should get all todo items", (done) => {
      todoController.getAll()
        .then((todos: ITodo[]) => {
          expect(todos.length).to.be.greaterThan(0);
          done();
        })
    });

    it("Should update todo item", (done) => {
      updateTodoData = {
        done: true,
      };

      todoController.edit(updateTodo._id, updateTodoData)
        .then((newTodo: ITodo) => {
          expect(newTodo.done).to.equal(true);
          expect(newTodo.task).to.equal("test todo");
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

    it("Should fetch only the users todos", (done) => {
      todoController.findManyWithFilter({userId: secondUser._id})
        .then((todos: ITodo[]) => {
          todos.forEach((t) => {
            expect(t.userId.toString()).to.equal(secondUser._id.toString());
          });
          done();
        })
    })
  });
});
