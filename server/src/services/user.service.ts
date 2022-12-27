import { NextFunction, Request, Response } from "express";
import { ErrorHandler } from "../helpers/HttpExceptions";
import { Security } from "../helpers/Security";
import UserModel, { IUser } from "../models/User";
import * as jwt from "jsonwebtoken";
import JWTTokenModel from "../models/Token";

export class UserService {
  constructor() {}

  public static async registerUser(
    body: IUser,
    response: Response,
    next: NextFunction
  ) {
    try {
      const UserFound = await UserModel.findOne({ email: body.email });

      if (UserFound) {
        response.status(200).json({
          message: "A user already exists with this email.",
          loading: false,
        });
        return;
      }

      const hashedPassword = await Security.hashPassword(body.password);

      const User = new UserModel({
        firstName: body.firstName,
        lastName: body.lastName,
        age: 25,
        email: body.email,
        password: hashedPassword,
      });
      const UserCreated = await User.save();
      response
        .status(201)
        .json({ message: "Account created successfully.", loading: false });
    } catch (error) {
      next(error);
    }
  }

  public static async login(
    body: { email: string; password: string },
    response: Response,
    next: NextFunction
  ) {
    try {
      const User = await UserModel.findOne({ email: body.email });
      if (!User || !Security.comparePasswords(body.password, User.password)) {
        throw new ErrorHandler(
          401,
          "Either the email or password is incorrect."
        );
      }
      const token = Security.createToken(User._id.toString());
      const JWT = new JWTTokenModel({ token, user: User._id });
      await JWT.save();

      // Add a refresh token as well, if enough time.

      response.status(200).json({
        message: "success",
        data: { token: token, user: User },
        loading: false,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async search(
    query: any,
    response: Response,
    next: NextFunction
  ) {
    try {
      if (!query.q.length) {
        const Users = await UserModel.find({ _id: { $ne: query.id } });
        return response
          .status(200)
          .json({ data: { users: Users }, message: "users listing." });
      }

      const Users = await UserModel.find({
        $or: [
          { firstName: { $regex: query.q, $options: "i" } },
          { lastName: { $regex: query.q, $options: "i" } },
        ],
        _id: { $ne: query.id },
      });
      response
        .status(200)
        .json({ data: { users: Users }, message: "users listing." });
    } catch (error) {
      next(error);
    }
  }
}
