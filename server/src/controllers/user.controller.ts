import * as express from "express";
import { NextFunction, Request, Response, Router } from "express";
import verifyToken from "../middleware/verifyToken";
import { UserService } from "../services/user.service";

export class UserController {
  private readonly controller: Router;

  constructor() {
    this.controller = express.Router();
    this.controller.post("/register", this.registerUser);
    this.controller.post("/login", this.login);
    this.controller.get("/search", [verifyToken], this.search);
  }

  public getRoutes() {
    return this.controller;
  }

  private async registerUser(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    return await UserService.registerUser(request.body, response, next);
  }

  private async login(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    return await UserService.login(request.body, response, next);
  }

  private async search(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    // console.log(request.query);
    return await UserService.search(request.query, response, next);
  }
}
