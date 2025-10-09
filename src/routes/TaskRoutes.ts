import { FastifyInstance } from "fastify";
import { TaskController } from "../controller/TaskController";

export async function taskRoutes(fastify: FastifyInstance) {
  // Tasks
  fastify.get(
    "/tasks",
    { preHandler: [fastify.authenticate] },
    TaskController.getAll
  );

  fastify.get(
    "/tasks/:id",
    { preHandler: [fastify.authenticate] },
    TaskController.getOne
  );

  fastify.post(
    "/tasks",
    { preHandler: [fastify.authenticate] },
    TaskController.create
  );

  fastify.put(
    "/tasks/:id",
    { preHandler: [fastify.authenticate] },
    TaskController.update
  );

  fastify.delete(
    "/tasks/:id",
    { preHandler: [fastify.authenticate] },
    TaskController.delete
  );

  // Subtasks
  fastify.post(
    "/tasks/:id/subtasks",
    { preHandler: [fastify.authenticate] },
    TaskController.addSubtask
  );

  fastify.delete(
    "/tasks/:id/subtasks/:subtaskId",
    { preHandler: [fastify.authenticate] },
    TaskController.deleteSubtask
  );
}
