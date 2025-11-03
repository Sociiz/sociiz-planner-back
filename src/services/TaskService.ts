import { Task, ITask, ISubtask } from "../models/TaskModel";
import { Client } from "../models/ClientModel";
import { Project } from "../models/ProjectModel";
import { Product } from "../models/ProductModel";

export class TaskService {
  static async createTask(data: Partial<ITask>) {
    const task = new Task(data);
    return task.save();
  }

  static async getTaskById(id: string) {
    const task = await Task.findById(id);
    if (!task) return null;

    const clientImages = await Promise.all(
      (task.client ?? []).map(async (name) => {
        const client = await Client.findOne({ name });
        return client?.coverImage ?? null;
      })
    );

    const projectImages = await Promise.all(
      (task.project ?? []).map(async (name) => {
        const project = await Project.findOne({ name });
        return project?.coverImage ?? null;
      })
    );

    const productImages = await Promise.all(
      (task.product ?? []).map(async (name) => {
        const product = await Product.findOne({ name });
        return product?.coverImage ?? null;
      })
    );

    return {
      ...task.toObject(),
      clientImages,
      projectImages,
      productImages,
    };
  }

  static async updateTask(id: string, data: Partial<ITask>) {
    return Task.findByIdAndUpdate(id, data, { new: true });
  }

  static async deleteTask(id: string) {
    return Task.findByIdAndDelete(id);
  }

  static async listTasksByStatus(status?: string) {
    const filter = status ? { status } : {};
    const tasks = await Task.find(filter);

    return Promise.all(
      tasks.map(async (task) => {
        const clientImages = await Promise.all(
          (task.client ?? []).map(async (name) => {
            const client = await Client.findOne({ name });
            return client?.coverImage ?? null;
          })
        );

        const projectImages = await Promise.all(
          (task.project ?? []).map(async (name) => {
            const project = await Project.findOne({ name });
            return project?.coverImage ?? null;
          })
        );

        const productImages = await Promise.all(
          (task.product ?? []).map(async (name) => {
            const product = await Product.findOne({ name });
            return product?.coverImage ?? null;
          })
        );

        return {
          ...task.toObject(),
          clientImages,
          projectImages,
          productImages,
        };
      })
    );
  }

  static async addSubtask(taskId: string, subtask: ISubtask) {
    const task = await Task.findById(taskId);
    if (!task) throw new Error("Tarefa não encontrada");

    task.subtasks.push(subtask);
    return task.save();
  }

  static async updateSubtask(
    taskId: string,
    subtaskId: string,
    data: Partial<ISubtask>
  ) {
    const task = await Task.findById(taskId);
    if (!task) throw new Error("Tarefa não encontrada");

    const subtask = task.subtasks.find(
      (st) => st._id?.toString() === subtaskId
    );
    if (!subtask) throw new Error("Subtarefa não encontrada");

    Object.assign(subtask, data);
    return task.save();
  }

  static async deleteSubtask(taskId: string, subtaskId: string) {
    const task = await Task.findById(taskId);
    if (!task) throw new Error("Tarefa não encontrada");

    const index = task.subtasks.findIndex(
      (st) => st._id?.toString() === subtaskId
    );
    if (index > -1) {
      task.subtasks.splice(index, 1);
      await task.save();
    }

    return task;
  }
}
