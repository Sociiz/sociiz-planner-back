import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) throw new Error("MONGO_URI não configurada");

    await mongoose.connect(mongoUri);
    console.log("Conectado ao MongoDB");
  } catch (err) {
    console.error("Erro ao conectar ao MongoDB:", err);
    process.exit(1);
  }
};
