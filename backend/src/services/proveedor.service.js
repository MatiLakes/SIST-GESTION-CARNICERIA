import { AppDataSource } from "../config/configDb.js";
import Proveedor from "../entity/proveedor.entity.js";
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

    // Crear el proveedor con los datos proporcionados, incluyendo los datos de Encargado y Repartidor
    const nuevoProveedor = proveedorRepository.create({
      ...body,
      // Asegúrate de que los campos encargados y repartidores sean correctamente pasados en el body
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
    const proveedoresFound = await proveedorRepository.find();

    if (!proveedoresFound || proveedoresFound.length === 0) return [null, "No se encontraron proveedores"];

    // Formato de respuesta con los proveedores
    const responseData = {
      status: "Success",
      message: "Proveedores obtenidos correctamente",
      data: proveedoresFound.map(proveedor => {
        const proveedorData = {
          id: proveedor.id,
          nombre: proveedor.nombre,
          direccion: proveedor.direccion,
          banco: proveedor.banco,
          numeroCuenta: proveedor.numeroCuenta,
          tipoCuenta: proveedor.tipoCuenta,
          createdAt: proveedor.createdAt.toISOString(),
          updatedAt: proveedor.updatedAt.toISOString(),
        };

        // Incluir encargado solo si su estado es true
        if (proveedor.estadoEncargado) {
          proveedorData.idEncargado = proveedor.idEncargado;
          proveedorData.nombreEncargado = proveedor.nombreEncargado;
          proveedorData.estadoEncargado = proveedor.estadoEncargado;
          proveedorData.movilEncargado = proveedor.movilEncargado;
          proveedorData.telefonoEncargado = proveedor.telefonoEncargado;
        } else {
          // Si el estado es false, solo mostrar el nombre
          proveedorData.nombreEncargado = proveedor.nombreEncargado;
        }

        // Incluir repartidor solo si su estado es true
        if (proveedor.estadoRepartidor) {
          proveedorData.idRepartidor = proveedor.idRepartidor;
          proveedorData.nombreRepartidor = proveedor.nombreRepartidor;
          proveedorData.estadoRepartidor = proveedor.estadoRepartidor;
          proveedorData.movilRepartidor = proveedor.movilRepartidor;
          proveedorData.telefonoRepartidor = proveedor.telefonoRepartidor;
        } else {
          // Si el estado es false, solo mostrar el nombre
          proveedorData.nombreRepartidor = proveedor.nombreRepartidor;
        }

        return proveedorData;
      }),
    };

    return [responseData, null];
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
    });

    if (!proveedorFound) return [null, "Proveedor no encontrado"];

    // Formato de respuesta
    const responseData = {
      status: "Success",
      message: "Proveedor obtenido correctamente",
      data: {
        id: proveedorFound.id,
        nombre: proveedorFound.nombre,
        direccion: proveedorFound.direccion,
        banco: proveedorFound.banco,
        numeroCuenta: proveedorFound.numeroCuenta,
        tipoCuenta: proveedorFound.tipoCuenta,
        createdAt: proveedorFound.createdAt.toISOString(),
        updatedAt: proveedorFound.updatedAt.toISOString(),
      },
    };

    // Incluir encargado solo si su estado es true
    if (proveedorFound.estadoEncargado) {
      responseData.data.idEncargado = proveedorFound.idEncargado;
      responseData.data.nombreEncargado = proveedorFound.nombreEncargado;
      responseData.data.estadoEncargado = proveedorFound.estadoEncargado;
      responseData.data.movilEncargado = proveedorFound.movilEncargado;
      responseData.data.telefonoEncargado = proveedorFound.telefonoEncargado;
    } else {
      // Si el estado es false, solo mostrar el nombre
      responseData.data.nombreEncargado = proveedorFound.nombreEncargado;
    }

    // Incluir repartidor solo si su estado es true
    if (proveedorFound.estadoRepartidor) {
      responseData.data.idRepartidor = proveedorFound.idRepartidor;
      responseData.data.nombreRepartidor = proveedorFound.nombreRepartidor;
      responseData.data.estadoRepartidor = proveedorFound.estadoRepartidor;
      responseData.data.movilRepartidor = proveedorFound.movilRepartidor;
      responseData.data.telefonoRepartidor = proveedorFound.telefonoRepartidor;
    } else {
      // Si el estado es false, solo mostrar el nombre
      responseData.data.nombreRepartidor = proveedorFound.nombreRepartidor;
    }

    return [responseData, null];
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

    // Actualizar el proveedor
    const updatedProveedor = Object.assign(proveedorFound, body);

    // Guardar el proveedor actualizado
    await proveedorRepository.save(updatedProveedor);

    const responseData = {
      status: "Success",
      message: "Proveedor actualizado correctamente",
      data: {
        id: updatedProveedor.id,
        nombre: updatedProveedor.nombre,
        direccion: updatedProveedor.direccion,
        banco: updatedProveedor.banco,
        numeroCuenta: updatedProveedor.numeroCuenta,
        tipoCuenta: updatedProveedor.tipoCuenta,
        idEncargado: updatedProveedor.idEncargado,
        nombreEncargado: updatedProveedor.nombreEncargado,
        estadoEncargado: updatedProveedor.estadoEncargado,
        movilEncargado: updatedProveedor.movilEncargado,
        telefonoEncargado: updatedProveedor.telefonoEncargado,
        idRepartidor: updatedProveedor.idRepartidor,
        nombreRepartidor: updatedProveedor.nombreRepartidor,
        estadoRepartidor: updatedProveedor.estadoRepartidor,
        movilRepartidor: updatedProveedor.movilRepartidor,
        telefonoRepartidor: updatedProveedor.telefonoRepartidor,
        createdAt: updatedProveedor.createdAt.toISOString(),
        updatedAt: updatedProveedor.updatedAt.toISOString(),
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
