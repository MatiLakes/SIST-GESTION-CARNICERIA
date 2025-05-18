"use strict";

import { AppDataSource } from "../config/configDb.js";
import Cliente from "../entity/Cliente.entity.js";

export const clienteService = {
  async crearCliente(data) {
    try {
      // Validar campos requeridos
      const requiredFields = ['tipoCliente', 'rut', 'direccion', 'comuna', 'ciudad', 'region'];
      for (const field of requiredFields) {
        if (!data[field]) {
          return [null, `El campo ${field} es obligatorio.`];
        }
      }
      
      // Validaciones específicas por tipo de cliente
      if (data.tipoCliente === 'Empresa' && (!data.razonSocial || !data.giro)) {
        return [null, 'Para clientes de tipo Empresa, los campos razonSocial y giro son obligatorios.'];
      }
      
      if (data.tipoCliente === 'Persona' && (!data.nombres || !data.apellidos)) {
        return [null, 'Para clientes de tipo Persona, los campos nombres y apellidos son obligatorios.'];
      }
      
      // Validar que el RUT sea único
      const clienteRepository = AppDataSource.getRepository(Cliente);
      const clienteExistente = await clienteRepository.findOne({ where: { rut: data.rut } });
      if (clienteExistente) {
        return [null, `Ya existe un cliente con el RUT ${data.rut}.`];
      }
      
      const nuevoCliente = clienteRepository.create(data);
      await clienteRepository.save(nuevoCliente);
      return [nuevoCliente, null];
    } catch (error) {
      console.error("Error en crearCliente:", error);
      return [null, "No se pudo crear el cliente."];
    }
  },

  async obtenerClientes() {
    try {
      const clienteRepository = AppDataSource.getRepository(Cliente);
      const clientes = await clienteRepository.find();
      return [clientes, null];
    } catch (error) {
      console.error("Error en obtenerClientes:", error);
      return [null, "Error al obtener los clientes."];
    }
  },

  async modificarCliente(id, data) {
    try {
      const clienteRepository = AppDataSource.getRepository(Cliente);
      const cliente = await clienteRepository.findOneBy({ id });

      if (!cliente) return [null, "Cliente no encontrado."];

      Object.assign(cliente, data);
      await clienteRepository.save(cliente);

      return [cliente, null];
    } catch (error) {
      console.error("Error en modificarCliente:", error);
      return [null, "No se pudo modificar el cliente."];
    }
  },

  async eliminarCliente(id) {
    try {
      const clienteRepository = AppDataSource.getRepository(Cliente);
      const cliente = await clienteRepository.findOneBy({ id });

      if (!cliente) return [null, "Cliente no encontrado."];

      await clienteRepository.remove(cliente);
      return [null, null];
    } catch (error) {
      console.error("Error en eliminarCliente:", error);
      return [null, "No se pudo eliminar el cliente."];
    }
  }
};
