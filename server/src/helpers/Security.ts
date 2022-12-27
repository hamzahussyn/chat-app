import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";

export class Security {
  constructor() {}

  static async hashPassword(password: string): Promise<string> {
    const saltRounds = 5;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    return hashedPassword;
  }

  static comparePasswords(userPassword: string, dbPassword: string) {
    console.log(userPassword);
    console.log(dbPassword);
    const passwordMatch = bcrypt.compareSync(userPassword, dbPassword);
    console.log(passwordMatch);
    return passwordMatch;
  }

  static createToken(userId) {
    const token = jwt.sign({ id: userId }, "this is some sec", {
      expiresIn: "24h",
    });
    return token;
  }
}
