"use strict";
import { EntitySchema } from "typeorm";

const AnimalCorteSchema = new EntitySchema({
  name: "AnimalCorte",
  tableName: "animal_corte",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
      unique: true,
    },
    nombreLista: {
      type: "varchar",
      length: 50,
      nullable: false,
      unique: true,
    },
    abastero: {
      type: "double precision",
      nullable: false,
      default: 0.0,
    },
    precioAbastero: {
      type: "int",
      nullable: false,
      default: 0,
    },
    asadoTira: {
      type: "double precision",
      nullable: false,
      default: 0.0,
    },
    precioAsadoTira: {
      type: "int",
      nullable: false,
      default: 0,
    },
    asadoCarnicero: {
      type: "double precision",
      nullable: false,
      default: 0.0,
    },
    precioAsadoCarnicero: {
      type: "int",
      nullable: false,
      default: 0,
    },
    asiento: {
      type: "double precision",
      nullable: false,
      default: 0.0,
    },
    precioAsiento: {
      type: "int",
      nullable: false,
      default: 0,
    },
    choclillo: {
      type: "double precision",
      nullable: false,
      default: 0.0,
    },
    precioChoclillo: {
      type: "int",
      nullable: false,
      default: 0,
    },
    cogote: {
      type: "double precision",
      nullable: false,
      default: 0.0,
    },
    precioCogote: {
      type: "int",
      nullable: false,
      default: 0,
    },
    entraña: {
      type: "double precision",
      nullable: false,
      default: 0.0,
    },
    precioEntraña: {
      type: "int",
      nullable: false,
      default: 0,
    },
    filete: {
      type: "double precision",
      nullable: false,
      default: 0.0,
    },
    precioFilete: {
      type: "int",
      nullable: false,
      default: 0,
    },
    ganso: {
      type: "double precision",
      nullable: false,
      default: 0.0,
    },
    precioGanso: {
      type: "int",
      nullable: false,
      default: 0,
    },
    huachalomo: {
      type: "double precision",
      nullable: false,
      default: 0.0,
    },
    precioHuachalomo: {
      type: "int",
      nullable: false,
      default: 0,
    },
    lomoLiso: {
      type: "double precision",
      nullable: false,
      default: 0.0,
    },
    precioLomoLiso: {
      type: "int",
      nullable: false,
      default: 0,
    },
    lomoVetado: {
      type: "double precision",
      nullable: false,
      default: 0.0,
    },
    precioLomoVetado: {
      type: "int",
      nullable: false,
      default: 0,
    },
    palanca: {
      type: "double precision",
      nullable: false,
      default: 0.0,
    },
    precioPalanca: {
      type: "int",
      nullable: false,
      default: 0,
    },
    plateada: {
      type: "double precision",
      nullable: false,
      default: 0.0,
    },
    precioPlateada: {
      type: "int",
      nullable: false,
      default: 0,
    },
    polloBarriga: {
      type: "double precision",
      nullable: false,
      default: 0.0,
    },
    precioPolloBarriga: {
      type: "int",
      nullable: false,
      default: 0,
    },
    polloGanso: {
      type: "double precision",
      nullable: false,
      default: 0.0,
    },
    precioPolloGanso: {
      type: "int",
      nullable: false,
      default: 0,
    },
    postaNegra: {
      type: "double precision",
      nullable: false,
      default: 0.0,
    },
    precioPostaNegra: {
      type: "int",
      nullable: false,
      default: 0,
    },
    postaPaleta: {
      type: "double precision",
      nullable: false,
      default: 0.0,
    },
    precioPostaPaleta: {
      type: "int",
      nullable: false,
      default: 0,
    },
    postaRosada: {
      type: "double precision",
      nullable: false,
      default: 0.0,
    },
    precioPostaRosada: {
      type: "int",
      nullable: false,
      default: 0,
    },
    puntaGanso: {
      type: "double precision",
      nullable: false,
      default: 0.0,
    },
    precioPuntaGanso: {
      type: "int",
      nullable: false,
      default: 0,
    },
    puntaPicana: {
      type: "double precision",
      nullable: false,
      default: 0.0,
    },
    precioPuntaPicana: {
      type: "int",
      nullable: false,
      default: 0,
    },
    puntaPaleta: {
      type: "double precision",
      nullable: false,
      default: 0.0,
    },
    precioPuntaPaleta: {
      type: "int",
      nullable: false,
      default: 0,
    },
    sobrecostilla: {
      type: "double precision",
      nullable: false,
      default: 0.0,
    },
    precioSobrecostilla: {
      type: "int",
      nullable: false,
      default: 0,
    },
    tapabarriga: {
      type: "double precision",
      nullable: false,
      default: 0.0,
    },
    precioTapabarriga: {
      type: "int",
      nullable: false,
      default: 0,
    },
    tapapecho: {
      type: "double precision",
      nullable: false,
      default: 0.0,
    },
    precioTapapecho: {
      type: "int",
      nullable: false,
      default: 0,
    },
    huesoCarnudo: {
      type: "double precision",
      nullable: false,
      default: 0.0,
    },
    precioHuesoCarnudo: {
      type: "int",
      nullable: false,
      default: 0,
    },
    huesoCConCarne: {
      type: "double precision",
      nullable: false,
      default: 0.0,
    },
    precioHuesoCConCarne: {
      type: "int",
      nullable: false,
      default: 0,
    },
    pataVacuno: {
      type: "double precision",
      nullable: false,
      default: 0.0,
    },
    precioPataVacuno: {
      type: "int",
      nullable: false,
      default: 0,
    },
    huachalomoOlla: {
      type: "double precision",
      nullable: false,
      default: 0.0,
    },
    precioHuachalomoOlla: {
      type: "int",
      nullable: false,
      default: 0,
    },
    cazuelaPaleta: {
      type: "double precision",
      nullable: false,
      default: 0.0,
    },
    precioCazuelaPaleta: {
      type: "int",
      nullable: false,
      default: 0,
    },
    osobuco: {
      type: "double precision",
      nullable: false,
      default: 0.0,
    },
    precioOsobuco: {
      type: "int",
      nullable: false,
      default: 0,
    },
    lagarto: {
      type: "double precision",
      nullable: false,
      default: 0.0,
    },
    precioLagarto: {
      type: "int",
      nullable: false,
      default: 0,
    },
    costillaVacuno: {
      type: "double precision",
      nullable: false,
      default: 0.0,
    },
    precioCostillaVacuno: {
      type: "int",
      nullable: false,
      default: 0,
    },
    tapaposta: {
      type: "double precision",
      nullable: false,
      default: 0.0,
    },
    precioTapaposta: {
      type: "int",
      nullable: false,
      default: 0,
    },
    malaya: {
      type: "double precision",
      nullable: false,
      default: 0.0,
    },
    precioMalaya: {
      type: "int",
      nullable: false,
      default: 0,
    },
  },
});

export default AnimalCorteSchema;