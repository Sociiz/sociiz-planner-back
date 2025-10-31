import { FastifyRequest, FastifyReply } from "fastify";
import { NoteService } from "../services/NoteService";

const noteService = new NoteService();

interface CreateNoteBody {
  content: string;
}

interface UpdateNoteBody {
  content: string;
}

interface NoteParams {
  id: string;
}

export class NoteController {
  async create(
    request: FastifyRequest<{ Body: CreateNoteBody }>,
    reply: FastifyReply
  ) {
    try {
      const { content } = request.body;

      const user = request.user as { id: string; isAdmin: boolean };

      if (!content || content.trim() === "") {
        return reply.status(400).send({
          error: "Conteúdo vazio, conteúdo é necessário",
        });
      }

      const note = await noteService.createNote(content, user.id);

      return reply.status(201).send({
        success: true,
        data: note,
      });
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({
        error: "Falha ao criar nova nota",
      });
    }
  }

  async getAll(request: FastifyRequest, reply: FastifyReply) {
    try {
      const user = request.user as { id: string; isAdmin: boolean };

      const notes = user.isAdmin
        ? await noteService.getAllNotes()
        : await noteService.getNotesByUser(user.id);

      return reply.status(200).send({
        success: true,
        data: notes,
        count: notes.length,
      });
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({
        error: "Falha ao carregar as notas",
      });
    }
  }

  async getById(
    request: FastifyRequest<{ Params: NoteParams }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = request.params;
      const note = await noteService.getNoteById(id);

      if (!note) {
        return reply.status(404).send({
          error: "Nota não encontrada",
        });
      }

      return reply.status(200).send({
        success: true,
        data: note,
      });
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({
        error: "Falha ao carregar as nota",
      });
    }
  }

  async update(
    request: FastifyRequest<{ Params: NoteParams; Body: UpdateNoteBody }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = request.params;
      const { content } = request.body;

      if (!content || content.trim() === "") {
        return reply.status(400).send({
          error: "Conteúdo vazio, é necessário conteúdo",
        });
      }

      const note = await noteService.updateNote(id, content);

      if (!note) {
        return reply.status(404).send({
          error: "Nota não encontrada",
        });
      }

      return reply.status(200).send({
        success: true,
        data: note,
      });
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({
        error: "Falha ao atualizar nota",
      });
    }
  }

  async delete(
    request: FastifyRequest<{ Params: NoteParams }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = request.params;
      const deleted = await noteService.deleteNote(id);

      if (!deleted) {
        return reply.status(404).send({
          error: "Nota não encontrada",
        });
      }

      return reply.status(200).send({
        success: true,
        message: "Nota deletada com sucesso",
      });
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({
        error: "Falha ao deletar nota",
      });
    }
  }

  async deleteAll(request: FastifyRequest, reply: FastifyReply) {
    try {
      const user = request.user as { isAdmin: boolean };
      if (!user.isAdmin) {
        return reply.status(403).send({
          error: "Apenas admin são autorizados deletar todas as notas",
        });
      }
      const count = await noteService.deleteAllNotes();

      return reply.status(200).send({
        success: true,
        message: `${count} notas deletadas com sucesso`,
        count,
      });
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({
        error: "Failed to delete notes",
      });
    }
  }
}
