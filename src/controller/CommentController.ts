import { FastifyRequest, FastifyReply } from "fastify";
import { CommentService } from "../services/CommentService";

const commentService = new CommentService();

interface CreateCommentBody {
  taskId: string;
  content: string;
}

interface UpdateCommentBody {
  content: string;
}

interface CommentParams {
  id: string;
}

interface TaskParams {
  taskId: string;
}

export class CommentController {
  static async create(
    request: FastifyRequest<{ Body: CreateCommentBody }>,
    reply: FastifyReply
  ) {
    try {
      const { taskId, content } = request.body;
      const user = request.user as { id: string; isAdmin: boolean };

      if (!taskId || taskId.trim() === "") {
        return reply.status(400).send({
          error: "ID da tarefa é obrigatório",
        });
      }

      if (!content || content.trim() === "") {
        return reply.status(400).send({
          error: "Conteúdo é obrigatório",
        });
      }

      const comment = await commentService.createComment(
        taskId,
        content,
        user.id
      );

      return reply.status(201).send({
        success: true,
        data: comment,
      });
    } catch (error) {
      request.log.error(error);
      const message =
        error instanceof Error ? error.message : "Falha ao criar comentário";
      return reply.status(500).send({
        error: message,
      });
    }
  }

  static async getByTaskId(
    request: FastifyRequest<{ Params: TaskParams }>,
    reply: FastifyReply
  ) {
    try {
      const { taskId } = request.params;

      const comments = await commentService.getCommentsByTaskId(taskId);

      return reply.status(200).send({
        success: true,
        data: comments,
        count: comments.length,
      });
    } catch (error) {
      request.log.error(error);
      const message =
        error instanceof Error
          ? error.message
          : "Falha ao carregar comentários";
      return reply.status(500).send({
        error: message,
      });
    }
  }

  static async getById(
    request: FastifyRequest<{ Params: CommentParams }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = request.params;
      const comment = await commentService.getCommentById(id);

      if (!comment) {
        return reply.status(404).send({
          error: "Comentário não encontrado",
        });
      }

      return reply.status(200).send({
        success: true,
        data: comment,
      });
    } catch (error) {
      request.log.error(error);
      const message =
        error instanceof Error ? error.message : "Falha ao carregar comentário";
      return reply.status(500).send({
        error: message,
      });
    }
  }

  static async update(
    request: FastifyRequest<{ Params: CommentParams; Body: UpdateCommentBody }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = request.params;
      const { content } = request.body;
      const user = request.user as { id: string; isAdmin: boolean };

      if (!content || content.trim() === "") {
        return reply.status(400).send({
          error: "Conteúdo é obrigatório",
        });
      }

      const comment = await commentService.updateComment(id, content, user.id);

      if (!comment) {
        return reply.status(404).send({
          error: "Comentário não encontrado",
        });
      }

      return reply.status(200).send({
        success: true,
        data: comment,
      });
    } catch (error) {
      request.log.error(error);
      const message =
        error instanceof Error
          ? error.message
          : "Falha ao atualizar comentário";
      const statusCode =
        error instanceof Error &&
        error.message.includes("não encontrado ou sem permissão")
          ? 403
          : 500;

      return reply.status(statusCode).send({
        error: message,
      });
    }
  }

  static async delete(
    request: FastifyRequest<{ Params: CommentParams }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = request.params;
      const user = request.user as { id: string; isAdmin: boolean };

      const deleted = await commentService.deleteComment(id, user.id);

      if (!deleted) {
        return reply.status(404).send({
          error: "Comentário não encontrado",
        });
      }

      return reply.status(200).send({
        success: true,
        message: "Comentário deletado com sucesso",
      });
    } catch (error) {
      request.log.error(error);
      const message =
        error instanceof Error ? error.message : "Falha ao deletar comentário";
      const statusCode =
        error instanceof Error &&
        error.message.includes("não encontrado ou sem permissão")
          ? 403
          : 500;

      return reply.status(statusCode).send({
        error: message,
      });
    }
  }

  static async getCount(
    request: FastifyRequest<{ Params: TaskParams }>,
    reply: FastifyReply
  ) {
    try {
      const { taskId } = request.params;

      const count = await commentService.getCommentCount(taskId);

      return reply.status(200).send({
        success: true,
        count,
      });
    } catch (error) {
      request.log.error(error);
      const message =
        error instanceof Error ? error.message : "Falha ao contar comentários";
      return reply.status(500).send({
        error: message,
      });
    }
  }

  static async deleteByTaskId(
    request: FastifyRequest<{ Params: TaskParams }>,
    reply: FastifyReply
  ) {
    try {
      const { taskId } = request.params;
      const user = request.user as { id: string; isAdmin: boolean };

      if (!user.isAdmin) {
        return reply.status(403).send({
          error: "Apenas administradores podem deletar todos os comentários",
        });
      }

      const count = await commentService.deleteCommentsByTaskId(taskId);

      return reply.status(200).send({
        success: true,
        message: `${count} comentários deletados com sucesso`,
        count,
      });
    } catch (error) {
      request.log.error(error);
      const message =
        error instanceof Error ? error.message : "Falha ao deletar comentários";
      return reply.status(500).send({
        error: message,
      });
    }
  }
}
