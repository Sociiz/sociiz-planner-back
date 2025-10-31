import fastifyPlugin from "fastify-plugin";
import fastifyJwt from "@fastify/jwt";

export default fastifyPlugin(async (fastify) => {
  fastify.register(fastifyJwt, {
    secret: process.env.JWT_SECRET || "",
  });

  // so pra deixar o usuário comum passar
  fastify.decorate("authenticate", async (request: any, reply: any) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.status(401).send({ message: "Token inválido" });
    }
  });

  // isso daqui agora define controle entre admin e usuario comum
  // se eu colocar isso em uma rota, só pode acessar se for admin tipo, deletar algo
  fastify.decorate("isAdmin", async (request: any, reply: any) => {
    try {
      await request.jwtVerify();
      if (!request.user.isAdmin) {
        return reply
          .status(403)
          .send({ message: "Acesso negado: Admins apenas" });
      }
    } catch (err) {
      reply.status(401).send({ message: "Token inválido" });
    }
  });
});
