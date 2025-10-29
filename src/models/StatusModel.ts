import mongoose, { Schema, Document } from "mongoose";

export interface IStatus extends Document {
  name: string;
}

const StatusSchema = new Schema<IStatus>({
  name: { type: String, required: true },
});

export const Status = mongoose.model<IStatus>("Status", StatusSchema, "Status");
