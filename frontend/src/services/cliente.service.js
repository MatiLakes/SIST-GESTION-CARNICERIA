"use strict";

import axiosInstance from "./root.service.js";

export const getClientes = async () => {
  try {
    const response = await axiosInstance.get("/clientes");
    console.log("Respuesta completa de clientes:", response);
    
    // Verifica si la respuesta tiene una estructura específica con data.data
    if (response.data && response.data.data) {
      console.log("Clientes obtenidos:", response.data.data);
      return Array.isArray(response.data.data) ? response.data.data : [];
    }
    
    // Si no hay estructura específica, usa toda la response.data
    console.log("Clientes obtenidos (formato alternativo):", response.data);
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Error al obtener los clientes:", error);
    throw error;
  }
};

export const createCliente = async (clienteData) => {
  try {
    // Log the data being sent
    console.log("Datos enviados para crear cliente:", clienteData);
    
    // Ensure all required fields are present
    const requiredFields = ['tipoCliente', 'rut', 'direccion', 'comuna', 'ciudad', 'region'];
    const missingFields = requiredFields.filter(field => !clienteData[field]);
    
    if (missingFields.length > 0) {
      console.error("Faltan campos requeridos:", missingFields);
      throw new Error(`Faltan campos requeridos: ${missingFields.join(', ')}`);
    }
    
    // Validate type-specific required fields
    if (clienteData.tipoCliente === "Empresa" && (!clienteData.razonSocial || !clienteData.giro)) {
      console.error("Para empresa se requiere razón social y giro");
      throw new Error("Para tipo Empresa se requieren los campos: Razón Social y Giro");
    }
    
    if (clienteData.tipoCliente === "Persona" && (!clienteData.nombres || !clienteData.apellidos)) {
      console.error("Para persona se requiere nombres y apellidos");
      throw new Error("Para tipo Persona se requieren los campos: Nombres y Apellidos");
    }
    
    const response = await axiosInstance.post("/clientes", clienteData);
    console.log("Cliente creado:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error al crear cliente:", error);
    if (error.response) {
      console.error("Detalles del error:", error.response.data);
    }
    throw error;
  }
};

export const updateCliente = async (id, clienteData) => {
  try {
    const response = await axiosInstance.put(`/clientes/${id}`, clienteData);
    console.log("Cliente actualizado:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error al actualizar cliente:", error);
    throw error;
  }
};

export const deleteCliente = async (id) => {
  try {
    await axiosInstance.delete(`/clientes/${id}`);
    console.log(`Cliente con ID ${id} eliminado.`);
  } catch (error) {
    console.error("Error al eliminar cliente:", error);
    throw error;
  }
};
