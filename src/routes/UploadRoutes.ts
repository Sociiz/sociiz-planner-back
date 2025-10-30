import { FastifyInstance } from "fastify";
import mongoose from "mongoose";

// Modelo MongoDB para arquivos
const FileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  base64: { type: String, required: true }, // imagem em Base64
  mimetype: String,
  createdAt: { type: Date, default: Date.now },
});

const FileModel = mongoose.model("File", FileSchema);

export const uploadRoutes = async (fastify: FastifyInstance) => {
  fastify.post("/upload-base64", async (req, reply) => {
    try {
      const { name, base64 } = req.body as { name: string; base64: string };

      if (!name || !base64) {
        return reply
          .status(400)
          .send({ error: "Nome e Base64 são obrigatórios." });
      }

      const mimetypeMatch = base64.match(/^data:(image\/\w+);base64,/);
      const mimetype = mimetypeMatch ? mimetypeMatch[1] : "image/png";

      const fileDoc = await FileModel.create({
        name,
        base64,
        mimetype,
      });

      return reply.send({
        success: true,
        message: "Upload Base64 salvo no banco com sucesso!",
        file: {
          id: fileDoc._id,
          name: fileDoc.name,
          mimetype: fileDoc.mimetype,
          base64: fileDoc.base64,
        },
      });
    } catch (err) {
      console.error("Erro ao salvar Base64:", err);
      return reply
        .status(500)
        .send({ error: "Erro ao salvar arquivo Base64." });
    }
  });

  fastify.get("/uploads", async (_, reply) => {
    try {
      const files = await FileModel.find().sort({ createdAt: -1 });
      return reply.send(
        files.map((f) => ({
          id: f._id,
          name: f.name,
          mimetype: f.mimetype,
          base64: f.base64,
        }))
      );
    } catch (err) {
      console.error("Erro ao listar arquivos:", err);
      return reply.status(500).send({ error: "Erro ao listar arquivos." });
    }
  });

  fastify.get("/uploads/:id", async (req, reply) => {
    try {
      const { id } = req.params as { id: string };
      const file = await FileModel.findById(id);

      if (!file)
        return reply.status(404).send({ error: "Arquivo não encontrado." });

      return reply.send({
        id: file._id,
        name: file.name,
        mimetype: file.mimetype,
        base64: file.base64,
      });
    } catch (err) {
      console.error("Erro ao buscar arquivo:", err);
      return reply.status(500).send({ error: "Erro ao buscar arquivo." });
    }
  });

  fastify.delete("/uploads/:id", async (req, reply) => {
    try {
      const { id } = req.params as { id: string };
      const file = await FileModel.findByIdAndDelete(id);

      if (!file)
        return reply.status(404).send({ error: "Arquivo não encontrado." });

      return reply.send({
        success: true,
        message: "Arquivo excluído com sucesso.",
      });
    } catch (err) {
      console.error("Erro ao excluir arquivo:", err);
      return reply.status(500).send({ error: "Erro ao excluir arquivo." });
    }
  });
};
