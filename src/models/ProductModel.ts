import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  imageBase64?: string;
}

const ProductSchema = new Schema<IProduct>({
  name: { type: String, required: true },
  imageBase64: { type: String, required: false },
});

export const Product = mongoose.model<IProduct>(
  "Product",
  ProductSchema,
  "Produto"
);
