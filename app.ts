import { App } from "./web/server";

// Set the port, default to 80
const port = process.env.PORT || 80;
const app = new App();

// Start listening for requests
app.express.listen(port, (err: Error) => {
  if (err) {
    console.error(err)
  } else {
    console.log(`server is listening on ${port}`)
  }
});
