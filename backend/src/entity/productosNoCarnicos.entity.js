import { EntitySchema } from "typeorm";

const productosNoCarnicosSchema = new EntitySchema({
  name: "productosNoCarnicos",
  tableName: "productos_nocarnicos",
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
    },
    cantidad_recibida: {
      type: "int",
      nullable: false,
    },
    precio_compra: {
      type: "decimal",
      precision: 10,
      scale: 2,
      nullable: false,
    },
    precio_venta: {
      type: "decimal",
      precision: 10,
      scale: 2,
      nullable: false,
    },
    fecha_vencimiento: {
      type: "date",
      nullable: true,
    },
    fecha_llegada: {
      type: "date",
      default: () => "CURRENT_DATE", // Fecha por defecto
    },
  },
  relations: {
    categoria: {
      type: "many-to-one",
      target: "Categoria",
      joinColumn: true,
      nullable: false, // La categoría es obligatoria
    },
  },
});

export default productosNoCarnicosSchema ;
