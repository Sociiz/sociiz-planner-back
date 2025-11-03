import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  coverImage?: string;
}

const ProductSchema = new Schema<IProduct>({
  name: { type: String, required: true },
  coverImage: { type: String },
});

export const Product = mongoose.model<IProduct>(
  "Product",
  ProductSchema,
  "Produto"
);
