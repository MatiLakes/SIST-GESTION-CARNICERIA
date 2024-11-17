"use strict";
import AnimalCorte from "../entity/AnimalCortes.entity.js";
import { AppDataSource } from "../config/configDb.js";

// Crear un nuevo AnimalCorte
export async function createAnimalCorteService(data) {
    try {
      const animalCorteRepository = AppDataSource.getRepository(AnimalCorte);
  
      // Verificar si ya existe una lista con el mismo nombre
      const existing = await animalCorteRepository.findOneBy({ nombreLista: data.nombreLista });
      if (existing) return [null, "Ya existe un tipo de animal con este nombre de lista."];
  
      // Crear un nuevo registro asignando explícitamente todos los campos
      const nuevoAnimalCorte = animalCorteRepository.create({
        nombreLista: data.nombreLista,
        abastero: data.abastero,
        precioAbastero: data.precioAbastero,
        asadoTira: data.asadoTira,
        precioAsadoTira: data.precioAsadoTira,
        asadoCarnicero: data.asadoCarnicero,
        precioAsadoCarnicero: data.precioAsadoCarnicero,
        asiento: data.asiento,
        precioAsiento: data.precioAsiento,
        choclillo: data.choclillo,
        precioChoclillo: data.precioChoclillo,
        cogote: data.cogote,
        precioCogote: data.precioCogote,
        entraña: data.entraña,
        precioEntraña: data.precioEntraña,
        filete: data.filete,
        precioFilete: data.precioFilete,
        ganso: data.ganso,
        precioGanso: data.precioGanso,
        huachalomo: data.huachalomo,
        precioHuachalomo: data.precioHuachalomo,
        lomoLiso: data.lomoLiso,
        precioLomoLiso: data.precioLomoLiso,
        lomoVetado: data.lomoVetado,
        precioLomoVetado: data.precioLomoVetado,
        palanca: data.palanca,
        precioPalanca: data.precioPalanca,
        plateada: data.plateada,
        precioPlateada: data.precioPlateada,
        polloBarriga: data.polloBarriga,
        precioPolloBarriga: data.precioPolloBarriga,
        polloGanso: data.polloGanso,
        precioPolloGanso: data.precioPolloGanso,
        postaNegra: data.postaNegra,
        precioPostaNegra: data.precioPostaNegra,
        postaPaleta: data.postaPaleta,
        precioPostaPaleta: data.precioPostaPaleta,
        postaRosada: data.postaRosada,
        precioPostaRosada: data.precioPostaRosada,
        puntaGanso: data.puntaGanso,
        precioPuntaGanso: data.precioPuntaGanso,
        puntaPicana: data.puntaPicana,
        precioPuntaPicana: data.precioPuntaPicana,
        puntaPaleta: data.puntaPaleta,
        precioPuntaPaleta: data.precioPuntaPaleta,
        sobrecostilla: data.sobrecostilla,
        precioSobrecostilla: data.precioSobrecostilla,
        tapabarriga: data.tapabarriga,
        precioTapabarriga: data.precioTapabarriga,
        tapapecho: data.tapapecho,
        precioTapapecho: data.precioTapapecho,
        huesoCarnudo: data.huesoCarnudo,
        precioHuesoCarnudo: data.precioHuesoCarnudo,
        huesoCConCarne: data.huesoCConCarne,
        precioHuesoCConCarne: data.precioHuesoCConCarne,
        pataVacuno: data.pataVacuno,
        precioPataVacuno: data.precioPataVacuno,
        huachalomoOlla: data.huachalomoOlla,
        precioHuachalomoOlla: data.precioHuachalomoOlla,
        cazuelaPaleta: data.cazuelaPaleta,
        precioCazuelaPaleta: data.precioCazuelaPaleta,
        osobuco: data.osobuco,
        precioOsobuco: data.precioOsobuco,
        lagarto: data.lagarto,
        precioLagarto: data.precioLagarto,
        costillaVacuno: data.costillaVacuno,
        precioCostillaVacuno: data.precioCostillaVacuno,
        tapaposta: data.tapaposta,
        precioTapaposta: data.precioTapaposta,
        malaya: data.malaya,
        precioMalaya: data.precioMalaya,
      });
  
      // Guardar en la base de datos
      const animalCorteGuardado = await animalCorteRepository.save(nuevoAnimalCorte);
      return [animalCorteGuardado, null];
    } catch (error) {
      console.error("Error al crear AnimalCorte:", error);
      return [null, "Error interno del servidor"];
    }
  }

// Editar un AnimalCorte existente
export async function updateAnimalCorteService(id, data) {
  try {
    const animalCorteRepository = AppDataSource.getRepository(AnimalCorte);

    const animalCorte = await animalCorteRepository.findOneBy({ id });
    if (!animalCorte) return [null, "AnimalCorte no encontrado."];

    // Actualizar cantidades y precios
    Object.keys(data).forEach((key) => {
      if (data[key] !== undefined) animalCorte[key] = data[key];
    });

    const animalCorteActualizado = await animalCorteRepository.save(animalCorte);
    return [animalCorteActualizado, null];
  } catch (error) {
    console.error("Error al actualizar AnimalCorte:", error);
    return [null, "Error interno del servidor"];
  }
}

// Eliminar un AnimalCorte
export async function deleteAnimalCorteService(id) {
  try {
    const animalCorteRepository = AppDataSource.getRepository(AnimalCorte);

    const animalCorte = await animalCorteRepository.findOneBy({ id });
    if (!animalCorte) return [null, "AnimalCorte no encontrado."];

    await animalCorteRepository.remove(animalCorte);
    return ["AnimalCorte eliminado correctamente.", null];
  } catch (error) {
    console.error("Error al eliminar AnimalCorte:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function getAllAnimalCortesService() {
    try {
      const animalCorteRepository = AppDataSource.getRepository(AnimalCorte);
      const animalCortes = await animalCorteRepository.find();
      return [animalCortes, null];
    } catch (error) {
      console.error("Error al obtener AnimalCortes:", error);
      return [null, "Error interno del servidor"];
    }
  }

  export async function getAnimalCorteByIdService(id) {
    try {
      const animalCorteRepository = AppDataSource.getRepository(AnimalCorte);
  
      // Buscar el AnimalCorte por su ID
      const animalCorte = await animalCorteRepository.findOneBy({ id });
  
      // Verificar si existe
      if (!animalCorte) return [null, "AnimalCorte no encontrado."];
  
      return [animalCorte, null];
    } catch (error) {
      console.error("Error al obtener AnimalCorte por ID:", error.message);
      return [null, "Error interno del servidor"];
    }
  }