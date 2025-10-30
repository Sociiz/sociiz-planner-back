import { FastifyRequest, FastifyReply } from "fastify";
import { ProjectService } from "../services/ProjectService";

export class ProjectController {
  static async create(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { name, description, imageUrl } = req.body as {
        name: string;
        description?: string;
        imageUrl?: string;
      };

      const project = await ProjectService.createProject({
        name,
        imageUrl,
      });
      reply.code(201).send(project);
    } catch (error) {
      reply.code(500).send({ message: "Erro ao criar projeto", error });
    }
  }

  static async getAll(req: FastifyRequest, reply: FastifyReply) {
    try {
      const projects = await ProjectService.getAllProjects();
      reply.send(projects);
    } catch (error) {
      reply.code(500).send({ message: "Erro ao listar projetos", error });
    }
  }

  static async getById(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = req.params as { id: string };
      const project = await ProjectService.getProjectById(id);
      if (!project)
        return reply.code(404).send({ message: "Projeto não encontrado" });
      reply.send(project);
    } catch (error) {
      reply.code(500).send({ message: "Erro ao buscar projeto", error });
    }
  }

  static async update(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = req.params as { id: string };
      const { name, description, imageUrl } = req.body as {
        name?: string;
        description?: string;
        imageUrl?: string;
      };

      const updated = await ProjectService.updateProject(id, {
        name,
        imageUrl,
      });
      if (!updated)
        return reply.code(404).send({ message: "Projeto não encontrado" });
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
        return reply.code(404).send({ message: "Projeto não encontrado" });
      reply.send({ message: "Projeto removido com sucesso" });
    } catch (error) {
      reply.code(500).send({ message: "Erro ao deletar projeto", error });
    }
  }
}
