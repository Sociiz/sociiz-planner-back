import { FastifyReply, FastifyRequest } from "fastify";
import { UserService } from "../services/UserServices";

interface TokenPayload {
  id: string;
}

interface RefreshTokenBody {
  refreshToken?: string;
}

export class AuthController {
  static async register(request: FastifyRequest, reply: FastifyReply) {
    const { email, password, username } = request.body as any;

    try {
      const user = await UserService.createUser({ email, password, username });

      const accessToken = (request.server as any).jwt.sign(
        { id: user._id },
        { expiresIn: "1h" }
      );

      const refreshToken = (request.server as any).jwt.sign(
        { id: user._id, type: "refresh" },
        { expiresIn: "7d" }
      );

      return reply.send({
        token: accessToken,
        refreshToken: refreshToken,
      });
    } catch (err: any) {
      return reply.status(400).send({ message: err.message });
    }
  }

  static async login(request: FastifyRequest, reply: FastifyReply) {
    const { email, password } = request.body as any;

    const user = await UserService.getUserByEmail(email);
    if (!user)
      return reply.status(400).send({ message: "Usuário não encontrado" });

    const valid = await import("bcryptjs").then((b) =>
      b.compare(password, user.password)
    );
    if (!valid) return reply.status(400).send({ message: "Senha inválida" });

    // Token de acesso (curta duração)
    const accessToken = (request.server as any).jwt.sign(
      { id: user._id },
      { expiresIn: "1h" }
    );

    const refreshToken = (request.server as any).jwt.sign(
      { id: user._id, type: "refresh" },
      { expiresIn: "7d" }
    );

    return reply.send({
      token: accessToken,
      refreshToken: refreshToken,
    });
  }

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
        decodedPayload = (request.server as any).jwt.verify(
          tokenToRefresh
        ) as TokenPayload & { type?: string };
      } catch (err: any) {
        if (err.message.includes("expired")) {
          decodedPayload = (request.server as any).jwt.decode(
            tokenToRefresh
          ) as TokenPayload & { type?: string };
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
        { id: user._id },
        { expiresIn: "1h" }
      );

      const newRefreshToken = (request.server as any).jwt.sign(
        { id: user._id, type: "refresh" },
        { expiresIn: "7d" }
      );

      return reply.send({
        token: newAccessToken,
        refreshToken: newRefreshToken,
      });
    } catch (error) {
      console.error("Erro ao renovar token:", error);
      return reply.status(401).send({ message: "Falha ao renovar o token" });
    }
  }
}
