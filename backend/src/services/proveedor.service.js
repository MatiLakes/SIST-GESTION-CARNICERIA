"use strict";
import { AppDataSource } from "../config/configDb.js";
import Proveedor from "../entity/proveedor.entity.js";

// Crear proveedor
export async function createProveedorService(data) {
  try {
    const proveedorRepository = AppDataSource.getRepository(Proveedor);

    // Verificar si ya existe un proveedor con el mismo nombre
    const existing = await proveedorRepository.findOneBy({ nombre: data.nombre });
    if (existing) return [null, "Ya existe un proveedor con este nombre."];

    // Crear el nuevo proveedor
    const nuevoProveedor = proveedorRepository.create({
      nombre: data.nombre || "",
      direccion: data.direccion || "",
      banco: data.banco || "",
      numeroCuenta: data.numeroCuenta || "",
      tipoCuenta: data.tipoCuenta || "",
      nombreEncargado: data.nombreEncargado || "",
      movilEncargado: Array.isArray(data.movilEncargado) ? data.movilEncargado : [data.movilEncargado || ""],
    });

    // Guardar el proveedor en la base de datos
    const proveedorGuardado = await proveedorRepository.save(nuevoProveedor);
    return [proveedorGuardado, null];
  } catch (error) {
    console.error("Error al crear proveedor:", error);
    return [null, "Error interno del servidor"];
  }
}

// Actualizar proveedor
export async function updateProveedorService(id, data) {
  try {
    const proveedorRepository = AppDataSource.getRepository(Proveedor);

    // Buscar el proveedor por ID
    const proveedor = await proveedorRepository.findOneBy({ id });
    if (!proveedor) return [null, "Proveedor no encontrado."];

    // Actualizar los campos del proveedor con los nuevos valores
    Object.assign(proveedor, {
      nombre: data.nombre || proveedor.nombre,
      direccion: data.direccion || proveedor.direccion,
      banco: data.banco || proveedor.banco,
      numeroCuenta: data.numeroCuenta || proveedor.numeroCuenta,
      tipoCuenta: data.tipoCuenta || proveedor.tipoCuenta,
      nombreEncargado: data.nombreEncargado || proveedor.nombreEncargado,
      movilEncargado: Array.isArray(data.movilEncargado) ? data.movilEncargado : [data.movilEncargado || ""],
    });

    // Guardar el proveedor actualizado en la base de datos
    const proveedorActualizado = await proveedorRepository.save(proveedor);
    return [proveedorActualizado, null];
  } catch (error) {
    console.error("Error al actualizar proveedor:", error);
    return [null, "Error interno del servidor"];
  }
}

// Eliminar proveedor
export async function deleteProveedorService(id) {
  try {
    const proveedorRepository = AppDataSource.getRepository(Proveedor);

    // Buscar el proveedor por ID
    const proveedor = await proveedorRepository.findOneBy({ id });
    if (!proveedor) return [null, "Proveedor no encontrado."];

    // Eliminar el proveedor
    await proveedorRepository.remove(proveedor);
    return ["Proveedor eliminado correctamente.", null];
  } catch (error) {
    console.error("Error al eliminar proveedor:", error);
    return [null, "Error interno del servidor"];
  }
}

// Obtener todos los proveedores
export async function getAllProveedoresService() {
  try {
    const proveedorRepository = AppDataSource.getRepository(Proveedor);

    // Obtener todos los proveedores
    const proveedores = await proveedorRepository.find();
    return [proveedores, null];
  } catch (error) {
    console.error("Error al obtener proveedores:", error);
    return [null, "Error interno del servidor"];
  }
}

// Obtener proveedor por ID
export async function getProveedorByIdService(id) {
  try {
    const proveedorRepository = AppDataSource.getRepository(Proveedor);

    // Buscar el proveedor por ID
    const proveedor = await proveedorRepository.findOneBy({ id });
    if (!proveedor) return [null, "Proveedor no encontrado."];

    return [proveedor, null];
  } catch (error) {
    console.error("Error al obtener proveedor por ID:", error.message);
    return [null, "Error interno del servidor"];
  }
}
