import { EntitySchema } from "typeorm";

// Categorías para productos no cárnicos
const CATEGORIASNOCARNICAS = [
  "Bebidas",
  "Huevos",
  "Condimentos",
  "Artículos parrilleros",
  "Verduras",
  "Quesos",
  "Licores",
  "Carbón",
  "Productos congelados",
  "Pescado",
  "Mariscos",
];

// Categorías para productos cárnicos
const CATEGORIASCARNICAS = [
  "Carnes",
  "Pollo",
  "Cerdo",
  "Pechugas",
  "Chuletas",
  "Lomo",
  "Longanizas",
  "Costillares",
];

// Lista combinada de todas las categorías
const CATEGORIAS = [...CATEGORIASNOCARNICAS, ...CATEGORIASCARNICAS];

// Definición de la entidad de Categoría
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
    tipo_producto: {
      type: "varchar",
      length: 50,
      nullable: false,
      default: "No Cárnico", // Valor predeterminado
    },
  },
  relations: {
    productosNoCarnicos: {
      type: "one-to-many",
      target: "productosNoCarnicos",
      inverseSide: "categoria", // Relación bidireccional
    },
    productosCarnicos: {
      type: "one-to-many",
      target: "ProductosCarnicos",
      inverseSide: "categoria", // Relación bidireccional
    },
  },
});

export { CategoriaSchema, CATEGORIAS, CATEGORIASNOCARNICAS, CATEGORIASCARNICAS };
