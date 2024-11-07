"use strict";
import { EntitySchema } from "typeorm";
import AnimalCorte from "./AnimalCortes.entity.js";

const AnimalVaraSchema = new EntitySchema({
  name: "AnimalVara",
  tableName: "animal_varas",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    numeroVara: {
      type: "int",
      nullable: false,
      unique: true,
    },
    fechaLlegada: {
      type: "date",
      default: () => "CURRENT_DATE",
      nullable: false,
    },
    temperaturaLlegada: {
      type: "double precision",
      nullable: false,
    },
    nombreRecibidor: {
      type: "varchar",
      length: 50,
      nullable: false,
    },
    precioTotal: {
      type: "int", // Precio total en CLP
      nullable: false,
    },
  },
  relations: {
    tipoAnimal: {
      type: "many-to-one",
      target: "AnimalCorte",
      joinColumn: { name: "tipoAnimalId" },
      cascade: true,
      nullable: false,
    },
  },
  checks: [
    {
      expression: `"fechaLlegada" <= CURRENT_DATE`, // La fecha de llegada no puede ser futura
      name: "fecha_llegada_no_futuro",
    },
    {
      expression: `"precioTotal" >= 0`, // El precio total no puede ser negativo
      name: "precio_total_no_negativo",
    },
    {
      expression: `"temperaturaLlegada" >= -30 AND "temperaturaLlegada" <= 50`, // Rango aceptable para temperatura
      name: "temperatura_rango",
    },
  ],
});

export default AnimalVaraSchema;
