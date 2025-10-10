import { FastifyInstance } from "fastify";
import { ClientController } from "../controller/ClientController";

export async function clientRoutes(app: FastifyInstance) {
  app.post("/clients", ClientController.create);
  app.get("/clients", ClientController.getAll);
  app.get("/clients/:id", ClientController.getById);
  app.put("/clients/:id", ClientController.update);
  app.delete("/clients/:id", ClientController.delete);
}
