import { FastifyInstance } from "fastify";
import { NoteController } from "../controller/NoteController";

const noteController = new NoteController();

export async function noteRoutes(fastify: FastifyInstance) {
  // Criar nova nota (só precisa estar logado)
  fastify.post(
    "/notes",
    { preHandler: [fastify.authenticate] },
    noteController.create.bind(noteController)
  );

  // Listar notas (usuário vê as dele, admin vê todas)
  fastify.get(
    "/notes",
    { preHandler: [fastify.authenticate] },
    noteController.getAll.bind(noteController)
  );

  // Buscar nota por ID (qualquer um logado)
  fastify.get(
    "/notes/:id",
    { preHandler: [fastify.authenticate] },
    noteController.getById.bind(noteController)
  );

  // Atualizar nota (precisa estar logado)
  fastify.put(
    "/notes/:id",
    { preHandler: [fastify.authenticate] },
    noteController.update.bind(noteController)
  );

  // Deletar nota (precisa estar logado)
  fastify.delete(
    "/notes/:id",
    { preHandler: [fastify.authenticate] },
    noteController.delete.bind(noteController)
  );

  // Deletar todas (só admin)
  fastify.delete(
    "/notes",
    { preHandler: [fastify.isAdmin] },
    noteController.deleteAll.bind(noteController)
  );
}
