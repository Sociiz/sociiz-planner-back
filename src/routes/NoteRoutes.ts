import { FastifyInstance } from "fastify";
import { NoteController } from "../controller/NoteController";

const noteController = new NoteController();

export async function noteRoutes(fastify: FastifyInstance) {
  // Criar nova nota
  fastify.post("/notes", noteController.create.bind(noteController));

  // Listar todas as notas
  fastify.get("/notes", noteController.getAll.bind(noteController));

  // Buscar nota por ID
  fastify.get("/notes/:id", noteController.getById.bind(noteController));

  // Atualizar nota
  fastify.put("/notes/:id", noteController.update.bind(noteController));

  // Deletar nota
  fastify.delete("/notes/:id", noteController.delete.bind(noteController));

  // Deletar todas as notas
  fastify.delete("/notes", noteController.deleteAll.bind(noteController));
}
