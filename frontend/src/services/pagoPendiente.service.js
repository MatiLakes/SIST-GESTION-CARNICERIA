"use strict";

import axiosInstance from "./root.service.js";

export const getPagosPendientes = async () => {
  try {
    // Verificamos que exista el token en las cookies antes de hacer la petición
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('jwt-auth='))
      ?.split('=')[1];
    
    if (!token) {
      console.error("No se encontró el token JWT en las cookies");
      throw new Error("No se encontró la sesión. Por favor inicia sesión nuevamente.");
    }
    
    console.log("Realizando petición a /pagos-pendientes con token:", token ? "Token presente" : "Token ausente");
    
    const response = await axiosInstance.get("/pagos-pendientes");
    
    // Verificamos la respuesta para depurar
    console.log("Respuesta completa de API:", response);
    console.log("Estatus de respuesta:", response.status);
    console.log("Cabeceras de respuesta:", response.headers);
    
    // La estructura esperada es { status, message, data } dentro de response.data
    if (response && response.data && response.data.data) {
      console.log("Estructura detectada: response.data.data", response.data.data);
      return response.data.data;
    } else if (response && response.data) {
      console.log("Estructura detectada: response.data", response.data);
      return response.data; // Por si acaso la API devuelve directamente los datos
    } else {
      console.error("Estructura de respuesta inesperada:", response);
      return [];
    }
  } catch (error) {
    // Mostrar información detallada del error
    if (error.response) {
      // El servidor respondió con un código de error
      console.error("Error de respuesta:", error.response.status, error.response.data);
      if (error.response.status === 401) {
        console.error("Error de autenticación - Usuario no autenticado");
      } else if (error.response.status === 403) {
        console.error("Error de autorización - Usuario no tiene permisos");
      }
    } else if (error.request) {
      // La solicitud se hizo pero no se recibió respuesta
      console.error("No se recibió respuesta del servidor:", error.request);
    } else {
      // Error al configurar la solicitud
      console.error("Error al configurar la solicitud:", error.message);
    }
    
    throw error; // Propagamos el error para manejarlo en el hook
  }
};

export const createPagoPendiente = async (pagoData) => {
  try {
    console.log('📤 Enviando datos al servidor:', pagoData);
    const response = await axiosInstance.post("/pagos-pendientes", pagoData);
    console.log('✅ Respuesta del servidor:', response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error al crear el pago pendiente:", error);
    
    // Extraer información útil del error
    if (error.response) {
      console.error("📋 Status:", error.response.status);
      console.error("📋 Data:", error.response.data);
      console.error("📋 Headers:", error.response.headers);
      
      // Lanzar error con información específica del servidor
      let errorMessage = "Error desconocido al crear el pago pendiente";
      
      if (error.response.data) {
        // Si el servidor envía un mensaje específico
        if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data.details) {
          errorMessage = error.response.data.details;
        } else if (error.response.data.error) {
          errorMessage = error.response.data.error;
        }
      }
      
      // Agregar información del status code si es útil
      if (error.response.status === 400) {
        errorMessage = `Datos inválidos: ${errorMessage}`;
      } else if (error.response.status === 401) {
        errorMessage = "No autorizado. Por favor inicia sesión nuevamente.";
      } else if (error.response.status === 403) {
        errorMessage = "No tienes permisos para realizar esta acción.";
      } else if (error.response.status >= 500) {
        errorMessage = `Error del servidor: ${errorMessage}`;
      }
      
      throw new Error(errorMessage);
    } else if (error.request) {
      throw new Error("No se recibió respuesta del servidor. Verifica tu conexión a internet.");
    } else {
      throw new Error(`Error de configuración: ${error.message}`);
    }
  }
};

export const updatePagoPendiente = async (id, pagoData) => {
  try {
    const response = await axiosInstance.put(`/pagos-pendientes/${id}`, pagoData);
    return response.data;
  } catch (error) {
    console.error("Error al actualizar el pago pendiente:", error);
    throw error;
  }
};

export const deletePagoPendiente = async (id) => {
  try {
    await axiosInstance.delete(`/pagos-pendientes/${id}`);
  } catch (error) {
    console.error("Error al eliminar el pago pendiente:", error);
    throw error;
  }
};
