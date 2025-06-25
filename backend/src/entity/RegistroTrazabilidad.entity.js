import { EntitySchema } from "typeorm";

const cortesDeCarne = [
  "LOMO VETADO",
  "HUACHALOMO PARRILLA",
  "PLATEADA",
  "MALAYA",
  "HUACHALOMO OLLA",
  "SOBRECOSTILLA",
  "TAPAPECHO",
  "POSTA PALETA",
  "CHOCLILLO",
  "CARNICERO",
  "LAGARTO",
  "COGOTE",
  "GRASA DESPUNTE",
  "FILETE",
  "LOMO LISO",
  "BIFE CHORIZO",
  "TRARO",
  "PALANCA",
  "TAPABARRIGA",
  "POSTA NEGRA",
  "TAPAPOSTA",
  "POLLO GANSO",
  "GANSO",
  "PTA. DE GANSO",
  "ASIENTO",
  "PTA. PICANA",
  "POSTA ROSADA",
  "ABASTERO"
];

const RegistroTrazabilidad = new EntitySchema({
  name: "RegistroTrazabilidad",
  tableName: "registros_trazabilidad",
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
    cantidad: {
      type: "float",
      nullable: false,
      comment: "Cantidad en kilos de carne molida"
    },    
    corte: {
      type: "enum",
      enum: cortesDeCarne,
      nullable: false,
    },
  },
  relations: {
    documento: {
      type: "many-to-one",
      target: "DocumentoTrazabilidad",
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

export default RegistroTrazabilidad;
