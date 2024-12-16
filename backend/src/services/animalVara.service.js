"use strict";
import AnimalVara from "../entity/AnimalVara.entity.js";
import { AppDataSource } from "../config/configDb.js";

export async function createAnimalVaraService(data) {
  try {
    const animalVaraRepository = AppDataSource.getRepository(AnimalVara);

    const nuevaVara = animalVaraRepository.create({
      varaId: data.varaId,
      fechaLlegada: data.fechaLlegada,
      temperaturaLlegada: data.temperaturaLlegada,
      recibidoPor: data.recibidoPor,
      precioTotalVara: data.precioTotalVara,
      tipoAnimal: data.tipoAnimal, 
    });

    const varaGuardada = await animalVaraRepository.save(nuevaVara);
    return [varaGuardada, null];
  } catch (error) {
    console.error("Error al crear la vara:", error);
    return [null, "Error interno del servidor"];
  }
}

// Editar una vara existente
export async function updateAnimalVaraService(id, data) {
  try {
    const animalVaraRepository = AppDataSource.getRepository(AnimalVara);

    const vara = await animalVaraRepository.findOneBy({ id });
    if (!vara) return [null, "Vara no encontrada."];

    Object.keys(data).forEach((key) => {
      if (data[key] !== undefined) vara[key] = data[key];
    });

    const varaActualizada = await animalVaraRepository.save(vara);
    return [varaActualizada, null];
  } catch (error) {
    console.error("Error al actualizar la vara:", error);
    return [null, "Error interno del servidor"];
  }
}

// Eliminar una vara
export async function deleteAnimalVaraService(id) {
  try {
    const animalVaraRepository = AppDataSource.getRepository(AnimalVara);

    const vara = await animalVaraRepository.findOneBy({ id });
    if (!vara) return [null, "Vara no encontrada."];

    await animalVaraRepository.remove(vara);
    return ["Vara eliminada correctamente.", null];
  } catch (error) {
    console.error("Error al eliminar la vara:", error);
    return [null, "Error interno del servidor"];
  }
}

// Mostrar todas las varas
export async function getAllAnimalVarasService() {
  try {
    const animalVaraRepository = AppDataSource.getRepository(AnimalVara);
    const varas = await animalVaraRepository.find({ relations: ["tipoAnimal"] });
    return [varas, null];
  } catch (error) {
    console.error("Error al obtener las varas:", error);
    return [null, "Error interno del servidor"];
  }
}

// Mostrar varas por fecha de llegada
export async function getVarasByFechaService(fecha) {
  try {
    const animalVaraRepository = AppDataSource.getRepository(AnimalVara);

    const varas = await animalVaraRepository.find({
      where: { fechaLlegada: fecha },
      relations: ["tipoAnimal"], 
    });

    return [varas, null];
  } catch (error) {
    console.error("Error al obtener las varas por fecha:", error.message);
    return [null, "Error interno del servidor."];
  }
}

export async function getVaraByIdService(id) {
  try {
    const animalVaraRepository = AppDataSource.getRepository(AnimalVara);

    const vara = await animalVaraRepository.findOne({
      where: { id },
      relations: ["tipoAnimal"], 
    });

    if (!vara) return [null, "La vara especificada no existe."];

    return [vara, null];
  } catch (error) {
    console.error("Error al obtener la vara por ID:", error.message);
    return [null, "Error interno del servidor."];
  }
}