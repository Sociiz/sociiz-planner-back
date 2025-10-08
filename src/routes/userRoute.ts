import { FastifyInstance } from "fastify";
import { UserController } from "../controller/userController";

export async function userRoutes(fastify: FastifyInstance) {
  fastify.get(
    "/users",
    { preHandler: [fastify.authenticate] },
    UserController.getAll
  );
  fastify.get(
    "/users/:id",
    { preHandler: [fastify.authenticate] },
    UserController.getOne
  );
  fastify.post(
    "/users",
    { preHandler: [fastify.authenticate] },
    UserController.create
  );
  fastify.put(
    "/users/:id",
    { preHandler: [fastify.authenticate] },
    UserController.update
  );
  fastify.delete(
    "/users/:id",
    { preHandler: [fastify.authenticate] },
    UserController.delete
  );
}
