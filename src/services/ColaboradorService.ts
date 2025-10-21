import { Colaborador, IColaborador } from "../models/ColaboradorModel";

export class ColaboradorService {
  static async createColaborador(data: Partial<IColaborador>) {
    const colaborador = new Colaborador(data);
    return colaborador.save();
  }

  static async getAllColaborador() {
    return Colaborador.find();
  }

  static async getColaboradorById(id: string) {
    return Colaborador.findById(id);
  }

  static async updateColaborador(id: string, data: Partial<IColaborador>) {
    return Colaborador.findByIdAndUpdate(id, data, { new: true });
  }

  static async deleteColaborador(id: string) {
    return Colaborador.findByIdAndDelete(id);
  }
}
