import { FastifyInstance } from "fastify";
import { AuthController } from "../controller/authController";

export async function authRoutes(fastify: FastifyInstance) {
  fastify.post("/register", AuthController.register);
  fastify.post("/login", AuthController.login);
  fastify.post("/refresh-token", AuthController.refreshToken);
  fastify.post("/reset-senha", AuthController.resetSenha);
}

export default authRoutes;
