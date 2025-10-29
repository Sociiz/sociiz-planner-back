import { FastifyRequest, FastifyReply } from "fastify";
import { StatusService } from "../services/StatusService";

export class StatusController {
  static async create(req: FastifyRequest, reply: FastifyReply) {
    try {
      const status = await StatusService.createStatus(req.body as any);
      reply.code(201).send(status);
    } catch (error) {
      reply.code(500).send({ message: "Erro ao criar status", error });
    }
  }

  static async getAll(req: FastifyRequest, reply: FastifyReply) {
    try {
      const status = await StatusService.getAllStatus();
      reply.send(status);
    } catch (error) {
      reply.code(500).send({ message: "Erro ao listar status", error });
    }
  }

  static async getById(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = req.params as { id: string };
      const status = await StatusService.getStatusById(id);
      if (!status)
        return reply.code(404).send({ message: "status não encontrada" });
      reply.send(status);
    } catch (error) {
      reply.code(500).send({ message: "Erro ao buscar status", error });
    }
  }

  static async update(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = req.params as { id: string };
      const updated = await StatusService.updateStatus(id, req.body as any);
      if (!updated)
        return reply.code(404).send({ message: "status não encontrado" });
      reply.send(updated);
    } catch (error) {
      reply.code(500).send({ message: "Erro ao atualizar status", error });
    }
  }

  static async delete(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = req.params as { id: string };
      const deleted = await StatusService.deleteStatus(id);
      if (!deleted)
        return reply.code(404).send({ message: "status não encontrad" });
      reply.send({ message: "status removida com sucesso" });
    } catch (error) {
      reply.code(500).send({ message: "Erro ao deletar status", error });
    }
  }
}
