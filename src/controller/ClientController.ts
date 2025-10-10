import { FastifyRequest, FastifyReply } from "fastify";
import { ClientService } from "../services/ClientService";

export class ClientController {
  static async create(req: FastifyRequest, reply: FastifyReply) {
    try {
      const client = await ClientService.createClient(req.body as any);
      reply.code(201).send(client);
    } catch (error) {
      reply.code(500).send({ message: "Erro ao criar cliente", error });
    }
  }

  static async getAll(req: FastifyRequest, reply: FastifyReply) {
    try {
      const clients = await ClientService.getAllClients();
      reply.send(clients);
    } catch (error) {
      reply.code(500).send({ message: "Erro ao listar clientes", error });
    }
  }

  static async getById(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = req.params as { id: string };
      const client = await ClientService.getClientById(id);
      if (!client)
        return reply.code(404).send({ message: "Cliente não encontrado" });
      reply.send(client);
    } catch (error) {
      reply.code(500).send({ message: "Erro ao buscar cliente", error });
    }
  }

  static async update(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = req.params as { id: string };
      const updated = await ClientService.updateClient(id, req.body as any);
      if (!updated)
        return reply.code(404).send({ message: "Cliente não encontrado" });
      reply.send(updated);
    } catch (error) {
      reply.code(500).send({ message: "Erro ao atualizar cliente", error });
    }
  }

  static async delete(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = req.params as { id: string };
      const deleted = await ClientService.deleteClient(id);
      if (!deleted)
        return reply.code(404).send({ message: "Cliente não encontrado" });
      reply.send({ message: "Cliente removido com sucesso" });
    } catch (error) {
      reply.code(500).send({ message: "Erro ao deletar cliente", error });
    }
  }
}
