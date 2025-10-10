import { FastifyRequest, FastifyReply } from "fastify";
import { ProjectService } from "../services/ProjectService";

export class ProjectController {
  static async create(req: FastifyRequest, reply: FastifyReply) {
    try {
      const client = await ProjectService.createProject(req.body as any);
      reply.code(201).send(client);
    } catch (error) {
      reply.code(500).send({ message: "Erro ao criar projeto", error });
    }
  }

  static async getAll(req: FastifyRequest, reply: FastifyReply) {
    try {
      const clients = await ProjectService.getAllProjects();
      reply.send(clients);
    } catch (error) {
      reply.code(500).send({ message: "Erro ao listar projetos", error });
    }
  }

  static async getById(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = req.params as { id: string };
      const client = await ProjectService.getProjectById(id);
      if (!client)
        return reply.code(404).send({ message: "projeto não encontrado" });
      reply.send(client);
    } catch (error) {
      reply.code(500).send({ message: "Erro ao buscar projeto", error });
    }
  }

  static async update(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = req.params as { id: string };
      const updated = await ProjectService.updateProject(id, req.body as any);
      if (!updated)
        return reply.code(404).send({ message: "projeto não encontrado" });
      reply.send(updated);
    } catch (error) {
      reply.code(500).send({ message: "Erro ao atualizar projeto", error });
    }
  }

  static async delete(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = req.params as { id: string };
      const deleted = await ProjectService.deleteProject(id);
      if (!deleted)
        return reply.code(404).send({ message: "projeto não encontrado" });
      reply.send({ message: "projeto removido com sucesso" });
    } catch (error) {
      reply.code(500).send({ message: "Erro ao deletar projeto", error });
    }
  }
}
