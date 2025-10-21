import { FastifyInstance } from "fastify";
import { TagController } from "../controller/TagController";

export async function tagRoutes(fastify: FastifyInstance) {
  fastify.post(
    "/tags",
    { preHandler: [fastify.authenticate] },
    TagController.create
  );
  fastify.get(
    "/tags",
    { preHandler: [fastify.authenticate] },
    TagController.getAll
  );
  fastify.get(
    "/tags/:id",
    { preHandler: [fastify.authenticate] },
    TagController.getById
  );
  fastify.put(
    "/tags/:id",
    { preHandler: [fastify.authenticate] },
    TagController.update
  );
  fastify.delete(
    "/tags/:id",
    { preHandler: [fastify.authenticate] },
    TagController.delete
  );
}
