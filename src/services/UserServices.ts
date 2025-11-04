import { User, IUser } from "../models/UserModel";
import bcrypt from "bcryptjs";

export class UserService {
  static async findByEmail(email: string) {
    return User.findOne({ email });
  }

  // atualiza a senha nova daquele usuario
  static async updatePassword(id: string, novaSenha: string) {
    const hash = await bcrypt.hash(novaSenha, 10);
    await User.findByIdAndUpdate(id, { password: hash });
  }

  // validar login de acordo com mudança de senha agora
  static async validateLogin(email: string, password: string) {
    const user = await User.findOne({ email });
    if (!user) return null;

    const match = await bcrypt.compare(password, user.password);
    if (!match) return null;

    return user;
  }

  // novo usario com hash de senha, e verifica se tem email já registrado
  static async createUser(data: {
    email: string;
    password: string;
    username: string;
    isAdmin: boolean;
    isColaborador: boolean;
  }) {
    const exists = await User.findOne({ email: data.email });
    if (exists) throw new Error("Email já existe");

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);

    const user = new User({
      ...data,
      password: hashedPassword,
    });

    await user.save();
    return user;
  }

  // usuario por email
  static async getUserByEmail(email: string) {
    return User.findOne({ email });
  }

  // usuario por id
  static async getUserById(id: string) {
    return User.findById(id);
  }

  // ao atualizar usuario faço hash da nova senha
  static async updateUser(id: string, data: Partial<IUser>) {
    if (data.password) {
      const salt = await bcrypt.genSalt(10);
      data.password = await bcrypt.hash(data.password, salt);
    }
    return User.findByIdAndUpdate(id, data, { new: true });
  }

  // excluir usuario
  static async deleteUser(id: string) {
    return User.findByIdAndDelete(id);
  }

  // listar todos usuarios
  static async listUsers() {
    return User.find();
  }
}
