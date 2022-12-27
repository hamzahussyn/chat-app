import * as express from "express";
import * as http from "http";
import * as cors from "cors";
import { handleError } from "./helpers/HttpExceptions";
import { HomeController } from "./controllers/home.controller";
import { UserController } from "./controllers/user.controller";
import mongoose from "mongoose";
import { Sockets } from "./sockets";

// Mongodb connection
mongoose.set("strictQuery", true);
mongoose.connect("mongodb://127.0.0.1:27017/chat-app", {}, () =>
  console.log("[mongoose]: connection established to mongoDB.")
);

// Controllers
const homeController = new HomeController();
const userController = new UserController();

// Middleware
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,content-type,Accept,Authorization,x-access-token"
  );
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});
app.use("/", homeController.getRoutes());
app.use("/user", userController.getRoutes());

app.use((err, req, res, next) => handleError(err, res));

// Server
const server = http.createServer(app);

// Sockets
const sockets = new Sockets(server);
sockets.init();
sockets.eventsInit();

// Server Init
server.listen(3000, () => {
  console.log(
    "[server]: dev-server is listening on port:3000. http://localhost:3000"
  );
});
