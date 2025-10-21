import fastify, { FastifyInstance } from "fastify";
import { ClientController } from "../controller/ClientController";

export async function clientRoutes(fastify: FastifyInstance) {
  fastify.post(
    "/clients",
    { preHandler: [fastify.authenticate] },
    ClientController.create
  );
  fastify.get(
    "/clients",
    { preHandler: [fastify.authenticate] },
    ClientController.getAll
  );
  fastify.get(
    "/clients/:id",
    { preHandler: [fastify.authenticate] },
    ClientController.getById
  );
  fastify.put(
    "/clients/:id",
    { preHandler: [fastify.authenticate] },
    ClientController.update
  );
  fastify.delete(
    "/clients/:id",
    { preHandler: [fastify.authenticate] },
    ClientController.delete
  );
}
