import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  imageUrl?: string;
}

const ProductSchema = new Schema<IProduct>({
  name: { type: String, required: true },
  imageUrl: { type: String, required: false },
});

export const Product = mongoose.model<IProduct>(
  "Product",
  ProductSchema,
  "Produto"
);
