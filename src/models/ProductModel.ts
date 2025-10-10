import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
}

const ProductSchema = new Schema<IProduct>({
  name: { type: String, required: true },
});

export const Product = mongoose.model<IProduct>("Product", ProductSchema);
