import { FastifyReply, FastifyRequest } from "fastify";
import { UserService } from "../services/UserServices";

export class UserController {
  static async getAll(request: FastifyRequest, reply: FastifyReply) {
    const users = await UserService.listUsers();
    return reply.send(users);
  }

  static async create(request: FastifyRequest, reply: FastifyReply) {
    const { email, password, username } = request.body as any;
    try {
      const user = await UserService.createUser({ email, password, username });
      return reply.status(201).send(user);
    } catch (err: any) {
      return reply.status(400).send({ message: err.message });
    }
  }

  static async getOne(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as any;
    const user = await UserService.getUserById(id);
    if (!user)
      return reply.status(404).send({ message: "Usuário não encontrado" });
    return reply.send(user);
  }

  static async update(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as any;
    const data = request.body as any;

    const user = await UserService.updateUser(id, data);
    if (!user)
      return reply.status(404).send({ message: "Usuário não encontrado" });
    return reply.send(user);
  }

  static async delete(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as any;
    const user = await UserService.deleteUser(id);
    if (!user)
      return reply.status(404).send({ message: "Usuário não encontrado" });
    return reply.send({ message: "Usuário deletado com sucesso" });
  }
}
