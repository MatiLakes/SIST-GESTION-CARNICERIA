"use strict";
import { AppDataSource } from "../config/configDb.js";
import Proveedor from "../entity/proveedor.entity.js";
import ExcelJS from "exceljs";

// Crear proveedor
export async function createProveedorService(data) {
  try {
    const proveedorRepository = AppDataSource.getRepository(Proveedor);

    // Verificar si ya existe un proveedor con el mismo RUT
    const existingRut = await proveedorRepository.findOneBy({ rut: data.rut });
    if (existingRut) return [null, `Ya existe un proveedor con el RUT ${data.rut}.`];

    // Verificar si ya existe un proveedor con el mismo nombre
    const existingNombre = await proveedorRepository.findOneBy({ nombre: data.nombre });
    if (existingNombre) return [null, "Ya existe un proveedor con este nombre."];

    // Crear el nuevo proveedor
    const nuevoProveedor = proveedorRepository.create({
      rut: data.rut,
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
    if (!proveedor) return [null, "Proveedor no encontrado."];    // Verificar si el nuevo RUT ya existe en otro proveedor
    if (data.rut && data.rut !== proveedor.rut) {
      const existingRut = await proveedorRepository.findOneBy({ rut: data.rut });
      if (existingRut) return [null, `Ya existe un proveedor con el RUT ${data.rut}.`];
    }

    // Actualizar los campos del proveedor con los nuevos valores
    Object.assign(proveedor, {
      rut: data.rut || proveedor.rut,
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

// Generar Excel de proveedores
export async function generarExcelProveedores() {
  try {
    const proveedorRepository = AppDataSource.getRepository(Proveedor);
    
    // Obtener todos los proveedores
    const proveedores = await proveedorRepository.find({
      order: {
        nombre: "ASC"
      }
    });

    // Crear el workbook y la hoja
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Proveedores");
    
    // Definir las columnas
    worksheet.columns = [
      { header: "ID", key: "id", width: 10 },
      { header: "RUT", key: "rut", width: 15 },
      { header: "Nombre", key: "nombre", width: 30 },
      { header: "Dirección", key: "direccion", width: 35 },
      { header: "Banco", key: "banco", width: 20 },
      { header: "Número Cuenta", key: "numeroCuenta", width: 20 },
      { header: "Tipo Cuenta", key: "tipoCuenta", width: 15 },
      { header: "Nombre Encargado", key: "nombreEncargado", width: 25 },
      { header: "Móvil Encargado", key: "movilEncargado", width: 20 },
    ];

    // Agregar las filas
    proveedores.forEach((proveedor) => {
      const movilEncargado = Array.isArray(proveedor.movilEncargado) 
        ? proveedor.movilEncargado.join(", ") 
        : proveedor.movilEncargado || 'N/A';
      
      worksheet.addRow({
        id: proveedor.id,
        rut: proveedor.rut || 'N/A',
        nombre: proveedor.nombre || 'N/A',
        direccion: proveedor.direccion || 'N/A',
        banco: proveedor.banco || 'N/A',
        numeroCuenta: proveedor.numeroCuenta || 'N/A',
        tipoCuenta: proveedor.tipoCuenta || 'N/A',
        nombreEncargado: proveedor.nombreEncargado || 'N/A',
        movilEncargado: movilEncargado,
      });
    });

    // Estilizar la cabecera
    worksheet.getRow(1).font = { bold: true };

    // Retornar el workbook
    return workbook;
  } catch (error) {
    console.error("Error al generar el Excel de proveedores:", error);
    throw new Error("No se pudo generar el archivo Excel.");
  }
}
