import { FastifyRequest, FastifyReply } from "fastify";
import { ProductService } from "../services/ProductService";

export class ProductController {
  static async create(req: FastifyRequest, reply: FastifyReply) {
    try {
      const product = await ProductService.createProduct(req.body as any);
      reply.code(201).send(product);
    } catch (error) {
      reply.code(500).send({ message: "Erro ao criar produto", error });
    }
  }

  static async getAll(req: FastifyRequest, reply: FastifyReply) {
    try {
      const products = await ProductService.getAllProducts();
      reply.send(products);
    } catch (error) {
      reply.code(500).send({ message: "Erro ao listar produtos", error });
    }
  }

  static async getById(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = req.params as { id: string };
      const product = await ProductService.getProductById(id);
      if (!product)
        return reply.code(404).send({ message: "Produto não encontrado" });
      reply.send(product);
    } catch (error) {
      reply.code(500).send({ message: "Erro ao buscar produto", error });
    }
  }

  static async update(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = req.params as { id: string };
      const updated = await ProductService.updateProduct(id, req.body as any);
      if (!updated)
        return reply.code(404).send({ message: "Produto não encontrado" });
      reply.send(updated);
    } catch (error) {
      reply.code(500).send({ message: "Erro ao atualizar produto", error });
    }
  }

  static async delete(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = req.params as { id: string };
      const deleted = await ProductService.deleteProduct(id);
      if (!deleted)
        return reply.code(404).send({ message: "Produto não encontrado" });
      reply.send({ message: "Produto removido com sucesso" });
    } catch (error) {
      reply.code(500).send({ message: "Erro ao deletar produto", error });
    }
  }
}
