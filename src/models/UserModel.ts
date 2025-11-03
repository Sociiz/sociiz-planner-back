import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser {
  username: string;
  email: string;
  password: string;
  isAdmin: boolean;
  isColaborador: boolean;
}

const UserSchema = new Schema<IUser>({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false }, // flag nova pra eu saber quando é admin ou não
  isColaborador: { type: Boolean, default: false }, // flag nova pra eu saber quando é colaborador ou não
});

// Hash da senha
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

export const User = model<IUser>("User", UserSchema, "Usuários");
