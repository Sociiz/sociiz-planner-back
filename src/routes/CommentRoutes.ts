import { FastifyInstance } from "fastify";
import { CommentController } from "../controller/CommentController";

export async function commentRoutes(fastify: FastifyInstance) {
  fastify.post(
    "/comments",
    { preHandler: [fastify.authenticate] },
    CommentController.create
  );
  fastify.get(
    "/comments/task/:taskId",
    { preHandler: [fastify.authenticate] },
    CommentController.getByTaskId
  );
  fastify.get(
    "/comments/:id",
    { preHandler: [fastify.authenticate] },
    CommentController.getById
  );
  fastify.put(
    "/comments/:id",
    { preHandler: [fastify.authenticate] },
    CommentController.update
  );
  fastify.delete(
    "/comments/:id",
    { preHandler: [fastify.authenticate] },
    CommentController.delete
  );
}
