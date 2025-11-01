import mongoose, { Document, Schema, Types } from "mongoose";

export interface IComment extends Document {
  taskId: Types.ObjectId;
  userId: Types.ObjectId;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new Schema<IComment>(
  {
    taskId: {
      type: Schema.Types.ObjectId,
      ref: "Task",
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
  },
  {
    timestamps: true,
  }
);

// Index composto para buscar comentários por task
commentSchema.index({ taskId: 1, createdAt: -1 });

export const Comment = mongoose.model<IComment>(
  "Comment",
  commentSchema,
  "Comentários"
);
