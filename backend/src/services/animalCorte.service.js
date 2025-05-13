"use strict";
import AnimalCorte from "../entity/AnimalCortes.entity.js";
import { AppDataSource } from "../config/configDb.js";
import ExcelJS from "exceljs";

export async function createAnimalCorteService(data) {
    try {
      const animalCorteRepository = AppDataSource.getRepository(AnimalCorte);

      const existing = await animalCorteRepository.findOneBy({ nombreLista: data.nombreLista });
      if (existing) return [null, "Ya existe un tipo de animal con este nombre de lista."];
  
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
  
      const animalCorteGuardado = await animalCorteRepository.save(nuevoAnimalCorte);
      return [animalCorteGuardado, null];
    } catch (error) {
      console.error("Error al crear AnimalCorte:", error);
      return [null, "Error interno del servidor"];
    }
  }

export async function updateAnimalCorteService(id, data) {
  try {
    const animalCorteRepository = AppDataSource.getRepository(AnimalCorte);

    const animalCorte = await animalCorteRepository.findOneBy({ id });
    if (!animalCorte) return [null, "AnimalCorte no encontrado."];

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
  
      const animalCorte = await animalCorteRepository.findOneBy({ id });
  
      if (!animalCorte) return [null, "AnimalCorte no encontrado."];
  
      return [animalCorte, null];
    } catch (error) {
      console.error("Error al obtener AnimalCorte por ID:", error.message);
      return [null, "Error interno del servidor"];
    }
}

export const animalCorteService = {
    async generarExcelAnimalCortes() {
        try {
            const animalCorteRepository = AppDataSource.getRepository(AnimalCorte);
            const animalCortes = await animalCorteRepository.find();

            // Crear el workbook y la hoja
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet("Lista de Cortes");            // Definir las columnas
            worksheet.columns = [
                { header: "ID", key: "id", width: 10 },
                { header: "Nombre Lista", key: "nombreLista", width: 30 },
                { header: "Abastero", key: "abastero", width: 15 },
                { header: "Precio Abastero", key: "precioAbastero", width: 15 },
                { header: "Asado Tira", key: "asadoTira", width: 15 },
                { header: "Precio Asado Tira", key: "precioAsadoTira", width: 15 },
                { header: "Asado Carnicero", key: "asadoCarnicero", width: 15 },
                { header: "Precio Asado Carnicero", key: "precioAsadoCarnicero", width: 15 },
                { header: "Asiento", key: "asiento", width: 15 },
                { header: "Precio Asiento", key: "precioAsiento", width: 15 },
                { header: "Choclillo", key: "choclillo", width: 15 },
                { header: "Precio Choclillo", key: "precioChoclillo", width: 15 },
                { header: "Cogote", key: "cogote", width: 15 },
                { header: "Precio Cogote", key: "precioCogote", width: 15 },
                { header: "Entraña", key: "entraña", width: 15 },
                { header: "Precio Entraña", key: "precioEntraña", width: 15 },
                { header: "Filete", key: "filete", width: 15 },
                { header: "Precio Filete", key: "precioFilete", width: 15 },
                { header: "Ganso", key: "ganso", width: 15 },
                { header: "Precio Ganso", key: "precioGanso", width: 15 },
                { header: "Huachalomo", key: "huachalomo", width: 15 },
                { header: "Precio Huachalomo", key: "precioHuachalomo", width: 15 },
                { header: "Lomo Liso", key: "lomoLiso", width: 15 },
                { header: "Precio Lomo Liso", key: "precioLomoLiso", width: 15 },
                { header: "Lomo Vetado", key: "lomoVetado", width: 15 },
                { header: "Precio Lomo Vetado", key: "precioLomoVetado", width: 15 },
                { header: "Palanca", key: "palanca", width: 15 },
                { header: "Precio Palanca", key: "precioPalanca", width: 15 },
                { header: "Plateada", key: "plateada", width: 15 },
                { header: "Precio Plateada", key: "precioPlateada", width: 15 },
                { header: "Pollo Barriga", key: "polloBarriga", width: 15 },
                { header: "Precio Pollo Barriga", key: "precioPolloBarriga", width: 15 },
                { header: "Pollo Ganso", key: "polloGanso", width: 15 },
                { header: "Precio Pollo Ganso", key: "precioPolloGanso", width: 15 },
                { header: "Posta Negra", key: "postaNegra", width: 15 },
                { header: "Precio Posta Negra", key: "precioPostaNegra", width: 15 },
                { header: "Posta Paleta", key: "postaPaleta", width: 15 },
                { header: "Precio Posta Paleta", key: "precioPostaPaleta", width: 15 },
                { header: "Posta Rosada", key: "postaRosada", width: 15 },
                { header: "Precio Posta Rosada", key: "precioPostaRosada", width: 15 },
                { header: "Punta Ganso", key: "puntaGanso", width: 15 },
                { header: "Precio Punta Ganso", key: "precioPuntaGanso", width: 15 },
                { header: "Punta Picana", key: "puntaPicana", width: 15 },
                { header: "Precio Punta Picana", key: "precioPuntaPicana", width: 15 },
                { header: "Punta Paleta", key: "puntaPaleta", width: 15 },
                { header: "Precio Punta Paleta", key: "precioPuntaPaleta", width: 15 },
                { header: "Sobrecostilla", key: "sobrecostilla", width: 15 },
                { header: "Precio Sobrecostilla", key: "precioSobrecostilla", width: 15 },
                { header: "Tapabarriga", key: "tapabarriga", width: 15 },
                { header: "Precio Tapabarriga", key: "precioTapabarriga", width: 15 },
                { header: "Tapapecho", key: "tapapecho", width: 15 },
                { header: "Precio Tapapecho", key: "precioTapapecho", width: 15 },
                { header: "Hueso Carnudo", key: "huesoCarnudo", width: 15 },
                { header: "Precio Hueso Carnudo", key: "precioHuesoCarnudo", width: 15 },
                { header: "Hueso Con Carne", key: "huesoCConCarne", width: 15 },
                { header: "Precio Hueso Con Carne", key: "precioHuesoCConCarne", width: 15 },
                { header: "Pata Vacuno", key: "pataVacuno", width: 15 },
                { header: "Precio Pata Vacuno", key: "precioPataVacuno", width: 15 },
                { header: "Huachalomo Olla", key: "huachalomoOlla", width: 15 },
                { header: "Precio Huachalomo Olla", key: "precioHuachalomoOlla", width: 15 },
                { header: "Cazuela Paleta", key: "cazuelaPaleta", width: 15 },
                { header: "Precio Cazuela Paleta", key: "precioCazuelaPaleta", width: 15 },
                { header: "Osobuco", key: "osobuco", width: 15 },
                { header: "Precio Osobuco", key: "precioOsobuco", width: 15 },
                { header: "Lagarto", key: "lagarto", width: 15 },
                { header: "Precio Lagarto", key: "precioLagarto", width: 15 },
                { header: "Costilla Vacuno", key: "costillaVacuno", width: 15 },
                { header: "Precio Costilla Vacuno", key: "precioCostillaVacuno", width: 15 },
                { header: "Tapaposta", key: "tapaposta", width: 15 },
                { header: "Precio Tapaposta", key: "precioTapaposta", width: 15 },
                { header: "Malaya", key: "malaya", width: 15 },
                { header: "Precio Malaya", key: "precioMalaya", width: 15 }
            ];            // Agregar las filas
            animalCortes.forEach((corte) => {
                worksheet.addRow({
                    id: corte.id,
                    nombreLista: corte.nombreLista || "N/A",
                    abastero: corte.abastero || "N/A",
                    precioAbastero: corte.precioAbastero || "N/A",
                    asadoTira: corte.asadoTira || "N/A",
                    precioAsadoTira: corte.precioAsadoTira || "N/A",
                    asadoCarnicero: corte.asadoCarnicero || "N/A",
                    precioAsadoCarnicero: corte.precioAsadoCarnicero || "N/A",
                    asiento: corte.asiento || "N/A",
                    precioAsiento: corte.precioAsiento || "N/A",
                    choclillo: corte.choclillo || "N/A",
                    precioChoclillo: corte.precioChoclillo || "N/A",
                    cogote: corte.cogote || "N/A",
                    precioCogote: corte.precioCogote || "N/A",
                    entraña: corte.entraña || "N/A",
                    precioEntraña: corte.precioEntraña || "N/A",
                    filete: corte.filete || "N/A",
                    precioFilete: corte.precioFilete || "N/A",
                    ganso: corte.ganso || "N/A",
                    precioGanso: corte.precioGanso || "N/A",
                    huachalomo: corte.huachalomo || "N/A",
                    precioHuachalomo: corte.precioHuachalomo || "N/A",
                    lomoLiso: corte.lomoLiso || "N/A",
                    precioLomoLiso: corte.precioLomoLiso || "N/A",
                    lomoVetado: corte.lomoVetado || "N/A",
                    precioLomoVetado: corte.precioLomoVetado || "N/A",
                    palanca: corte.palanca || "N/A",
                    precioPalanca: corte.precioPalanca || "N/A",
                    plateada: corte.plateada || "N/A",
                    precioPlateada: corte.precioPlateada || "N/A",
                    polloBarriga: corte.polloBarriga || "N/A",
                    precioPolloBarriga: corte.precioPolloBarriga || "N/A",
                    polloGanso: corte.polloGanso || "N/A",
                    precioPolloGanso: corte.precioPolloGanso || "N/A",
                    postaNegra: corte.postaNegra || "N/A",
                    precioPostaNegra: corte.precioPostaNegra || "N/A",
                    postaPaleta: corte.postaPaleta || "N/A",
                    precioPostaPaleta: corte.precioPostaPaleta || "N/A",
                    postaRosada: corte.postaRosada || "N/A",
                    precioPostaRosada: corte.precioPostaRosada || "N/A",
                    puntaGanso: corte.puntaGanso || "N/A",
                    precioPuntaGanso: corte.precioPuntaGanso || "N/A",
                    puntaPicana: corte.puntaPicana || "N/A",
                    precioPuntaPicana: corte.precioPuntaPicana || "N/A",
                    puntaPaleta: corte.puntaPaleta || "N/A",
                    precioPuntaPaleta: corte.precioPuntaPaleta || "N/A",
                    sobrecostilla: corte.sobrecostilla || "N/A",
                    precioSobrecostilla: corte.precioSobrecostilla || "N/A",
                    tapabarriga: corte.tapabarriga || "N/A",
                    precioTapabarriga: corte.precioTapabarriga || "N/A",
                    tapapecho: corte.tapapecho || "N/A",
                    precioTapapecho: corte.precioTapapecho || "N/A",
                    huesoCarnudo: corte.huesoCarnudo || "N/A",
                    precioHuesoCarnudo: corte.precioHuesoCarnudo || "N/A",
                    huesoCConCarne: corte.huesoCConCarne || "N/A",
                    precioHuesoCConCarne: corte.precioHuesoCConCarne || "N/A",
                    pataVacuno: corte.pataVacuno || "N/A",
                    precioPataVacuno: corte.precioPataVacuno || "N/A",
                    huachalomoOlla: corte.huachalomoOlla || "N/A",
                    precioHuachalomoOlla: corte.precioHuachalomoOlla || "N/A",
                    cazuelaPaleta: corte.cazuelaPaleta || "N/A",
                    precioCazuelaPaleta: corte.precioCazuelaPaleta || "N/A",
                    osobuco: corte.osobuco || "N/A",
                    precioOsobuco: corte.precioOsobuco || "N/A",
                    lagarto: corte.lagarto || "N/A",
                    precioLagarto: corte.precioLagarto || "N/A",
                    costillaVacuno: corte.costillaVacuno || "N/A",
                    precioCostillaVacuno: corte.precioCostillaVacuno || "N/A",
                    tapaposta: corte.tapaposta || "N/A",
                    precioTapaposta: corte.precioTapaposta || "N/A",
                    malaya: corte.malaya || "N/A",
                    precioMalaya: corte.precioMalaya || "N/A"
                });
            });

            // Estilizar la cabecera
            worksheet.getRow(1).font = { bold: true };

            // Retornar el workbook
            return workbook;
        } catch (error) {
            console.error("Error al generar el Excel de lista de cortes:", error);
            throw new Error("No se pudo generar el archivo Excel de lista de cortes.");
        }
    }
};