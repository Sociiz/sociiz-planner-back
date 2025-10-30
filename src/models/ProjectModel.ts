import mongoose, { Schema, Document } from "mongoose";

export interface IProject extends Document {
  name: string;
  coverImage?: string;
}

const ProjectSchema = new Schema<IProject>({
  name: { type: String, required: true },
  coverImage: { type: String },
});

export const Project = mongoose.model<IProject>(
  "Project",
  ProjectSchema,
  "Projetos"
);
