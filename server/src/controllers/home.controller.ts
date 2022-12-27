import * as express from "express";
import { NextFunction, Request, Response, Router } from "express";
import { ErrorHandler } from "../helpers/HttpExceptions";
import { HomeService } from "../services/home.service";

export class HomeController {
  private readonly controller: Router;

  constructor() {
    this.controller = express.Router();
    this.controller.get("/", this.getHomeRouter);
  }

  public getRoutes() {
    return this.controller;
  }

  private getHomeRouter(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    return HomeService.getHome(request, response, next);
  }
}
