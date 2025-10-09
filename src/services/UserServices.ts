import { User, IUser } from "../models/UserModel";
import bcrypt from "bcryptjs";

export class UserService {
  static async createUser(data: {
    email: string;
    password: string;
    username: string;
  }) {
    const exists = await User.findOne({ email: data.email });
    if (exists) throw new Error("Email já existe");

    const user = new User(data);
    await user.save();
    return user;
  }

  static async getUserByEmail(email: string) {
    return User.findOne({ email });
  }

  static async getUserById(id: string) {
    return User.findById(id);
  }

  static async updateUser(id: string, data: Partial<IUser>) {
    if (data.password) {
      const salt = await bcrypt.genSalt(10);
      data.password = await bcrypt.hash(data.password, salt);
    }
    return User.findByIdAndUpdate(id, data, { new: true });
  }

  static async deleteUser(id: string) {
    return User.findByIdAndDelete(id);
  }

  static async listUsers() {
    return User.find();
  }
}
