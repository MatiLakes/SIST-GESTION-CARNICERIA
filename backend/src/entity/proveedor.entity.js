import { EntitySchema } from "typeorm";

const ProveedorSchema = new EntitySchema({
  name: "Proveedor",
  tableName: "proveedores",
  columns: {    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    rut: {
      type: "varchar",
      length: 12,
      nullable: false,
      unique: true,
    },
    nombre: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    direccion: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    banco: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    numeroCuenta: {
      type: "varchar",
      length: 50,
      nullable: false,
    },
    tipoCuenta: {
      type: "varchar",
      length: 50,
      nullable: false,
    },
    nombreEncargado: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    movilEncargado: {
      type: "simple-array",
      nullable: false,
    },
    createdAt: {
      type: "timestamp with time zone",
      default: () => "CURRENT_TIMESTAMP",
      nullable: false,
    },
    updatedAt: {
      type: "timestamp with time zone",
      default: () => "CURRENT_TIMESTAMP",
      onUpdate: "CURRENT_TIMESTAMP",
      nullable: false,
    },
  },
});

export default ProveedorSchema;
