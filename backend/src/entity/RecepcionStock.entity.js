import { EntitySchema } from "typeorm";

const RecepcionStock = new EntitySchema({
  name: "RecepcionStock",
  tableName: "recepciones_stock",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    cantidad: {
      type: "int",
      nullable: false,
    },
    costoUnitario: {
      type: "decimal",
      precision: 10,
      scale: 2,
      nullable: false,
    },
    fecha: {
      type: "timestamp",
      createDate: true,
    },
    fechaVencimiento: {
      type: "date",
      nullable: true,
    },
  },
  relations: {
    producto: {
      type: "many-to-one",
      target: "Producto",
      joinColumn: true,
      eager: true,
    },
  },
});

export default RecepcionStock;
