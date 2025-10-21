import { FastifyInstance } from "fastify";
import { ProjectController } from "../controller/ProjectController";

export async function projectRoutes(fastify: FastifyInstance) {
  fastify.post(
    "/projects",
    { preHandler: [fastify.authenticate] },
    ProjectController.create
  );
  fastify.get(
    "/projects",
    { preHandler: [fastify.authenticate] },
    ProjectController.getAll
  );
  fastify.get(
    "/projects/:id",
    { preHandler: [fastify.authenticate] },
    ProjectController.getById
  );
  fastify.put(
    "/projects/:id",
    { preHandler: [fastify.authenticate] },
    ProjectController.update
  );
  fastify.delete(
    "/projects/:id",
    { preHandler: [fastify.authenticate] },
    ProjectController.delete
  );
}
