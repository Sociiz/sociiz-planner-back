import Fastify from "fastify";
import dotenv from "dotenv";
import cors from "@fastify/cors";
import { connectDB } from "./config/database";

import jwtPlugin from "./plugins/jwt";
import authRoutes from "./routes/authRoutes";
import { userRoutes } from "./routes/userRoute";
import { taskRoutes } from "./routes/TaskRoutes";
import { clientRoutes } from "./routes/ClientRoutes";

dotenv.config();

const fastify = Fastify({ logger: true });

fastify.register(jwtPlugin);
fastify.register(cors, {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
});

fastify.get("/", async () => {
  return { message: "Servidor rodando!" };
});

// Rotas
fastify.register(authRoutes, { prefix: "/" });
fastify.register(userRoutes, { prefix: "/" });
fastify.register(taskRoutes, { prefix: "/" });
fastify.register(clientRoutes, { prefix: "/" });

const start = async () => {
  try {
    await connectDB();

    await fastify.listen({ port: 3000 });
    console.log("Server rodando na porta 3000");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
