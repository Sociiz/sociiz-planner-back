import { Client, IClient } from "../models/ClientModel";

export class ClientService {
  static async createClient(data: Partial<IClient>) {
    const client = new Client(data);
    return client.save();
  }

  static async getAllClients() {
    return Client.find();
  }

  static async getClientById(id: string) {
    return Client.findById(id);
  }

  static async updateClient(id: string, data: Partial<IClient>) {
    return Client.findByIdAndUpdate(id, data, { new: true });
  }

  static async deleteClient(id: string) {
    return Client.findByIdAndDelete(id);
  }
}
