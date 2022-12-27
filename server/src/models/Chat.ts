import { Document, model, ObjectId, Schema, Types } from "mongoose";
const { ObjectId } = Types;

export interface IChat extends Document {
  senderId: ObjectId;
  recieverId: ObjectId;
  body: string;
  createdAt: Number;
}

const chatSchema = new Schema<IChat>({
  senderId: { type: ObjectId, required: true },
  recieverId: { type: ObjectId, required: true },
  body: { type: String, required: true },
  createdAt: { type: Number, required: false },
});

chatSchema.pre("save", function (this: IChat, next: any) {
  this.createdAt = Date.now();
  next();
});

const ChatModel = model<IChat>("Chat", chatSchema);
export default ChatModel;
