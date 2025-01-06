"use strict";
import Subproducto from "../entity/subproducto.entity.js";
import { AppDataSource } from "../config/configDb.js";

export async function createSubproductoService(data) {
  try {
    const subproductoRepository = AppDataSource.getRepository(Subproducto);

    // Verificar si ya existe un registro para la misma fecha de faena y entrega
    const existing = await subproductoRepository.findOneBy({ 
      fechaFaena: data.fechaFaena, 
      fechaEntrega: data.fechaEntrega 
    });
    if (existing) return [null, "Ya existe un registro de subproductos para esta fecha de faena y entrega."];

    const nuevoSubproducto = subproductoRepository.create({
      fechaFaena: data.fechaFaena,
      numeroAnimalesFaenados: data.numeroAnimalesFaenados,
      fechaEntrega: data.fechaEntrega,
      guataDecomisados: data.guataDecomisados,
      guataEntregados: data.guataEntregados,
      precioGuata: data.precioGuata,
      corazonDecomisados: data.corazonDecomisados,
      corazonEntregados: data.corazonEntregados,
      precioCorazon: data.precioCorazon,
      cabezasDecomisados: data.cabezasDecomisados,
      cabezasEntregados: data.cabezasEntregados,
      precioCabezas: data.precioCabezas,
      lenguasDecomisados: data.lenguasDecomisados,
      lenguasEntregados: data.lenguasEntregados,
      precioLenguas: data.precioLenguas,
      chunchulDecomisados: data.chunchulDecomisados,
      chunchulEntregados: data.chunchulEntregados,
      precioChunchul: data.precioChunchul,
      higadoDecomisados: data.higadoDecomisados,
      higadoEntregados: data.higadoEntregados,
      precioHigado: data.precioHigado,
      rinonDecomisados: data.rinonDecomisados,
      rinonEntregados: data.rinonEntregados,
      precioRinon: data.precioRinon,
      patasDecomisados: data.patasDecomisados,
      patasEntregados: data.patasEntregados,
      precioPatas: data.precioPatas,
      charchaDecomisados: data.charchaDecomisados,
      charchaEntregados: data.charchaEntregados,
      precioCharcha: data.precioCharcha,
    });

    const subproductoGuardado = await subproductoRepository.save(nuevoSubproducto);
    return [subproductoGuardado, null];
  } catch (error) {
    console.error("Error al crear Subproducto:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function updateSubproductoService(id, data) {
  try {
    const subproductoRepository = AppDataSource.getRepository(Subproducto);

    const subproducto = await subproductoRepository.findOneBy({ id });
    if (!subproducto) return [null, "Subproducto no encontrado."];

    Object.keys(data).forEach((key) => {
      if (data[key] !== undefined) subproducto[key] = data[key];
    });

    const subproductoActualizado = await subproductoRepository.save(subproducto);
    return [subproductoActualizado, null];
  } catch (error) {
    console.error("Error al actualizar Subproducto:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function deleteSubproductoService(id) {
  try {
    const subproductoRepository = AppDataSource.getRepository(Subproducto);

    const subproducto = await subproductoRepository.findOneBy({ id });
    if (!subproducto) return [null, "Subproducto no encontrado."];

    await subproductoRepository.remove(subproducto);
    return ["Subproducto eliminado correctamente.", null];
  } catch (error) {
    console.error("Error al eliminar Subproducto:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function getAllSubproductosService() {
  try {
    const subproductoRepository = AppDataSource.getRepository(Subproducto);
    const subproductos = await subproductoRepository.find();
    return [subproductos, null];
  } catch (error) {
    console.error("Error al obtener Subproductos:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function getSubproductoByIdService(id) {
  try {
    const subproductoRepository = AppDataSource.getRepository(Subproducto);

    const subproducto = await subproductoRepository.findOneBy({ id });

    if (!subproducto) return [null, "Subproducto no encontrado."];

    return [subproducto, null];
  } catch (error) {
    console.error("Error al obtener Subproducto por ID:", error.message);
    return [null, "Error interno del servidor"];
  }
}
