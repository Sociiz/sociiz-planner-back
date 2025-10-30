import mongoose, { Schema, Document } from "mongoose";

export interface IProject extends Document {
  name: string;
  imageUrl?: string;
}

const ProjectSchema = new Schema<IProject>({
  name: { type: String, required: true },
  imageUrl: { type: String, required: false },
});

export const Project = mongoose.model<IProject>(
  "Project",
  ProjectSchema,
  "Projetos"
);
