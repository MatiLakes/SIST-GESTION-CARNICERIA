"use strict";

import { useState, useEffect } from "react";
import { getPagosPendientes } from "@services/pagoPendiente.service.js";

const useGetPagosPendientes = () => {
  const [pagosPendientes, setPagosPendientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const fetchPagosPendientes = async () => {
    setLoading(true);
    setError(null);
    
    // Verificar si el usuario tiene rol de administrador
    const userData = JSON.parse(sessionStorage.getItem('usuario')) || {};
    if (userData.rol !== 'administrador') {
      console.error("Acceso denegado: Se requiere rol de administrador para ver los pagos pendientes");
      setError("No tienes permisos para ver los pagos pendientes. Se requiere rol de administrador.");
      setLoading(false);
      return;
    }
    
    try {
      console.log("Iniciando solicitud de pagos pendientes...");
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('jwt-auth='))
        ?.split('=')[1];
      
      if (!token) {
        console.error("No se encontró el token JWT en las cookies");
        setError("No se encontró la sesión. Por favor inicia sesión nuevamente.");
        setLoading(false);
        return;
      }
      
      console.log("Token JWT disponible:", token ? "Sí" : "No");
      const response = await getPagosPendientes();
      
      console.log("Respuesta API Pagos Pendientes:", response);

      // Verificar si la respuesta tiene la estructura esperada del backend
      if (response && response.data) {
        console.log("Usando estructura response.data:", response.data);
        setPagosPendientes(Array.isArray(response.data) ? response.data : []);
      } else {
        // Si la respuesta no tiene la estructura esperada, intentamos usarla directamente
        console.log("Usando respuesta directa:", response);
        setPagosPendientes(Array.isArray(response) ? response : []);
      }
      
      console.log("Estado final de pagosPendientes:", 
                  Array.isArray(response?.data) ? response.data : 
                  Array.isArray(response) ? response : []);
    } catch (err) {
      // Manejar diferentes tipos de errores
      if (err.response) {
        // Error con respuesta del servidor
        if (err.response.status === 401) {
          setError("No tienes acceso. Por favor inicia sesión nuevamente.");
        } else if (err.response.status === 403) {
          setError("No tienes permisos para ver los pagos pendientes.");
        } else {
          setError(`Error del servidor: ${err.response.status} - ${err.response.data?.message || "Error desconocido"}`);
        }
      } else if (err.request) {
        // Error sin respuesta del servidor
        setError("No se pudo conectar con el servidor. Verifica tu conexión a internet.");
      } else {
        // Error de configuración
        setError(`Error: ${err.message}`);
      }
      
      console.error("Error al obtener los pagos pendientes:", err);
      setPagosPendientes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPagosPendientes();
  }, []);

  return { pagosPendientes, loading, error, fetchPagosPendientes };
};

export default useGetPagosPendientes;
