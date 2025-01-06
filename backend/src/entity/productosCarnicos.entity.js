import { EntitySchema } from "typeorm";

const productosCarnicosSchema = new EntitySchema({
  name: "ProductosCarnicos",
  tableName: "productos_carnicos",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    tipo_producto: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    marca: {
      type: "varchar",
      length: 100,
      nullable: true,
    },
    cantidad_kg: {
      type: "decimal",
      precision: 10,
      scale: 2,
      nullable: false,
    },
    precio_kg_compra: {
      type: "decimal",
      precision: 10,
      scale: 2,
      nullable: false,
    },
    precio_kg_venta: {
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
      default: () => "CURRENT_DATE",
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

export default  productosCarnicosSchema ;
