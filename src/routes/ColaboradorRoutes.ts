// import { FastifyInstance } from "fastify";
// import { ColaboradorController } from "../controller/ColaboradorController";

// export async function colaboradorRoutes(fastify: FastifyInstance) {
//   fastify.post(
//     "/colaboradores",
//     { preHandler: [fastify.authenticate] },
//     ColaboradorController.create
//   );
//   fastify.get(
//     "/colaboradores",
//     { preHandler: [fastify.authenticate] },
//     ColaboradorController.getAll
//   );
//   fastify.get(
//     "/colaboradores/:id",
//     { preHandler: [fastify.authenticate] },
//     ColaboradorController.getById
//   );
//   fastify.put(
//     "/colaboradores/:id",
//     { preHandler: [fastify.authenticate] },
//     ColaboradorController.update
//   );
//   fastify.delete(
//     "/colaboradores/:id",
//     { preHandler: [fastify.authenticate] },
//     ColaboradorController.delete
//   );
// }
