import { Status, IStatus } from "../models/StatusModel";

export class StatusService {
  static async createStatus(data: Partial<IStatus>) {
    const status = new Status(data);
    return status.save();
  }

  static async getAllStatus() {
    return Status.find();
  }

  static async getStatusById(id: string) {
    return Status.findById(id);
  }

  static async updateStatus(id: string, data: Partial<IStatus>) {
    return Status.findByIdAndUpdate(id, data, { new: true });
  }

  static async deleteStatus(id: string) {
    return Status.findByIdAndDelete(id);
  }
}
