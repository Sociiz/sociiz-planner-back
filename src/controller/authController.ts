import { FastifyReply, FastifyRequest } from "fastify";
import { UserService } from "../services/UserServices";

interface TokenPayload {
  id: string;
  isAdmin: boolean;
  isColaborador: boolean; // Agora consigo identificar quando é um colaborador ou não pra filtrar e conseguir mostrar tudo dele na tela
}

interface RefreshTokenBody {
  refreshToken?: string;
}

export class AuthController {
  static async register(request: FastifyRequest, reply: FastifyReply) {
    const { email, password, username, isAdmin, isColaborador } =
      request.body as any;

    try {
      // Cria usuário com o campo isAdmin
      const user = await UserService.createUser({
        email,
        password,
        username,
        isAdmin,
        isColaborador,
      });

      // Cria tokens já contendo isAdmin
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

  static async login(request: FastifyRequest, reply: FastifyReply) {
    const { email, password } = request.body as any;

    const user = await UserService.getUserByEmail(email);
    if (!user)
      return reply.status(400).send({ message: "Usuário não encontrado" });

    const valid = await import("bcryptjs").then((b) =>
      b.compare(password, user.password)
    );
    if (!valid) return reply.status(400).send({ message: "Senha inválida" });

    // Aqui quando to mandando o token to validando se é admin ou nao
    const accessToken = (request.server as any).jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      { expiresIn: "1h" }
    );
    // no refresh tbm vou precisar, se não como vou saber ué
    const refreshToken = (request.server as any).jwt.sign(
      { id: user._id, isAdmin: user.isAdmin, type: "refresh" },
      { expiresIn: "7d" }
    );

    // no retorno do endpoint to mandando isAdmin pra realmente ver se o cara é admin ou n
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

      // novos tokens e refreshtoken tambem preciso verificar se admin ou n
      const newAccessToken = (request.server as any).jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        { expiresIn: "1h" }
      );

      const newRefreshToken = (request.server as any).jwt.sign(
        { id: user._id, isAdmin: user.isAdmin, type: "refresh" },
        { expiresIn: "7d" }
      );

      // tbm devolvo o isAdmin
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
