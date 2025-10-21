import { FastifyRequest, FastifyReply } from "fastify";
import { ColaboradorService } from "../services/ColaboradorService";

export class ColaboradorController {
  static async create(req: FastifyRequest, reply: FastifyReply) {
    try {
      const colaborador = await ColaboradorService.createColaborador(
        req.body as any
      );
      reply.code(201).send(colaborador);
    } catch (error) {
      reply.code(500).send({ message: "Erro ao criar colaborador", error });
    }
  }

  static async getAll(req: FastifyRequest, reply: FastifyReply) {
    try {
      const colaborador = await ColaboradorService.getAllColaborador();
      reply.send(colaborador);
    } catch (error) {
      reply.code(500).send({ message: "Erro ao listar colaborador", error });
    }
  }

  static async getById(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = req.params as { id: string };
      const colaborador = await ColaboradorService.getColaboradorById(id);
      if (!colaborador)
        return reply.code(404).send({ message: "Colaborador não encontrado" });
      reply.send(colaborador);
    } catch (error) {
      reply.code(500).send({ message: "Erro ao buscar Colaborador", error });
    }
  }

  static async update(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = req.params as { id: string };
      const updated = await ColaboradorService.updateColaborador(
        id,
        req.body as any
      );
      if (!updated)
        return reply.code(404).send({ message: "Colaborador não encontrado" });
      reply.send(updated);
    } catch (error) {
      reply.code(500).send({ message: "Erro ao atualizar Colaborador", error });
    }
  }

  static async delete(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = req.params as { id: string };
      const deleted = await ColaboradorService.deleteColaborador(id);
      if (!deleted)
        return reply.code(404).send({ message: "Colaborador não encontrado" });
      reply.send({ message: "Colaborador removido com sucesso" });
    } catch (error) {
      reply.code(500).send({ message: "Erro ao deletar Colaborador", error });
    }
  }
}
