import { EntitySchema } from "typeorm";

const ProveedorSchema = new EntitySchema({
  name: "Proveedor",
  tableName: "proveedores",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    nombre: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    direccion: {
      type: "varchar",
      length: 255,
      nullable: true,
    },
    banco: {
      type: "varchar",
      length: 255,
      nullable: true,
    },
    numeroCuenta: {
      type: "varchar",
      length: 50,
      nullable: true,
    },
    tipoCuenta: {
      type: "varchar",
      length: 50,
      nullable: true,
    },

    // Campos para el encargado
    idEncargado: {
      type: "int",
      nullable: true,
      generated: true,
    },
    nombreEncargado: {
      type: "varchar",
      length: 255,
      nullable: true,
    },
    estadoEncargado: {
      type: "boolean",
      nullable: false,
      default: true, 
    },
    movilEncargado: {
      type: "varchar", 
      length: 50,
      nullable: true,
    },
    telefonoEncargado: {
      type: "varchar", 
      length: 50,
      nullable: true,
    },


    idRepartidor: {
      type: "int",
      nullable: true,
      generated: true,
    },
    nombreRepartidor: {
      type: "varchar",
      length: 255,
      nullable: true,
    },
    estadoRepartidor: {
      type: "boolean",
      nullable: false,
      default: true,
    },
    movilRepartidor: {
      type: "varchar", 
      nullable: true,
    },
    telefonoRepartidor: {
      type: "varchar", 
      length: 50,
      nullable: true,
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
