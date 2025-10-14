import { FastifyRequest, FastifyReply } from "fastify";
import { TagService } from "../services/TagService";

export class TagController {
  static async create(req: FastifyRequest, reply: FastifyReply) {
    try {
      const tag = await TagService.createTag(req.body as any);
      reply.code(201).send(tag);
    } catch (error) {
      reply.code(500).send({ message: "Erro ao criar tag", error });
    }
  }

  static async getAll(req: FastifyRequest, reply: FastifyReply) {
    try {
      const tag = await TagService.getAllTags();
      reply.send(tag);
    } catch (error) {
      reply.code(500).send({ message: "Erro ao listar produtos", error });
    }
  }

  static async getById(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = req.params as { id: string };
      const tag = await TagService.getTagById(id);
      if (!tag) return reply.code(404).send({ message: "tag não encontrada" });
      reply.send(tag);
    } catch (error) {
      reply.code(500).send({ message: "Erro ao buscar tag", error });
    }
  }

  static async update(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = req.params as { id: string };
      const updated = await TagService.updateTag(id, req.body as any);
      if (!updated)
        return reply.code(404).send({ message: "tag não encontrada" });
      reply.send(updated);
    } catch (error) {
      reply.code(500).send({ message: "Erro ao atualizar tag", error });
    }
  }

  static async delete(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = req.params as { id: string };
      const deleted = await TagService.deleteTag(id);
      if (!deleted)
        return reply.code(404).send({ message: "tag não encontrada" });
      reply.send({ message: "tag removida com sucesso" });
    } catch (error) {
      reply.code(500).send({ message: "Erro ao deletar tag", error });
    }
  }
}
