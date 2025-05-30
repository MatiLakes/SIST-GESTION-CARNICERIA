import { EntitySchema } from "typeorm";

const PersonalSchema = new EntitySchema({
  name: "Personal",
  tableName: "personal",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    nombre: {
      type: "varchar",
      length: 100,
    },
    seccion: {
      type: "varchar",
      length: 100,
    }
  }
});

export default PersonalSchema;
