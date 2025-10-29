import { FastifyInstance } from "fastify";
import { StatusController } from "../controller/StatusController";

export async function statusRoutes(fastify: FastifyInstance) {
  fastify.post(
    "/status",
    { preHandler: [fastify.authenticate] },
    StatusController.create
  );
  fastify.get(
    "/status",
    { preHandler: [fastify.authenticate] },
    StatusController.getAll
  );
  fastify.get(
    "/status/:id",
    { preHandler: [fastify.authenticate] },
    StatusController.getById
  );
  fastify.put(
    "/status/:id",
    { preHandler: [fastify.authenticate] },
    StatusController.update
  );
  fastify.delete(
    "/status/:id",
    { preHandler: [fastify.authenticate] },
    StatusController.delete
  );
}
