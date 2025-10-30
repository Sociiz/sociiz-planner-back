import Fastify from "fastify";
import dotenv from "dotenv";
import multipart from "@fastify/multipart";
import fastifyStatic from "@fastify/static";
import path from "path";
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
import { statusRoutes } from "./routes/StatusRoutes";
import { uploadRoutes } from "./routes/UploadRoutes";
import { noteRoutes } from "./routes/NoteRoutes";

dotenv.config();

const fastify = Fastify({ logger: true });

// Plugins
fastify.register(jwtPlugin);
fastify.register(cors, {
  origin: [
    "https://sociiz-planner-react.vercel.app",
    "http://localhost:5173",
    "https://planner.orbiapp.com.br",
    "https://sociiz-planner-react-git-homologacao-sociiz-techs-projects.vercel.app",
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
});

fastify.register(multipart);

const uploadDir = path.join(process.cwd(), "uploads");
fastify.register(fastifyStatic, {
  root: uploadDir,
  prefix: "/uploads/",
});

// Rotas de upload
fastify.register(uploadRoutes);

// Rotas principais
fastify.register(authRoutes, { prefix: "/" });
fastify.register(userRoutes, { prefix: "/" });
fastify.register(taskRoutes, { prefix: "/" });
fastify.register(clientRoutes, { prefix: "/" });
fastify.register(projectRoutes, { prefix: "/" });
fastify.register(productRoutes, { prefix: "/" });
fastify.register(tagRoutes, { prefix: "/" });
fastify.register(colaboradorRoutes, { prefix: "/" });
fastify.register(statusRoutes, { prefix: "/" });
fastify.register(noteRoutes, { prefix: "/" });

// Rota raiz
fastify.get("/", async () => ({ message: "Servidor rodando!" }));

const start = async () => {
  try {
    await connectDB();
    await fastify.listen({ port: 3000 });
    console.log("🚀 Server rodando na porta 3000");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
