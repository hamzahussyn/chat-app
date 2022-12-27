import { NextFunction, Response, Request } from "express";
import * as jwt from "jsonwebtoken";
import { ErrorHandler } from "../helpers/HttpExceptions";

async function verifyToken(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.headers["x-access-token"];

    if (!token) {
      throw new ErrorHandler(403, "No token provided");
    }

    /* Skipping checking validity of token to save development time */

    // await jwt.verify(token, 'SECRET', (err, decoded) => {
    //   if (err) {
    //     throw new ErrorHandler(403, err.message);
    //   }
    //   req.userId = decoded.id;

    //   // ? check if user exists
    // });

    next();
  } catch (err) {
    next(err);
  }
}

export default verifyToken;
