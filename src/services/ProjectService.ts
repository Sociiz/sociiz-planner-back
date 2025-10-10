import { Project, IProject } from "../models/ProjectModel";

export class ProjectService {
  static async createProject(data: Partial<IProject>) {
    const project = new Project(data);
    return project.save();
  }

  static async getAllProjects() {
    return Project.find();
  }

  static async getProjectById(id: string) {
    return Project.findById(id);
  }

  static async updateProject(id: string, data: Partial<IProject>) {
    return Project.findByIdAndUpdate(id, data, { new: true });
  }

  static async deleteProject(id: string) {
    return Project.findByIdAndDelete(id);
  }
}
