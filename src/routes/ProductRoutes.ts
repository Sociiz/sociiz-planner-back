import { FastifyInstance } from "fastify";
import { ProductController } from "../controller/ProductController";

export async function productRoutes(fastify: FastifyInstance) {
  fastify.post(
    "/products",
    { preHandler: [fastify.authenticate] },
    ProductController.create
  );
  fastify.get(
    "/products",
    { preHandler: [fastify.authenticate] },
    ProductController.getAll
  );
  fastify.get(
    "/products/:id",
    { preHandler: [fastify.authenticate] },
    ProductController.getById
  );
  fastify.put(
    "/products/:id",
    { preHandler: [fastify.authenticate] },
    ProductController.update
  );
  fastify.delete(
    "/products/:id",
    { preHandler: [fastify.authenticate] },
    ProductController.delete
  );
}
