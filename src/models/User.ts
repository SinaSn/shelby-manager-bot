import mongoose, { Document, Schema, Types } from "mongoose";

export interface IUser extends Document {
  userId: number;
  chatId: number;
  firstName: string;
  lastName: string;
  username: string;
  warnCount: number;
  createdAt: Date,
}

const UserSchema: Schema = new Schema({
  userId: { type: Number, required: true },
  chatId: { type: Number, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: false },
  username: { type: String, required: false },
  warnCount: { type: Number, required: true },
  createdAt: { type: Date, required: true },
});

const User = mongoose.model<IUser>("User", UserSchema);
export default User;
