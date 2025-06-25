import { EntitySchema } from "typeorm";

const DocumentoTemperatura = new EntitySchema({
  name: "DocumentoTemperatura",
  tableName: "documentos_temperatura",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    fecha: {
      type: "date",
      nullable: false,
    },
  },
  relations: {
    registros: {
      type: "one-to-many",
      target: "RegistroTemperatura",
      inverseSide: "documento",
      cascade: true,
    },
  },
});

export default DocumentoTemperatura;
