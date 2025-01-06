"use strict";
import { EntitySchema } from "typeorm";

const SubproductoSchema = new EntitySchema({
  name: "Subproducto",
  tableName: "subproductos",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
      unique: true,
    },
    fechaFaena: {
      type: "date",
      nullable: false,
    },
    numeroAnimalesFaenados: {
      type: "int",
      nullable: false,
    },
    fechaEntrega: {
      type: "date",
      nullable: false,
    },
    guataDecomisados: {
      type: "int",
      nullable: false,
      default: 0,
    },
    guataEntregados: {
      type: "int",
      nullable: false,
      default: 0,
    },
    precioGuata: {
      type: "double precision",
      nullable: false,
      default: 0.0,
    },
    corazonDecomisados: {
      type: "int",
      nullable: false,
      default: 0,
    },
    corazonEntregados: {
      type: "int",
      nullable: false,
      default: 0,
    },
    precioCorazon: {
      type: "double precision",
      nullable: false,
      default: 0.0,
    },
    cabezasDecomisados: {
      type: "int",
      nullable: false,
      default: 0,
    },
    cabezasEntregados: {
      type: "int",
      nullable: false,
      default: 0,
    },
    precioCabezas: {
      type: "double precision",
      nullable: false,
      default: 0.0,
    },
    lenguasDecomisados: {
      type: "int",
      nullable: false,
      default: 0,
    },
    lenguasEntregados: {
      type: "int",
      nullable: false,
      default: 0,
    },
    precioLenguas: {
      type: "double precision",
      nullable: false,
      default: 0.0,
    },
    chunchulDecomisados: {
      type: "int",
      nullable: false,
      default: 0,
    },
    chunchulEntregados: {
      type: "int",
      nullable: false,
      default: 0,
    },
    precioChunchul: {
      type: "double precision",
      nullable: false,
      default: 0.0,
    },
    higadoDecomisados: {
      type: "int",
      nullable: false,
      default: 0,
    },
    higadoEntregados: {
      type: "int",
      nullable: false,
      default: 0,
    },
    precioHigado: {
      type: "double precision",
      nullable: false,
      default: 0.0,
    },
    rinonDecomisados: {
      type: "int",
      nullable: false,
      default: 0,
    },
    rinonEntregados: {
      type: "int",
      nullable: false,
      default: 0,
    },
    precioRinon: {
      type: "double precision",
      nullable: false,
      default: 0.0,
    },
    patasDecomisados: {
      type: "int",
      nullable: false,
      default: 0,
    },
    patasEntregados: {
      type: "int",
      nullable: false,
      default: 0,
    },
    precioPatas: {
      type: "double precision",
      nullable: false,
      default: 0.0,
    },
    charchaDecomisados: {
      type: "int",
      nullable: false,
      default: 0,
    },
    charchaEntregados: {
      type: "int",
      nullable: false,
      default: 0,
    },
    precioCharcha: {
      type: "double precision",
      nullable: false,
      default: 0.0,
    },
  },
});

export default SubproductoSchema;
