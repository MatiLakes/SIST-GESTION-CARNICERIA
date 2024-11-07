"use strict";
import { AppDataSource } from "../config/configDb.js";
import AnimalCorte from "../entity/AnimalCortes.entity.js";

const cortesPredefinidos = [
  "Abastero", "Asado de Tira", "Asado del Carnicero", "Asiento", "Choclillo", 
  "Cogote", "Entraña", "Filete", "Ganso", "Huachalomo", "Lomo Liso", "Lomo Vetado",
  "Palanca", "Plateada", "Pollo Barriga", "Pollo Ganso", "Posta Negra", "Posta Paleta", 
  "Posta Rosada", "Punta de Ganso", "Punta de Picana", "Punta Paleta", "Sobrecostilla", 
  "Tapabarriga", "Tapapecho", "Hueso Carnudo", "Hueso C/Carne", "Pata Vacuno", 
  "Huachalomo Olla", "Cazuela Paleta", "Osobuco", "Lagarto", "Costilla vacuno", 
  "Tapaposta", "Malaya"
];

export async function inicializarCortesBase() {
  const animalCorteRepository = AppDataSource.getRepository(AnimalCorte);

  for (const nombreCorte of cortesPredefinidos) {
    const corteExistente = await animalCorteRepository.findOne({
      where: { nombreCorte, tipoAnimal: "Animal Base" },
    });
    if (!corteExistente) {
      const nuevoCorte = animalCorteRepository.create({
        nombreCorte,
        tipoAnimal: "Animal Base",
        cantidadKilos: 0.0,
        precioPorKilo: 0,
      });
      await animalCorteRepository.save(nuevoCorte);
    }
  }
  console.log("Lista de cortes inicializada correctamente.");
}
