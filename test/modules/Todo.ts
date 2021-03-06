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
        });
    });

    it("Should return null when page options over max", (done) => {
      const options = {
        limit: 10,
        skip: 1000,
      };
      todoController.findManyWithFilter({userId: secondUser._id}, options)
        .then((todos: ITodo[]) => {
          expect(todos.length).to.equal(0);
          done();
        });
    });

    it("Should return todos matching page options", (done) => {
      const options = {
        limit: 10,
        skip: 0,
      };
      todoController.findManyWithFilter({userId: secondUser._id}, options)
        .then((todos: ITodo[]) => {
          expect(todos.length).to.be.greaterThan(0);
          expect(todos.length).to.be.lessThan(11);
          done();
        });
    })
  });

  describe("API", () => {
    let user: IUser;
    let token: string;
    let todo: ITodo;
    let randomTodo: ITodo;
    let archivedTodo: ITodo;

    before(async () => {
      user = await userController.store({
        iv: CryptoHelper.getRandomString(16),
        password: "secret",
        username: "tester-todo-api",
      });
      const todoData: any = {
        archived: true,
        done: true,
        task: "todo",
        userId: user._id,
      };

      archivedTodo = await todoController.store(todoData);
      randomTodo = await todoController.store({
        archived: false,
        done: false,
        task: "rand",
        userId: user._id,
      });

      token = authController.generateToken(user);
    });

    after(async () => {
      await userController.destroy(user._id);
      await todoController.destroy(archivedTodo._id);
      await todoController.destroy(randomTodo._id);
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
          res.data.payload.forEach((t: ITodo) => {
            expect(t.userId).to.equal(user._id.toString());
          });
          done();
        });
    });

    it("Should get all todos matching query", (done) => {
      axios.get(`${URLS.TEST}/todo?archived=true`, {
        headers: {
          "x-access-token": token,
        },
      })
        .then((res: AxiosResponse) => {
          expect(res.data.payload.length).to.be.greaterThan(0);
          res.data.payload.forEach((t: ITodo) => {
            expect(t.archived).to.equal(true);
          });
          done();
        });
    });

    it("Should get all todos matching page options", (done) => {
      axios.get(`${URLS.TEST}/todo/1/10`, {
        headers: {
          "x-access-token": token,
        },
      })
        .then((res: AxiosResponse) => {
          expect(res.data.payload.count).to.be.greaterThan(0);
          expect(res.data.payload.resources.length).to.be.lessThan(11);
          done();
        });
    });

    it("Should search for a todo matching term", (done) => {
      axios.get(`${URLS.TEST}/todo/search/task/rand`, {
        headers: {
          "x-access-token": token,
        },
      })
        .then((res: AxiosResponse) => {
          res.data.payload.forEach((result: ITodo) => {
            expect(result.task.indexOf("rand")).to.greaterThan(-1);
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
        archived: true,
        done: true,
        id: todo._id,
        task: "test todos",
      };

      axios.post(`${URLS.TEST}/todo/update`, todoData, {
        headers: {
          "x-access-token": token,
        },
      })
        .then((response: AxiosResponse) => {
          expect(response.data.payload.task).to.equal(todoData.task);
          expect(response.data.payload.done).to.equal(todoData.done);
          expect(response.data.payload.archived).to.equal(todoData.archived);
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
          todoController.get(todo._id).then((t: ITodo) => {
            expect(t).to.equal(null);
            done();
          });
        })
    });
  });
});
