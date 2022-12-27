import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  age: number;
  email: string;
  password: string;
}

const userSchema = new Schema<IUser>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  age: { type: Number, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
});

const UserModel = model<IUser>("User", userSchema);

export default UserModel;
