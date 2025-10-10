import { Task, ITask, ISubtask } from "../models/TaskModel";

export class TaskService {
  static async createTask(data: Partial<ITask>) {
    const task = new Task(data);
    return task.save();
  }

  static async getTaskById(id: string) {
    return Task.findById(id)
      .populate("client", "name")
      .populate("project", "name");
  }

  static async updateTask(id: string, data: Partial<ITask>) {
    return Task.findByIdAndUpdate(id, data, { new: true });
  }

  static async deleteTask(id: string) {
    return Task.findByIdAndDelete(id);
  }

  static async listTasksByStatus(status?: string) {
    const filter = status ? { status } : {};
    return Task.find(filter).populate("client", "name");
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
