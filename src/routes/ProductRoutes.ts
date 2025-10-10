import { FastifyInstance } from "fastify";
import { ProductController } from "../controller/ProductController";

export async function productRoutes(app: FastifyInstance) {
  app.post("/products", ProductController.create);
  app.get("/products", ProductController.getAll);
  app.get("/products/:id", ProductController.getById);
  app.put("/products/:id", ProductController.update);
  app.delete("/products/:id", ProductController.delete);
}
