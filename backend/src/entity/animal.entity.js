"use strict";
import { EntitySchema } from "typeorm";

const AnimalSchema = new EntitySchema({
  name: "Animal",
  tableName: "Animals",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    fechaRecepcion: {
      type: "date",
      nullable: false,
    },
    cantidad: {
      type: "int",
      nullable: false,
    },
    createdAt: {
      type: "timestamp with time zone",
      default: () => "CURRENT_TIMESTAMP",
      nullable: false,
    },
    updatedAt: {
      type: "timestamp with time zone",
      default: () => "CURRENT_TIMESTAMP",
      onUpdate: "CURRENT_TIMESTAMP",
      nullable: false,
    },
  },
  indices: [
    {
      name: "IDX_ANIMAL",
      columns: ["id"],
      unique: true,
    },
  ],
});

export default AnimalSchema;