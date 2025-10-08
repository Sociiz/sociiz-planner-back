import { FastifyReply, FastifyRequest } from "fastify";
import { UserService } from "../services/UserServices";

export class AuthController {
  static async register(request: FastifyRequest, reply: FastifyReply) {
    const { email, password } = request.body as any;

    try {
      const user = await UserService.createUser({ email, password });
      const token = (request.server as any).jwt.sign({ id: user._id });
      return reply.send({ token });
    } catch (err: any) {
      return reply.status(400).send({ message: err.message });
    }
  }

  static async login(request: FastifyRequest, reply: FastifyReply) {
    const { email, password } = request.body as any;

    const user = await UserService.getUserByEmail(email);
    if (!user)
      return reply.status(400).send({ message: "Usuário não encontrado" });

    const valid = await import("bcryptjs").then((b) =>
      b.compare(password, user.password)
    );
    if (!valid) return reply.status(400).send({ message: "Senha Inválida" });

    const token = (request.server as any).jwt.sign(
      { id: user._id },
      { expiresIn: "1h" }
    );
    return reply.send({ token });
  }
}
