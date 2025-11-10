import mongoose, { Schema, Document, models } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  score: number;
}

const UserSchema = new Schema<IUser>({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  score: { type: Number, default: 0 },
});

export default models.User || mongoose.model<IUser>("User", UserSchema);
