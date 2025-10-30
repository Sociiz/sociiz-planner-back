import { Task, ITask, ISubtask } from "../models/TaskModel";
import { Client } from "../models/ClientModel";
import { Project } from "../models/ProjectModel";
import { Product } from "../models/ProductModel";
import fs from "fs";
import path from "path";

export class TaskService {
  private static toBase64(filePath?: string | null) {
    if (!filePath) return null;
    try {
      const fullPath = path.join(process.cwd(), filePath);
      const buffer = fs.readFileSync(fullPath);
      const ext = path.extname(filePath).slice(1);
      return `data:image/${ext};base64,${buffer.toString("base64")}`;
    } catch (err) {
      console.error("Erro ao ler arquivo para Base64:", err);
      return null;
    }
  }

  static async createTask(data: Partial<ITask>) {
    const task = new Task(data);
    return task.save();
  }

  static async getTaskById(id: string) {
    const task = await Task.findById(id);
    if (!task) return null;

    const clientImages = await Promise.all(
      (task.client ?? []).map(async (name) =>
        this.toBase64((await Client.findOne({ name }))?.imageUrl)
      )
    );

    const projectImages = await Promise.all(
      (task.project ?? []).map(async (name) =>
        this.toBase64((await Project.findOne({ name }))?.imageUrl)
      )
    );

    const productImages = await Promise.all(
      (task.product ?? []).map(async (name) =>
        this.toBase64((await Product.findOne({ name }))?.imageUrl)
      )
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
          (task.client ?? []).map(async (name) =>
            this.toBase64((await Client.findOne({ name }))?.imageUrl)
          )
        );

        const projectImages = await Promise.all(
          (task.project ?? []).map(async (name) =>
            this.toBase64((await Project.findOne({ name }))?.imageUrl)
          )
        );

        const productImages = await Promise.all(
          (task.product ?? []).map(async (name) =>
            this.toBase64((await Product.findOne({ name }))?.imageUrl)
          )
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
