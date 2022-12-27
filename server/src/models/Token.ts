import { Schema, model, Types, ObjectId } from "mongoose";
const { ObjectId } = Types;

export interface IJWTToken {
  token: string;
  user: ObjectId;
}

const JWTTokenSchema = new Schema<IJWTToken>({
  token: { type: String, required: true },
  user: { type: ObjectId, required: true },
});

const JWTTokenModel = model<IJWTToken>('Token', JWTTokenSchema);

export default JWTTokenModel;