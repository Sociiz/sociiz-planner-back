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

      if (!content || content.trim() === "") {
        return reply.status(400).send({
          error: "Content is required",
        });
      }

      const note = await noteService.createNote(content);

      return reply.status(201).send({
        success: true,
        data: note,
      });
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({
        error: "Failed to create note",
      });
    }
  }

  async getAll(request: FastifyRequest, reply: FastifyReply) {
    try {
      const notes = await noteService.getAllNotes();

      return reply.status(200).send({
        success: true,
        data: notes,
        count: notes.length,
      });
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({
        error: "Failed to fetch notes",
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
          error: "Note not found",
        });
      }

      return reply.status(200).send({
        success: true,
        data: note,
      });
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({
        error: "Failed to fetch note",
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
          error: "Content is required",
        });
      }

      const note = await noteService.updateNote(id, content);

      if (!note) {
        return reply.status(404).send({
          error: "Note not found",
        });
      }

      return reply.status(200).send({
        success: true,
        data: note,
      });
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({
        error: "Failed to update note",
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
          error: "Note not found",
        });
      }

      return reply.status(200).send({
        success: true,
        message: "Note deleted successfully",
      });
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({
        error: "Failed to delete note",
      });
    }
  }

  async deleteAll(request: FastifyRequest, reply: FastifyReply) {
    try {
      const count = await noteService.deleteAllNotes();

      return reply.status(200).send({
        success: true,
        message: `${count} notes deleted successfully`,
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
