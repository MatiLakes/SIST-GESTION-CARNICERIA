import { EntitySchema } from "typeorm";

const DocumentoTrazabilidadSchema = new EntitySchema({
  name: "DocumentoTrazabilidad",
  tableName: "documentos_trazabilidad",
  columns: {
    id: { primary: true, type: "int", generated: true },
    fecha: { type: "date", nullable: false },
  },
  relations: {
    registros: {
      type: "one-to-many",
      target: "RegistroTrazabilidad",
      inverseSide: "documento",
      cascade: true,
    },
  },
});

export default DocumentoTrazabilidadSchema;
