import { FastifyInstance } from "fastify";
import { TagController } from "../controller/TagController";

export async function tagRoutes(app: FastifyInstance) {
  app.post("/tags", TagController.create);
  app.get("/tags", TagController.getAll);
  app.get("/tags/:id", TagController.getById);
  app.put("/tags/:id", TagController.update);
  app.delete("/tags/:id", TagController.delete);
}
