"use strict";

import { useState, useEffect } from "react";
import { getClientes } from "@services/cliente.service.js";

const useGetClientes = () => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchClientes = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getClientes();
      console.log("Clientes recibidos en hook:", response);
      
      if (Array.isArray(response) && response.length > 0) {
        setClientes(response);
        console.log("Clientes cargados exitosamente:", response.length);
      } else {
        console.warn("No se recibieron clientes o el formato es incorrecto:", response);
        setClientes([]);
      }
    } catch (err) {
      console.error("Error al obtener los clientes:", err);
      setError(err.message || "Error al cargar los clientes");
      setClientes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  return { clientes, loading, error, fetchClientes };
};

export default useGetClientes;
