import mongoose, { Schema, Document } from "mongoose";

export interface IClient extends Document {
  name: string;
  imageBase64?: string;
}

const ClientSchema = new Schema<IClient>({
  name: { type: String, required: true },
  imageBase64: { type: String, default: null },
});

export const Client = mongoose.model<IClient>(
  "Cliente",
  ClientSchema,
  "Clientes"
);
