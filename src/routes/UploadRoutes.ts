import { FastifyInstance } from "fastify";
import multer from "fastify-multer";
import fs from "fs";
import path from "path";

const uploadDir = path.join(process.cwd(), "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("📁 Pasta 'uploads' criada com sucesso!");
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir);
  },
  filename(req, file, cb) {
    const uniqueName = `${Date.now()}-${file.originalname.replace(
      /\s+/g,
      "_"
    )}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

export const uploadRoutes = async (fastify: FastifyInstance) => {
  // Upload de arquivo
  fastify.post(
    "/upload",
    { preHandler: upload.single("file") },
    async (req: any, reply) => {
      if (!req.file) {
        return reply.status(400).send({ error: "Nenhum arquivo enviado." });
      }

      const filePath = req.file.path;
      const fileUrl = `/uploads/${req.file.filename}`;

      // Converte para Base64
      const fileBuffer = fs.readFileSync(filePath);
      const base64 = `data:${req.file.mimetype};base64,${fileBuffer.toString(
        "base64"
      )}`;

      return reply.send({
        success: true,
        message: "Upload realizado com sucesso!",
        file: {
          originalName: req.file.originalname,
          filename: req.file.filename,
          path: filePath,
          url: fileUrl,
          base64,
        },
      });
    }
  );

  // Listar todos os arquivos
  fastify.get("/uploads", async (_, reply) => {
    try {
      const files = fs.readdirSync(uploadDir);
      const fileList = files.map((filename) => ({
        filename,
        url: `/uploads/${filename}`,
      }));
      return reply.send(fileList);
    } catch (err) {
      return reply.status(500).send({ error: "Erro ao listar arquivos." });
    }
  });

  // Buscar arquivo específico
  fastify.get("/uploads/:filename", async (req, reply) => {
    const { filename } = req.params as { filename: string };
    const filePath = path.join(uploadDir, filename);

    if (!fs.existsSync(filePath)) {
      return reply.status(404).send({ error: "Arquivo não encontrado." });
    }

    return reply.sendFile(filename);
  });

  // Excluir arquivo
  fastify.delete("/uploads/:filename", async (req, reply) => {
    const { filename } = req.params as { filename: string };
    const filePath = path.join(uploadDir, filename);

    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        return reply.send({
          success: true,
          message: "Arquivo excluído com sucesso.",
        });
      } else {
        return reply.status(404).send({ error: "Arquivo não encontrado." });
      }
    } catch (err) {
      console.error("Erro ao excluir arquivo:", err);
      return reply.status(500).send({ error: "Erro ao excluir o arquivo." });
    }
  });
};
