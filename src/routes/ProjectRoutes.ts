import { FastifyInstance } from "fastify";
import { ProjectController } from "../controller/ProjectController";

export async function projectRoutes(app: FastifyInstance) {
  app.post("/projects", ProjectController.create);
  app.get("/projects", ProjectController.getAll);
  app.get("/projects/:id", ProjectController.getById);
  app.put("/projects/:id", ProjectController.update);
  app.delete("/projects/:id", ProjectController.delete);
}
