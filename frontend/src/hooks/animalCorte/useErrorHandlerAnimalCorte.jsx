import { useState } from "react";

// Función para validar el nombre de la lista
const validateNombreLista = (nombre, nombreExistentes = [], currentId = null) => {
  if (!nombre || nombre.trim() === "") {
    return {
      status: "Client error",
      message: "El nombre de la lista no puede estar vacío.",
      details: {}
    };
  }

  // Validar duplicados en el frontend
  const nombreTrimmed = nombre.trim();
  const existeNombre = nombreExistentes.some(item => 
    item.nombreLista.trim().toLowerCase() === nombreTrimmed.toLowerCase() && 
    item.id !== currentId
  );

  if (existeNombre) {
    return {
      field: 'nombreLista',
      status: "Client error",
      message: "Ya existe un tipo de animal con este nombre de lista.",
      details: {}
    };
  }

  if (nombre.length > 50) {
    return {
      status: "Client error",
      message: "El nombre de la lista debe tener como máximo 50 caracteres.",
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
  if (typeof cantidad !== 'number') {
    return {
      status: "Client error",
      message: "Los kg deben ser un número.",
      details: {}
    };
  }
  if (cantidad < 0) {
    return {
      status: "Client error",
      message: "Los kg no pueden ser negativos.",
      details: {}
    };
  }
  if (cantidad > 9999999) {
    return {
      status: "Client error",
      message: "Los kg no pueden ser mayor a 7 cifras.",
      details: {}
    };
  }
  return null;
};

// Función para validar el precio
const validatePrecio = (precio) => {
  if (typeof precio !== 'number') {
    return {
      status: "Client error",
      message: "El precio debe ser un número.",
      details: {}
    };
  }
  if (precio < 0) {
    return {
      status: "Client error",
      message: "El precio no puede ser negativo.",
      details: {}
    };
  }
  if (precio > 9999999) {
    return {
      status: "Client error",
      message: "El precio no puede ser mayor a 7 cifras.",
      details: {}
    };
  }
  return null;
};

export const useErrorHandlerAnimalCorte = () => {
  const [createError, setCreateError] = useState(null);
  const [editError, setEditError] = useState(null);

  const handleCreateError = (data, listaExistente = []) => {
    const errors = [];

    // Validar nombre incluyendo verificación de duplicados
    const nombreListaError = validateNombreLista(data.nombreLista, listaExistente);
    if (nombreListaError) {
      errors.push({
        field: 'nombreLista',
        message: nombreListaError.message
      });
    }

    // Validar cantidades y precios
    for (const [key, value] of Object.entries(data)) {
      if (key.startsWith('precio') && value !== "") {
        const precioError = validatePrecio(parseFloat(value));
        if (precioError) {
          errors.push({
            field: key,
            message: precioError.message
          });
        }
      } else if (!key.startsWith('precio') && !key.startsWith('nombre') && value !== "") {
        const cantidadError = validateCantidad(parseFloat(value));
        if (cantidadError) {
          errors.push({
            field: key,
            message: cantidadError.message
          });
        }
      }
    }

    if (errors.length > 0) {
      setCreateError({
        status: "Client error",
        errors: errors,
        details: {}
      });
      return true;
    }

    setCreateError(null);
    return false;
  };  const handleEditError = (data, listaExistente = [], currentId = null) => {
    const errors = [];

    // Validar nombre incluyendo verificación de duplicados
    const nombreListaError = validateNombreLista(data.nombreLista, listaExistente, currentId);
    if (nombreListaError) {
      errors.push({
        field: 'nombreLista',
        message: nombreListaError.message
      });
    }

    // Validar cantidades y precios
    for (const [key, value] of Object.entries(data)) {
      if (key.startsWith('precio') && value !== "") {
        const precioError = validatePrecio(parseFloat(value));
        if (precioError) {
          errors.push({
            field: key,
            message: precioError.message
          });
        }
      } else if (!key.startsWith('precio') && !key.startsWith('nombre') && value !== "") {
        const cantidadError = validateCantidad(parseFloat(value));
        if (cantidadError) {
          errors.push({
            field: key,
            message: cantidadError.message
          });
        }
      }
    }

    if (errors.length > 0) {
      setEditError({
        status: "Client error",
        errors: errors,
        details: {}
      });
      return true;
    }

    setEditError(null);
    return false;
  };

  return {
    createError,
    editError,
    handleCreateError,
    handleEditError
  };
};
