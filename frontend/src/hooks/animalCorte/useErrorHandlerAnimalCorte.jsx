import { useState } from "react";

// Función para validar el nombre de la lista
const validateNombreLista = (nombre) => {
  if (!nombre || nombre.trim() === "") {
    return {
      status: "Client error",
      message: "El nombre de la lista no puede estar vacío.",
      details: {}
    };
  }
  if (nombre.length < 3) {
    return {
      status: "Client error",
      message: "El nombre de la lista debe tener al menos 3 caracteres.",
      details: {}
    };
  }
  if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(nombre)) {
    return {
      status: "Client error",
      message: "El nombre de la lista solo puede contener letras y espacios.",
      details: {}
    };
  }
  
  return null;
};

// Función para validar la cantidad
const validateCantidad = (cantidad) => {
  if (cantidad < 0) {
    return {
      status: "Client error",
      message: "La cantidad no puede ser negativa.",
      details: {}
    };
  }
  if (cantidad.toString().includes('.') && cantidad.toString().split('.')[1].length > 2) {
    return {
      status: "Client error",
      message: "La cantidad debe tener como máximo 2 decimales.",
      details: {}
    };
  }
  return null;
};

// Función para validar el precio
const validatePrecio = (precio) => {
  if (precio < 0) {
    return {
      status: "Client error",
      message: "El precio no puede ser negativo.",
      details: {}
    };
  }
  if (precio.toString().includes('.') && precio.toString().split('.')[1].length > 2) {
    return {
      status: "Client error",
      message: "El precio debe tener como máximo 2 decimales.",
      details: {}
    };
  }
  return null;
};

export const useErrorHandlerAnimalCorte = () => {
  const [createError, setCreateError] = useState(null);
  const [editError, setEditError] = useState(null);

  const handleCreateError = (data) => {
    const nombreListaError = validateNombreLista(data.nombreLista);
    if (nombreListaError) {
      setCreateError(nombreListaError);
      return true;
    }

    // Validar cantidades y precios
    for (const [key, value] of Object.entries(data)) {
      if (key.startsWith('precio') && value !== "") {
        const precioError = validatePrecio(parseFloat(value));
        if (precioError) {
          setCreateError({
            ...precioError,
            message: `Error en ${key}: ${precioError.message}`
          });
          return true;
        }
      } else if (!key.startsWith('precio') && !key.startsWith('nombre') && value !== "") {
        const cantidadError = validateCantidad(parseFloat(value));
        if (cantidadError) {
          setCreateError({
            ...cantidadError,
            message: `Error en ${key}: ${cantidadError.message}`
          });
          return true;
        }
      }
    }

    setCreateError(null);
    return false;
  };

  const handleEditError = (data) => {
    const nombreListaError = validateNombreLista(data.nombreLista);
    if (nombreListaError) {
      setEditError(nombreListaError);
      return true;
    }

    // Validar cantidades y precios
    for (const [key, value] of Object.entries(data)) {
      if (key.startsWith('precio') && value !== "") {
        const precioError = validatePrecio(parseFloat(value));
        if (precioError) {
          setEditError({
            ...precioError,
            message: `Error en ${key}: ${precioError.message}`
          });
          return true;
        }
      } else if (!key.startsWith('precio') && !key.startsWith('nombre') && value !== "") {
        const cantidadError = validateCantidad(parseFloat(value));
        if (cantidadError) {
          setEditError({
            ...cantidadError,
            message: `Error en ${key}: ${cantidadError.message}`
          });
          return true;
        }
      }
    }

    setEditError(null);
    return false;
  };

  return {
    createError,
    editError,
    handleCreateError,
    handleEditError,
    setCreateError,
    setEditError
  };
};
