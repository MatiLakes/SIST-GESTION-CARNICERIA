import { EntitySchema } from "typeorm";

const ControlHigieneSchema = new EntitySchema({
  name: "ControlHigiene",
  tableName: "controles_higiene",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    fecha: {
      type: "date",
    },
    usoCofia: {
      type: "boolean",
    },
    usoMascarilla: {
      type: "boolean",
    },
    higieneManos: {
      type: "boolean",
    },
    unasCortas: {
      type: "boolean",
    },
    afeitado: {
      type: "boolean",
    },
    uniformeLimpio: {
      type: "boolean",
    },
    sinAccesorios: {
      type: "boolean",
    },
    observacion: {
      type: "text",
      nullable: true,
    },
    nroAccionCorrectiva: {
      type: "enum",
      enum: ["ACC N°1", "ACC N°2", "ACC N°3", "ACC N°4", "ACC N°5", "ACC N°6", "ACC N°7", "No Aplica"],
      nullable: false,
      default: "No Aplica",
    },
    vbCumplimiento: {
      type: "enum",
      enum: ["C", "NC"],
      nullable: false,
    }
  },
  relations: {
    personal: {
      type: "many-to-one",
      target: "Personal",
      joinColumn: true,
      eager: true
    }
  }
});

export default ControlHigieneSchema;
