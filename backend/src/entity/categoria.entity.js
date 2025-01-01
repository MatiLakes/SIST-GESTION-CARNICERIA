"use strict";
import { EntitySchema } from "typeorm";

const CATEGORIAS = [
  "Bebidas",
  "Huevos",
  "Condimentos",
  "Artículos parrilleros",
  "Verduras",
  "Quesos",
  "Cecinas",
  "Productos congelados",
  "Pescado",
  "Mariscos",
  "Carnes",
  "Carbón",
  "Licores",
];

const CategoriaSchema = new EntitySchema({
  name: "Categoria",
  tableName: "categorias",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    nombre: {
      type: "varchar",
      length: 255,
      nullable: false,
      unique: true,
    },
  },
});

// Puedes usar este array para crear categorías iniciales en la base de datos al arrancar la app
async function crearCategoriasIniciales() {
  const categoriaRepository = AppDataSource.getRepository("Categoria");
  
  // Verificar si ya existen categorías en la base de datos
  const categoriasExistentes = await categoriaRepository.find();
  if (categoriasExistentes.length === 0) {
    // Si no existen, creamos las categorías predeterminadas
    const categorias = CATEGORIAS.map((nombre) => ({ nombre }));
    await categoriaRepository.save(categorias);
    console.log("Categorías iniciales creadas");
  }
}

export { CategoriaSchema, CATEGORIAS, crearCategoriasIniciales };
