import { FastifyRequest, FastifyReply } from "fastify";
import { TaskService } from "../services/TaskService";
import { Client } from "../models/ClientModel";
import { Project } from "../models/ProjectModel";
import { Product } from "../models/ProductModel";
import { Types } from "mongoose";

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
      let {
        title,
        description,
        status,
        client,
        project,
        // product,
        evaluationStatus,
        assignedTo,
        tags,
        subtasks,
        dueDate,
      } = request.body as any;

      // Filtra subtasks válidas
      const validSubtasks =
        Array.isArray(subtasks) && subtasks.length > 0
          ? subtasks.filter((s) => s.title && s.title.trim() !== "")
          : [];

      // Ao criar uma task quando informa cliente
      // verifica se cliente existe na coleção de Cliente, se não Cria
      let clientId;
      if (client) {
        let clientDoc = await Client.findOne({ name: client });
        if (!clientDoc) clientDoc = await Client.create({ name: client });
        clientId = clientDoc._id as Types.ObjectId;
      }

      let projectId;
      if (project) {
        let projectDoc = await Project.findOne({ name: project });
        if (!projectDoc) projectDoc = await Project.create({ name: project });
        projectId = projectDoc._id as Types.ObjectId;
      }

      // // PRODUTO
      // let productId;
      // if (product) {
      //   let productDoc = await Product.findOne({ name: product });
      //   if (!productDoc) productDoc = await Product.create({ name: product });
      //   productId = productDoc._id;
      // }

      // Cria task
      const task = await TaskService.createTask({
        title,
        description,
        status,
        client: clientId,
        project: projectId,
        // product: productId,
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
      let {
        title,
        description,
        status,
        client,
        project,
        // product,
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

      // CLIENTE
      let clientId;
      if (client) {
        let clientDoc = await Client.findOne({ name: client });
        if (!clientDoc) clientDoc = await Client.create({ name: client });
        clientId = clientDoc._id as Types.ObjectId;
      }

      // PROJETO
      let projectId;
      if (project) {
        let projectDoc = await Project.findOne({ name: project });
        if (!projectDoc) projectDoc = await Project.create({ name: project });
        projectId = projectDoc._id as Types.ObjectId;
      }

      // // PRODUTO
      // let productId;
      // if (product) {
      //   let productDoc = await Product.findOne({ name: product });
      //   if (!productDoc) productDoc = await Product.create({ name: product });
      //   productId = productDoc._id;
      // }

      const task = await TaskService.updateTask(id, {
        title,
        description,
        status,
        client: clientId,
        project: projectId,
        // product: productId,
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
