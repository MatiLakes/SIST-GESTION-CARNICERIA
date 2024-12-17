"use strict";
import { DataSource } from "typeorm";
import dotenv from "dotenv";

// Carga las variables de entorno desde el archivo .env
dotenv.config();

// Verifica que la variable DB_URL esté definida
if (!process.env.DB_URL) {
  console.error("❌ Error: La variable de entorno DB_URL no está definida.");
  process.exit(1);
}

// Configuración del DataSource de TypeORM
export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DB_URL, // Usa directamente la URL de conexión
  entities: ["src/entity/**/*.js"], // Define las entidades de TypeORM
  synchronize: process.env.NODE_ENV !== "production", // Sincroniza solo en desarrollo
  logging: process.env.NODE_ENV === "development", // Logs solo en desarrollo
});

export async function connectDB() {
  try {
    await AppDataSource.initialize();
    console.log("✅ Conexión exitosa a la base de datos!");
  } catch (error) {
    console.error("❌ Error al conectar con la base de datos:", error.message);
    process.exit(1); // Detiene la ejecución si no se puede conectar
  }
}
