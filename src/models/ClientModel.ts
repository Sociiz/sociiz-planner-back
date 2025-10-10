import mongoose, { Schema, Document } from "mongoose";

export interface IClient extends Document {
  name: string;
}

const ClientSchema = new Schema<IClient>({
  name: { type: String, required: true },
});

export const Client = mongoose.model<IClient>(
  "Cliente",
  ClientSchema,
  "Clientes"
);
