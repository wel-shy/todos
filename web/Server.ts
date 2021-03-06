import * as bodyParser from "body-parser";
import * as cors from "cors";
import * as dotenv from "dotenv";
import * as express from "express";
import * as mongoose from "mongoose";
import * as path from "path";
import * as handler from "./middleware/ErrorHandler";
import addRoutes from "./routes/Index";

// Load environment variables
dotenv.load();

/**
 * An application holding an express server and methods for initialisation
 */
export class App {
  public express: express.Express;

  /**
   * Connect to mongodb, then add routes and middleware
   */
  constructor() {
    this.express = express();

    // Connect to database
    mongoose.connect(process.env.MONGO_URI);

    this.prepareStatic();
    this.setBodyParser();
    this.addCors();
    this.setAppSecret();
    this.addRoutes(this.express);
    this.setErrorHandler();
  }

  /**
   * Set static directory
   */
  private prepareStatic(): void {
    this.express.use(express.static(path.join(__dirname, "/../static/")));
  }

  /**
   * Add routes to app
   * @param {e.Express} app
   */
  private addRoutes(app: express.Express): void {
    this.express = addRoutes(app);
  }

  /**
   * Set body parser for post requests
   */
  private setBodyParser(): void {
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({
      extended: true,
    }));
  }

  /**
   * Add cors
   */
  private addCors(): void {
    this.express.use(cors());
    this.express.options("*", cors());
  }

  /**
   * Set the application secret
   */
  private setAppSecret(): void {
    this.express.set("secret", process.env.SECRET);
  }

  /**
   * Set error handler as last middleware
   */
  private setErrorHandler(): void {
    this.express.use(handler.handleResponse);
  }
}
