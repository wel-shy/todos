import axios, {AxiosResponse} from "axios";
import {expect} from "chai";
import {Schema} from "mongoose";
import {AuthController} from "../../web/controllers/AuthController";
import ControllerFactory from "../../web/controllers/ControllerFactory";
import {IResourceController} from "../../web/controllers/IResourceController";
import CryptoHelper from "../../web/CryptoHelper";
import {ITodo} from "../../web/schemas/Todo";
import {IUser} from "../../web/schemas/User";
import {URLS} from "../../web/URLS";

describe("todo", () => {
  const userController: IResourceController<IUser> = ControllerFactory.getController("user");
  const todoController: IResourceController<ITodo> = ControllerFactory.getController("todo");
  const authController: AuthController = new AuthController();

  describe("Controller", () => {
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

  describe("API", () => {
    let user: IUser;
    let token: string;
    let todo: ITodo;

    before(async () => {
      user = await userController.store({
        iv: CryptoHelper.getRandomString(16),
        password: "secret",
        username: "tester-todo-api",
      });

      token = authController.generateToken(user);
    });

    after(async () => {
      await userController.destroy(user._id);
    });

    it("Should store a todo item", (done) => {
      const todoData = {
        done: false,
        task: "test todos",
      };

      axios.post(`${URLS.TEST}/todo/`, todoData, {
        headers: {
          "x-access-token": token,
        },
      })
        .then((response: AxiosResponse) => {
          expect(response.data.payload.task).to.equal(todoData.task);
          todo = response.data.payload;
          done();
        })
    });

    it("Should get all todos", (done) => {
      axios.get(`${URLS.TEST}/todo`, {
        headers: {
          "x-access-token": token,
        },
      })
        .then((res: AxiosResponse) => {
          res.data.payload.forEach((todo: ITodo) => {
            expect(todo.userId).to.equal(user._id.toString());
          });
          done();
        });
    });

    it("Should get a todo by id", (done) => {
      axios.get(`${URLS.TEST}/todo/${todo._id}`, {
        headers: {
          "x-access-token": token,
        },
      })
        .then((res: AxiosResponse) => {
          expect(res.data.payload._id).to.equal(todo._id);
          done();
        });
    });

    it("Should update a todo item", (done) => {
      const todoData = {
        done: true,
        task: "test todos",
        id: todo._id,
      };

      axios.post(`${URLS.TEST}/todo/update`, todoData, {
        headers: {
          "x-access-token": token,
        },
      })
        .then((response: AxiosResponse) => {
          expect(response.data.payload.task).to.equal(todoData.task);
          expect(response.data.payload.done).to.equal(todoData.done);
          todo = response.data.payload;
          done();
        })
    });

    it("Should delete a todo item", (done) => {
      axios.delete(`${URLS.TEST}/todo/${todo._id}`, {
        headers: {
          "x-access-token": token,
        },
      })
        .then(() => {
          todoController.get(todo._id).then((todo: ITodo) => {
            expect(todo).to.equal(null);
            done();
          });
        })
    });
  });
});
