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

// 🔧 Função auxiliar — trata arquivos e strings Base64
function getImageAsBase64(input: string | Buffer): string | null {
  try {
    // Se já for Base64
    if (typeof input === "string" && input.startsWith("data:image")) {
      return input.split(",")[1];
    }

    // Se for um caminho de arquivo
    if (typeof input === "string" && fs.existsSync(input)) {
      const buffer = fs.readFileSync(input);
      return buffer.toString("base64");
    }

    // Se for Buffer (ex: multer)
    if (Buffer.isBuffer(input)) {
      return input.toString("base64");
    }

    return null;
  } catch (error) {
    console.error("❌ Erro ao converter imagem em Base64:", error);
    return null;
  }
}

export const uploadRoutes = async (fastify: FastifyInstance) => {
  // Upload tradicional (multipart)
  fastify.post(
    "/upload",
    { preHandler: upload.single("file") },
    async (req: any, reply) => {
      try {
        if (!req.file) {
          return reply.status(400).send({ error: "Nenhum arquivo enviado." });
        }

        const filePath = req.file.path;
        const fileUrl = `/uploads/${req.file.filename}`;

        const base64 = getImageAsBase64(filePath);

        return reply.send({
          success: true,
          message: "Upload realizado com sucesso!",
          file: {
            originalName: req.file.originalname,
            filename: req.file.filename,
            path: filePath,
            url: fileUrl,
            base64: base64
              ? `data:${req.file.mimetype};base64,${base64}`
              : null,
          },
        });
      } catch (err) {
        console.error("Erro no upload:", err);
        return reply.status(500).send({ error: "Erro ao realizar upload." });
      }
    }
  );

  // Upload direto em Base64
  fastify.post("/upload-base64", async (req, reply) => {
    try {
      const { name, base64 } = req.body as { name: string; base64: string };
      if (!base64 || !name) {
        return reply
          .status(400)
          .send({ error: "Nome e Base64 são obrigatórios." });
      }

      const base64Data = base64.split(",")[1];
      const fileExt = base64.match(/data:image\/(\w+);base64/)?.[1] || "png";
      const filename = `${Date.now()}-${name.replace(/\s+/g, "_")}.${fileExt}`;
      const filePath = path.join(uploadDir, filename);

      fs.writeFileSync(filePath, Buffer.from(base64Data, "base64"));

      return reply.send({
        success: true,
        message: "Upload Base64 salvo com sucesso!",
        file: {
          filename,
          url: `/uploads/${filename}`,
          path: filePath,
        },
      });
    } catch (err) {
      console.error("Erro ao salvar Base64:", err);
      return reply
        .status(500)
        .send({ error: "Erro ao salvar arquivo Base64." });
    }
  });

  // Listar arquivos
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
