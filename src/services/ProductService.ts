import { Product, IProduct } from "../models/ProductModel";

export class ProductService {
  static async createProduct(data: Partial<IProduct>) {
    const product = new Product(data);
    return product.save();
  }

  static async getAllProducts() {
    return Product.find();
  }

  static async getProductById(id: string) {
    return Product.findById(id);
  }

  static async updateProduct(id: string, data: Partial<IProduct>) {
    return Product.findByIdAndUpdate(id, data, { new: true });
  }

  static async deleteProduct(id: string) {
    return Product.findByIdAndDelete(id);
  }
}
