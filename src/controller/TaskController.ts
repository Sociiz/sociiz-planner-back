import { FastifyRequest, FastifyReply } from "fastify";
import { TaskService } from "../services/TaskService";

export class TaskController {
  static async getAll(request: FastifyRequest, reply: FastifyReply) {
    const { status } = request.query as any;
    const tasks = await TaskService.listTasksByStatus(status);
    return reply.send(tasks);
  }

  static async getOne(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as any;
    const task = await TaskService.getTaskById(id);
    if (!task)
      return reply.status(404).send({ message: "Tarefa não encontrada" });
    return reply.send(task);
  }

  static async create(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = (request.user as any)?.id || "teste";
      const {
        title,
        description,
        status,
        client,
        evaluationStatus,
        assignedTo,
        tags,
        subtasks,
        dueDate,
      } = request.body as any;

      const validSubtasks =
        Array.isArray(subtasks) && subtasks.length > 0
          ? subtasks.filter((s) => s.title && s.title.trim() !== "")
          : [];

      const task = await TaskService.createTask({
        title,
        description,
        status,
        client: client || [],
        evaluationStatus,
        createdBy: userId,
        assignedTo: assignedTo || [],
        tags: tags || [],
        subtasks: validSubtasks,
        dueDate: dueDate,
      });

      return reply.status(201).send(task);
    } catch (err: any) {
      console.error("Erro ao criar tarefa:", err);
      return reply.status(400).send({ message: err.message });
    }
  }

  static async update(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as any;
      const {
        title,
        description,
        status,
        client,
        evaluationStatus,
        assignedTo,
        tags,
        subtasks,
        dueDate,
      } = request.body as any;

      const validSubtasks =
        Array.isArray(subtasks) && subtasks.length > 0
          ? subtasks.filter((s) => s.title && s.title.trim() !== "")
          : [];

      const task = await TaskService.updateTask(id, {
        title,
        description,
        status,
        client,
        evaluationStatus,
        assignedTo,
        tags,
        subtasks: validSubtasks,
        dueDate: dueDate,
      });

      if (!task)
        return reply.status(404).send({ message: "Tarefa não encontrada" });

      return reply.send(task);
    } catch (err: any) {
      console.error("Erro ao atualizar tarefa:", err);
      return reply.status(400).send({ message: err.message });
    }
  }

  static async delete(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as any;
    const task = await TaskService.deleteTask(id);
    if (!task)
      return reply.status(404).send({ message: "Tarefa não encontrada" });
    return reply.send({ message: "Tarefa deletada" });
  }

  static async addSubtask(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as any;
      const subtask = request.body as any;

      if (!subtask.title || subtask.title.trim() === "") {
        return reply
          .status(400)
          .send({ message: "Título da subtarefa é obrigatório" });
      }

      const task = await TaskService.addSubtask(id, subtask);
      return reply.send(task);
    } catch (err: any) {
      return reply.status(400).send({ message: err.message });
    }
  }

  static async deleteSubtask(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id, subtaskId } = request.params as any;
      const task = await TaskService.deleteSubtask(id, subtaskId);
      return reply.send(task);
    } catch (err: any) {
      return reply.status(400).send({ message: err.message });
    }
  }
}
