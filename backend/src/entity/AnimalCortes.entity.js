"use strict";
import { EntitySchema } from "typeorm";

const AnimalCortesSchema = new EntitySchema({
  name: "AnimalCorte",
  tableName: "animal_cortes",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    nombreCorte: {
      type: "varchar",
      length: 50, // Limita el nombre del corte a 50 caracteres
      nullable: false,
    },
    cantidadKilos: {
      type: "double precision",
      nullable: false,
      default: 0.0,
    },
    precioPorKilo: {
      type: "int", // Precio en CLP, debe ser entero
      nullable: false,
      default: 0,
    },
    tipoAnimal: {
      type: "varchar",
      length: 50, // Limita el tipo de animal a 50 caracteres
      nullable: false,
    },
  },
  indices: [
    {
      name: "IDX_ANIMAL_CORTES_UNIQUE",
      columns: ["tipoAnimal", "nombreCorte"],
      unique: true,
    },
  ],
  checks: [
    {
      expression: `"cantidadKilos" >= 0`, // Asegura que cantidadKilos no sea negativo
      name: "cantidad_kilos_no_negativo",
    },
    {
      expression: `"precioPorKilo" >= 0`, // Asegura que precioPorKilo no sea negativo
      name: "precio_por_kilo_no_negativo",
    },
  ],
});

export default AnimalCortesSchema;
