"use strict";
import { AppDataSource } from "../config/configDb.js";
import Proveedor from "../entity/proveedor.entity.js";
import { CategoriaSchema } from "../entity/categoria.entity.js"; // Asegúrate de importar la entidad Categoria
import { In, Not } from "typeorm";

export async function crearProveedorService(body) {
  try {
    const proveedorRepository = AppDataSource.getRepository(Proveedor);

    // Verificar si el proveedor ya existe
    const existingProveedor = await proveedorRepository.findOne({
      where: { nombre: body.nombre },
    });

    if (existingProveedor) {
      return [null, "Ya existe un proveedor con el mismo nombre"];
    }

    // Verificar si las categorías están definidas y son un array
    if (!Array.isArray(body.categorias)) {
      return [null, "Las categorías deben ser un array"];
    }

    // Verificar que no sea vacío
    if (body.categorias.length === 0) {
      return [null, "Las categorías no pueden estar vacías"];
    }

    // Obtener las categorías desde la base de datos
    const categorias = await AppDataSource.getRepository(CategoriaSchema).findByIds(body.categorias);
    if (categorias.length !== body.categorias.length) {
      return [null, "Algunas categorías no existen"];
    }

    // Crear el proveedor y asociar las categorías
    const nuevoProveedor = proveedorRepository.create({
      ...body,
      categorias,   // Asociar las categorías al proveedor
    });

    // Guardar el nuevo proveedor en la base de datos
    await proveedorRepository.save(nuevoProveedor);

    return [nuevoProveedor, null];
  } catch (error) {
    console.error("Error al crear el proveedor:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function obtenerProveedoresService() {
  try {
    const proveedorRepository = AppDataSource.getRepository(Proveedor);

    // Obtener todos los proveedores
    const proveedoresFound = await proveedorRepository.find({
      relations: ["categorias"],  // Solo cargar las categorías
    });

    if (!proveedoresFound || proveedoresFound.length === 0) return [null, "No se encontraron proveedores"];

    // Formato de respuesta con los proveedores y categorías
    const responseData = {
      status: "Success",
      message: "Proveedores obtenidos correctamente",
      data: proveedoresFound.map(proveedor => {
        // Obtener las categorías asociadas al proveedor
        const categorias = proveedor.categorias;

        return {
          id: proveedor.id,
          nombre: proveedor.nombre,
          direccion: proveedor.direccion,
          nombreEncargado: proveedor.nombreEncargado,
          contactosEncargado: proveedor.contactosEncargado,  // Lista de contactos del encargado
          nombreRepartidor: proveedor.nombreRepartidor,
          contactosRepartidor: proveedor.contactosRepartidor,  // Lista de contactos del repartidor
          banco: proveedor.banco,
          numeroCuenta: proveedor.numeroCuenta,
          tipoCuenta: proveedor.tipoCuenta,
          createdAt: proveedor.createdAt.toISOString(),
          updatedAt: proveedor.updatedAt.toISOString(),
          categorias: categorias.map(categoria => ({
            id: categoria.id,
            nombre: categoria.nombre,
          })),
        };
      }),
    };

    return [responseData, null];  // Retornar la lista de proveedores con sus categorías asociadas
  } catch (error) {
    console.error("Error al obtener los proveedores:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function obtenerProveedorService(id) {
  try {
    const proveedorRepository = AppDataSource.getRepository(Proveedor);

    // Buscar el proveedor por ID
    const proveedorFound = await proveedorRepository.findOne({
      where: { id },
      relations: ["categorias"],  // Solo cargar las categorías
    });

    if (!proveedorFound) return [null, "Proveedor no encontrado"];

    // Obtener las categorías asociadas al proveedor
    const categorias = proveedorFound.categorias;

    // Formato de respuesta con las categorías de acuerdo al proveedor
    const responseData = {
      status: "Success",
      message: "Proveedor obtenido correctamente",
      data: {
        id: proveedorFound.id,
        nombre: proveedorFound.nombre,
        direccion: proveedorFound.direccion,
        telefono: proveedorFound.telefono,
        nombreEncargado: proveedorFound.nombreEncargado,
        contactosEncargado: proveedorFound.contactosEncargado,  // Lista de contactos del encargado
        nombreRepartidor: proveedorFound.nombreRepartidor,
        contactosRepartidor: proveedorFound.contactosRepartidor,  // Lista de contactos del repartidor
        banco: proveedorFound.banco,
        numeroCuenta: proveedorFound.numeroCuenta,
        tipoCuenta: proveedorFound.tipoCuenta,
        createdAt: proveedorFound.createdAt.toISOString(),
        updatedAt: proveedorFound.updatedAt.toISOString(),
        categorias: categorias.map(categoria => ({
          id: categoria.id,
          nombre: categoria.nombre,
        })),
      },
    };

    return [responseData, null];  // Retornar el proveedor con categorías asociadas
  } catch (error) {
    console.error("Error al obtener el proveedor:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function actualizarProveedorService(id, body) {
  try {
    const proveedorRepository = AppDataSource.getRepository(Proveedor);

    // Buscar el proveedor por ID
    const proveedorFound = await proveedorRepository.findOneBy({ id });

    if (!proveedorFound) return [null, "Proveedor no encontrado"];

    // Si el nombre no cambia, no verificamos si ya existe otro proveedor con ese nombre
    if (proveedorFound.nombre.trim().toLowerCase() !== body.nombre.trim().toLowerCase()) {
      const existingProveedor = await proveedorRepository.findOne({
        where: { nombre: body.nombre, id: Not(id) },
      });

      if (existingProveedor) {
        return [null, "Ya existe un proveedor con el mismo nombre"];
      }
    }

    // Obtener las categorías usando los IDs proporcionados
    const categorias = await AppDataSource.getRepository(CategoriaSchema).find({
      where: { id: In(body.categorias) },
    });

    // Actualizar los datos del proveedor con las categorías
    const updatedProveedor = Object.assign(proveedorFound, body);
    updatedProveedor.categorias = categorias;

    // Guardar el proveedor actualizado
    await proveedorRepository.save(updatedProveedor);

    const responseData = {
      status: "Success",
      message: "Proveedor actualizado correctamente",
      data: {
        id: updatedProveedor.id,  // Ahora se utiliza updatedProveedor
        nombre: updatedProveedor.nombre,
        direccion: updatedProveedor.direccion,
        telefono: updatedProveedor.telefono,
        nombreEncargado: updatedProveedor.nombreEncargado,
        contactosEncargado: updatedProveedor.contactosEncargado,  // Lista de contactos del encargado
        nombreRepartidor: updatedProveedor.nombreRepartidor,
        contactosRepartidor: updatedProveedor.contactosRepartidor,  // Lista de contactos del repartidor
        banco: updatedProveedor.banco,
        numeroCuenta: updatedProveedor.numeroCuenta,
        tipoCuenta: updatedProveedor.tipoCuenta,
        createdAt: updatedProveedor.createdAt.toISOString(),
        updatedAt: updatedProveedor.updatedAt.toISOString(),
        categorias: updatedProveedor.categorias.map(categoria => ({
          id: categoria.id,
          nombre: categoria.nombre,
        })),
      },
    };

    return [responseData, null];
  } catch (error) {
    console.error("Error al actualizar el proveedor:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function eliminarProveedorService(id) {
  try {
    const proveedorRepository = AppDataSource.getRepository(Proveedor);

    const proveedorFound = await proveedorRepository.findOneBy({ id });
    if (!proveedorFound) return [null, "Proveedor no encontrado"];

    // Eliminar el proveedor
    await proveedorRepository.remove(proveedorFound);
    return [null, null];  
  } catch (error) {
    console.error("Error al eliminar el proveedor:", error);
    return [null, "Error interno del servidor"];
  }
}
