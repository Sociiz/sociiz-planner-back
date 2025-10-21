import Fastify from "fastify";
import dotenv from "dotenv";
import cors from "@fastify/cors";
import { connectDB } from "./config/database";

import jwtPlugin from "./plugins/jwt";
import authRoutes from "./routes/authRoutes";
import { userRoutes } from "./routes/userRoute";
import { taskRoutes } from "./routes/TaskRoutes";
import { clientRoutes } from "./routes/ClientRoutes";
import { projectRoutes } from "./routes/ProjectRoutes";
import { productRoutes } from "./routes/ProductRoutes";
import { tagRoutes } from "./routes/TagRoutes";
import { colaboradorRoutes } from "./routes/ColaboradorRoutes";

dotenv.config();

const fastify = Fastify({ logger: true });

fastify.register(jwtPlugin);

fastify.register(cors, {
  origin: ["https://sociiz-planner-back.vercel.app", "http://localhost:5173"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
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
fastify.register(projectRoutes, { prefix: "/" });
fastify.register(productRoutes, { prefix: "/" });
fastify.register(tagRoutes, { prefix: "/" });
fastify.register(colaboradorRoutes, { prefix: "/" });

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
