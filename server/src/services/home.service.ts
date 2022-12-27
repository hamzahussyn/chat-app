import { NextFunction, Request, Response } from "express";
import { ErrorHandler } from "../helpers/HttpExceptions";

export class HomeService {
  constructor() {}

  static getHome(request: Request, response: Response, next: NextFunction) {
    response.status(200).json({ message: "chat-app-api" });
  }
}
