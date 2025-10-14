import mongoose, { Schema, Document } from "mongoose";

export interface ITag extends Document {
  name: string;
}

const TagSchema = new Schema<ITag>({
  name: { type: String, required: true },
});

export const Tag = mongoose.model<ITag>("Tag", TagSchema, "Tags");
