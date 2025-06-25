"use strict";
import AnimalVara from "../entity/AnimalVara.entity.js";
import AnimalCorte from "../entity/AnimalCortes.entity.js";
import { AppDataSource } from "../config/configDb.js";

export async function createAnimalVaraService(data) {
  try {
    const animalVaraRepository = AppDataSource.getRepository(AnimalVara);
    const animalCorteRepository = AppDataSource.getRepository(AnimalCorte);

    // Buscar el corte por id
    const corte = await animalCorteRepository.findOneBy({ id: data.tipoAnimalId });
    if (!corte) {
      return [null, `El tipo de animal con ID ${data.tipoAnimalId} no existe.`];
    }

    const nuevaVara = animalVaraRepository.create({
      fechaLlegada: data.fechaLlegada,
      temperaturaLlegada: data.temperaturaLlegada,
      precioTotalVara: data.precioTotalVara,
      tipoAnimal: corte,
    });

    const varaGuardada = await animalVaraRepository.save(nuevaVara);
    return [varaGuardada, null];
  } catch (error) {
    console.error("Error al crear la vara:", error);
    if (error.code === '23514' && error.constraint === 'fecha_llegada_valida') {
      return [null, "La fecha de llegada debe ser igual o anterior al día actual"];
    }
    return [null, "Error interno del servidor"];
  }
}

// Editar una vara existente
export async function updateAnimalVaraService(id, data) {
  try {
    const animalVaraRepository = AppDataSource.getRepository(AnimalVara);
    const animalCorteRepository = AppDataSource.getRepository(AnimalCorte);
    const vara = await animalVaraRepository.findOneBy({ id });
    if (!vara) return [null, "Vara no encontrada."];

    if (data.tipoAnimalId !== undefined) {
      const corte = await animalCorteRepository.findOneBy({ id: data.tipoAnimalId });
      if (!corte) return [null, `El tipo de animal con ID ${data.tipoAnimalId} no existe.`];
      vara.tipoAnimal = corte;
    }

    Object.keys(data).forEach((key) => {
      if (key !== "tipoAnimalId" && data[key] !== undefined) vara[key] = data[key];
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

    // Modificar los datos para incluir id y nombreLista del tipoAnimal
    const varasModificadas = varas.map(vara => ({
      id: vara.id,
      fechaLlegada: vara.fechaLlegada,
      temperaturaLlegada: vara.temperaturaLlegada,
      precioTotalVara: vara.precioTotalVara,
      tipoAnimal: {
        id: vara.tipoAnimal?.id, // Incluir id
        nombreLista: vara.tipoAnimal?.nombreLista,
      }
    }));

    return [varasModificadas, null];
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

    // Modificar los datos para incluir solo "nombreLista" del "tipoAnimal"
    const varasModificadas = varas.map(vara => ({
      id: vara.id,
      fechaLlegada: vara.fechaLlegada,
      temperaturaLlegada: vara.temperaturaLlegada,
      precioTotalVara: vara.precioTotalVara,
      tipoAnimal: {
        nombreLista: vara.tipoAnimal.nombreLista, // Solo incluir "nombreLista"
      }
    }));

    return [varasModificadas, null];
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

    // Modificar los datos para incluir solo "nombreLista" del "tipoAnimal"
    const varaModificada = {
      id: vara.id,
      fechaLlegada: vara.fechaLlegada,
      temperaturaLlegada: vara.temperaturaLlegada,
      precioTotalVara: vara.precioTotalVara,
      tipoAnimal: {
        nombreLista: vara.tipoAnimal.nombreLista, // Solo incluir "nombreLista"
      }
    };

    return [varaModificada, null];
  } catch (error) {
    console.error("Error al obtener la vara por ID:", error.message);
    return [null, "Error interno del servidor."];
  }
}
