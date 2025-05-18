"use strict";

import { EntitySchema } from "typeorm";

const ClienteSchema = new EntitySchema({
  name: "Cliente",
  tableName: "clientes",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    tipoCliente: {
      type: "enum",
      enum: ["Empresa", "Persona"],
      nullable: false,
    },
    rut: {
      type: "varchar",
      length: 12,
      nullable: false,
      unique: true,
    },
    razonSocial: {
      type: "varchar",
      length: 100,
      nullable: true,
    },
    giro: {
      type: "varchar",
      length: 100,
      nullable: true,
    },
    nombres: {
      type: "varchar",
      length: 50,
      nullable: true,
    },
    apellidos: {
      type: "varchar",
      length: 50,
      nullable: true,
    },
    direccion: {
      type: "varchar",
      length: 100,
      nullable: false,
    },
    comuna: {
      type: "varchar",
      length: 50,
      nullable: false,
    },
    ciudad: {
      type: "varchar",
      length: 50,
      nullable: false,
    },
    region: {
      type: "varchar",
      length: 50,
      nullable: true,
    },
    email: {
      type: "varchar",
      length: 100,
      nullable: true,
    },
    telefono: {
      type: "varchar",
      length: 20,
      nullable: true,
    }
  }
});

export default ClienteSchema;
