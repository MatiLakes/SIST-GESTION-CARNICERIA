import { EntitySchema } from "typeorm";

const RegistroTemperatura = new EntitySchema({
  name: "RegistroTemperatura",
  tableName: "registros_temperatura",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    hora: {
      type: "time",
      nullable: false,
    },
    equipo: {
      type: "varchar",
      nullable: false,
    },
    temperatura: {
      type: "decimal",
      precision: 4,
      scale: 1,
      nullable: false,
    },
    funciona: {
      type: "boolean",
      nullable: false,
    },
    motivo: {
      type: "varchar",
      nullable: true,
    },
    AccionCorrectiva: {
      type: "varchar",
      nullable: true,
    },
  },
  relations: {
    documento: {
      type: "many-to-one",
      target: "DocumentoTemperatura",
      joinColumn: true,
    },
    responsable: {
      type: "many-to-one",
      target: "Personal",
      joinColumn: true,
      nullable: false,
    },
  },
});

export default RegistroTemperatura;
