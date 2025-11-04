import { FastifyReply, FastifyRequest } from "fastify";
import { UserService } from "../services/UserServices";

interface TokenPayload {
  id: string;
  isAdmin: boolean;
  isColaborador: boolean;
}

interface RefreshTokenBody {
  refreshToken?: string;
}

export class AuthController {
  // Agora consigo definir pra resetar a senha
  static async resetSenha(request: FastifyRequest, reply: FastifyReply) {
    const { email, novaSenha } = request.body as {
      email: string;
      novaSenha: string;
    };

    try {
      const user = await UserService.findByEmail(email);
      if (!user) {
        return reply.status(404).send({ message: "Usuário não encontrado." });
      }

      // aqui preciso pegar aquele id atualizar a senha
      await UserService.updatePassword(user.id, novaSenha);

      return reply.send({ message: "Senha redefinida com sucesso!" });
    } catch (error) {
      console.error(error);
      return reply.status(500).send({ message: "Erro ao redefinir senha." });
    }
  }

  // Registrar usuário
  static async register(request: FastifyRequest, reply: FastifyReply) {
    const { email, password, username, isAdmin, isColaborador } =
      request.body as any;

    try {
      const user = await UserService.createUser({
        email,
        password,
        username,
        isAdmin,
        isColaborador,
      });

      // Criação dos tokens e devolvendo para o front
      const accessToken = (request.server as any).jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        { expiresIn: "1h" }
      );

      const refreshToken = (request.server as any).jwt.sign(
        { id: user._id, isAdmin: user.isAdmin, type: "refresh" },
        { expiresIn: "7d" }
      );

      return reply.send({
        success: true,
        token: accessToken,
        refreshToken: refreshToken,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          isAdmin: user.isAdmin,
          isColaborador: user.isColaborador,
        },
      });
    } catch (err: any) {
      return reply.status(400).send({ message: err.message });
    }
  }

  // Login pra o usuário
  static async login(request: FastifyRequest, reply: FastifyReply) {
    const { email, password } = request.body as any;

    const user = await UserService.getUserByEmail(email);
    if (!user)
      return reply.status(400).send({ message: "Usuário não encontrado" });

    const bcrypt = await import("bcryptjs");
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return reply.status(400).send({ message: "Senha inválida" });

    const accessToken = (request.server as any).jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      { expiresIn: "1h" }
    );

    const refreshToken = (request.server as any).jwt.sign(
      { id: user._id, isAdmin: user.isAdmin, type: "refresh" },
      { expiresIn: "7d" }
    );

    return reply.send({
      success: true,
      token: accessToken,
      refreshToken: refreshToken,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
        isColaborador: user.isColaborador,
      },
    });
  }

  // Gerando o refresh token pra garantir sessão
  static async refreshToken(request: FastifyRequest, reply: FastifyReply) {
    const body = request.body as RefreshTokenBody;
    let tokenToRefresh = body?.refreshToken;

    if (!tokenToRefresh) {
      tokenToRefresh = request.headers.authorization?.split(" ")[1];
    }

    if (!tokenToRefresh) {
      return reply.status(400).send({ message: "Token não fornecido" });
    }

    try {
      let decodedPayload: TokenPayload & { type?: string };

      try {
        decodedPayload = (request.server as any).jwt.verify(tokenToRefresh);
      } catch (err: any) {
        if (err.message.includes("expired")) {
          decodedPayload = (request.server as any).jwt.decode(tokenToRefresh);
        } else {
          return reply.status(401).send({ message: "Token inválido" });
        }
      }

      if (!decodedPayload?.id) {
        return reply.status(401).send({ message: "Token inválido" });
      }

      const user = await UserService.getUserById(decodedPayload.id);
      if (!user) {
        return reply.status(401).send({ message: "Usuário não encontrado" });
      }

      const newAccessToken = (request.server as any).jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        { expiresIn: "1h" }
      );

      const newRefreshToken = (request.server as any).jwt.sign(
        { id: user._id, isAdmin: user.isAdmin, type: "refresh" },
        { expiresIn: "7d" }
      );

      return reply.send({
        success: true,
        token: newAccessToken,
        refreshToken: newRefreshToken,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          isAdmin: user.isAdmin,
          isColaborador: user.isColaborador,
        },
      });
    } catch (error) {
      console.error("Erro ao renovar token:", error);
      return reply.status(401).send({ message: "Falha ao renovar o token" });
    }
  }
}
