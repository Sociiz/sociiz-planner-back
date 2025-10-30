import mongoose, { Document, Schema } from "mongoose";

export interface INote extends Document {
  content: string;
  timestamp: number;
  createdAt: Date;
  updatedAt: Date;
}

const noteSchema = new Schema<INote>(
  {
    content: {
      type: String,
      required: true,
      trim: true,
    },
    timestamp: {
      type: Number,
      required: true,
      default: () => Date.now(),
    },
  },
  {
    timestamps: true,
  }
);

noteSchema.index({ timestamp: -1 });

export const Note = mongoose.model<INote>("Note", noteSchema);
