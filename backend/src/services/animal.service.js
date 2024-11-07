"use strict";
import AnimalVara from "../entity/AnimalVara.entity.js";
import AnimalCorte from "../entity/AnimalCortes.entity.js";
import { AppDataSource } from "../config/configDb.js";

// Crear una nueva vara
export async function createAnimalVaraService(data) {
  try {
    const animalVaraRepository = AppDataSource.getRepository(AnimalVara);

    const nuevaVara = animalVaraRepository.create({
      numeroVara: data.numeroVara,
      fechaLlegada: data.fechaLlegada || new Date(),
      temperaturaLlegada: data.temperaturaLlegada,
      nombreRecibidor: data.nombreRecibidor,
      precioTotal: data.precioTotal,
      tipoAnimal: data.tipoAnimalId,
    });

    const varaGuardada = await animalVaraRepository.save(nuevaVara);
    return [varaGuardada, null];
  } catch (error) {
    console.error("Error al crear la vara:", error);
    return [null, "Error interno del servidor"];
  }
}

// Actualizar cantidad y precio del corte
export async function updateCorteCantidadPrecioService(corteId, data) {
  try {
    const animalCorteRepository = AppDataSource.getRepository(AnimalCorte);

    const corte = await animalCorteRepository.findOneBy({ id: corteId });
    if (!corte) return [null, "Corte no encontrado"];

    if (data.cantidadKilos !== undefined) corte.cantidadKilos = data.cantidadKilos;
    if (data.precioPorKilo !== undefined) corte.precioPorKilo = data.precioPorKilo;

    const corteActualizado = await animalCorteRepository.save(corte);
    return [corteActualizado, null];
  } catch (error) {
    console.error("Error al actualizar cantidad y precio del corte:", error);
    return [null, "Error interno del servidor"];
  }
}

// Duplicar la lista de cortes base para un nuevo tipo de animal
export async function duplicarAnimalBaseComo(tipoAnimalNuevo, ajustesCortes) {
  try {
    const animalCorteRepository = AppDataSource.getRepository(AnimalCorte);

    const cortesBase = await animalCorteRepository.find({
      where: { tipoAnimal: "Animal Base" },
    });

    for (const corteBase of cortesBase) {
      const nuevoCorte = animalCorteRepository.create({
        nombreCorte: corteBase.nombreCorte,
        cantidadKilos: ajustesCortes[corteBase.nombreCorte]?.cantidadKilos || corteBase.cantidadKilos,
        precioPorKilo: ajustesCortes[corteBase.nombreCorte]?.precioPorKilo || corteBase.precioPorKilo,
        tipoAnimal: tipoAnimalNuevo,
      });
      await animalCorteRepository.save(nuevoCorte);
    }

    console.log(`Lista de cortes para tipo de animal '${tipoAnimalNuevo}' creada con éxito.`);
    return [`Lista de cortes para '${tipoAnimalNuevo}' creada.`, null];
  } catch (error) {
    console.error("Error al duplicar Animal Base:", error);
    return [null, "Error interno del servidor"];
  }
}
