import { Comment, IComment } from "../models/CommentModel";
import mongoose from "mongoose";

export class CommentService {
  async createComment(
    taskId: string,
    content: string,
    userId: string
  ): Promise<IComment> {
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      throw new Error("ID de tarefa inválido");
    }

    const comment = new Comment({
      taskId,
      userId,
      content,
    });

    const savedComment = await comment.save();

    // Adiciona informações do usuário
    const populatedComment = await Comment.findById(savedComment._id)
      .populate("userId", "name username email")
      .exec();

    if (!populatedComment) {
      throw new Error("Erro ao criar comentário");
    }

    return populatedComment;
  }

  async getCommentsByTaskId(taskId: string): Promise<IComment[]> {
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      throw new Error("ID de tarefa inválido");
    }

    return await Comment.find({ taskId })
      .populate("userId", "name username email")
      .sort({ createdAt: 1 })
      .exec();
  }

  async getCommentById(id: string): Promise<IComment | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("ID de comentário inválido");
    }

    return await Comment.findById(id)
      .populate("userId", "name username email")
      .exec();
  }

  async updateComment(
    id: string,
    content: string,
    userId: string
  ): Promise<IComment | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("ID de comentário inválido");
    }

    // Verifica se o comentário pertence ao usuário
    // pois so permite editar o proprio comentario
    const comment = await Comment.findOne({
      _id: id,
      userId,
    });

    if (!comment) {
      throw new Error("Comentário não encontrado ou sem permissão");
    }

    return await Comment.findByIdAndUpdate(
      id,
      { content },
      { new: true, runValidators: true }
    )
      .populate("userId", "name username email")
      .exec();
  }

  async deleteComment(id: string, userId: string): Promise<boolean> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("ID de comentário inválido");
    }

    // Verifica se o comentário pertence ao usuário
    // tbm so pode deletar o proprio comentário
    const comment = await Comment.findOne({
      _id: id,
      userId,
    });

    if (!comment) {
      throw new Error("Comentário não encontrado ou sem permissão");
    }

    const result = await Comment.findByIdAndDelete(id).exec();
    return result !== null;
  }

  async getCommentCount(taskId: string): Promise<number> {
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      throw new Error("ID de tarefa inválido");
    }

    return await Comment.countDocuments({ taskId });
  }

  async deleteCommentsByTaskId(taskId: string): Promise<number> {
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      throw new Error("ID de tarefa inválido");
    }

    const result = await Comment.deleteMany({ taskId }).exec();
    return result.deletedCount || 0;
  }
}
