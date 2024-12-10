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
    nombreEncargado: {
      type: "varchar",
      length: 255,
      nullable: true,
    },
    contactosEncargado: {
      type: "json",
      nullable: true, // Opcional
      comment: "Lista de números de contacto del encargado con tipo (teléfono/móvil) y número",
    },
    nombreRepartidor: {
      type: "varchar",
      length: 255,
      nullable: true,
    },
    contactosRepartidor: {
      type: "json",
      nullable: true, // Opcional
      comment: "Lista de números de contacto del repartidor con tipo (teléfono/móvil) y número",
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
  relations: {
    categorias: {
      type: "many-to-many",
      target: "Categoria",
      joinTable: {
        name: "categoria_proveedor",
        joinColumn: { name: "proveedorId", referencedColumnName: "id" },
        inverseJoinColumn: { name: "categoriaId", referencedColumnName: "id" },
      },
    },
  },
});

export default ProveedorSchema;
