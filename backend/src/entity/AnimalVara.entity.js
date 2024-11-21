"use strict";
import { EntitySchema } from "typeorm";

const AnimalVaraSchema = new EntitySchema({
  name: "AnimalVara",
  tableName: "animal_vara",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
      unique: true,
    },
    fechaLlegada: {
      type: "date",
      nullable: false,
      default: () => "CURRENT_DATE",
    },
    temperaturaLlegada: {
      type: "double precision",
      nullable: false,
    },
    recibidoPor: {
      type: "varchar",
      length: 100,
      nullable: false,
    },
    precioTotalVara: {
      type: "int",
      nullable: false,
    },
  },
  relations: {
    tipoAnimal: {
      type: "many-to-one",
      target: "AnimalCorte",
      joinColumn: {
        name: "tipoAnimalNombreLista", 
        referencedColumnName: "nombreLista",
      },
    },
  },
  checks: [
    {
      expression: "\"temperaturaLlegada\" >= -50 AND \"temperaturaLlegada\" <= 50",
      name: "temperatura_llegada_rango",
    },
    {
      expression: "\"fechaLlegada\" <= CURRENT_DATE",
      name: "fecha_llegada_valida",
    },
  ],
});

export default AnimalVaraSchema;
