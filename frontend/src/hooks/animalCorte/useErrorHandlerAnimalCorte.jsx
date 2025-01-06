import { useState } from "react";

// Función para validar el nombre de la lista
const validateNombreLista = (nombre) => {
  if (!nombre || nombre.trim() === "") return "El nombre de la lista no puede estar vacío.";
  if (nombre.length < 3) return "El nombre de la lista debe tener al menos 3 caracteres.";
  if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(nombre)) return "El nombre de la lista solo puede contener letras y espacios.";
  return null;
};

// Función para validar la cantidad (abastero)
const validateCantidad = (cantidad) => {
  if (cantidad < 0) return "La cantidad no puede ser negativa.";
  if (cantidad.toString().includes('.') && cantidad.toString().split('.')[1].length > 2) {
    return "La cantidad debe tener como máximo 2 decimales.";
  }
  return null;
};

// Función para validar el precio
const validatePrecio = (precio) => {
  if (precio < 0) return "El precio no puede ser negativo.";
  if (!Number.isInteger(precio)) return "El precio debe ser un número entero.";
  return null;
};

// El hook devuelve los errores y las funciones para manejar cada uno de ellos.
export const useErrorHandlerAnimalCorte = () => {
  const [createError, setCreateError] = useState(null);
  const [editError, setEditError] = useState(null);
  const [deleteError, setDeleteError] = useState(null);

  // Función para manejar errores de creación de un animal corte
  const handleCreateError = (newAnimalCorteData) => {
    const { nombreLista, abastero, precioAbastero } = newAnimalCorteData;

    const errorMessages = {};

    // Validar nombre de la lista
    const nombreError = validateNombreLista(nombreLista);
    if (nombreError) errorMessages.nombreLista = nombreError;

    // Validar cantidad
    const cantidadError = validateCantidad(abastero);
    if (cantidadError) errorMessages.abastero = cantidadError;

    // Validar precio
    const precioError = validatePrecio(precioAbastero);
    if (precioError) errorMessages.precioAbastero = precioError;

    // Si hay errores, los mostramos
    if (Object.keys(errorMessages).length > 0) {
      setCreateError(errorMessages);
      return true; // Retorna true si hay errores
    }

    setCreateError(null); // Limpiar errores si no hay problemas
    return false;
  };

  // Función para manejar errores de edición
  const handleEditError = (updatedAnimalCorteData) => {
    const { nombreLista, abastero, precioAbastero } = updatedAnimalCorteData;

    const errorMessages = {};

    // Validar nombre de la lista
    const nombreError = validateNombreLista(nombreLista);
    if (nombreError) errorMessages.nombreLista = nombreError;

    // Validar cantidad
    const cantidadError = validateCantidad(abastero);
    if (cantidadError) errorMessages.abastero = cantidadError;

    // Validar precio
    const precioError = validatePrecio(precioAbastero);
    if (precioError) errorMessages.precioAbastero = precioError;

    // Si hay errores, los mostramos
    if (Object.keys(errorMessages).length > 0) {
      setEditError(errorMessages);
      return true; // Retorna true si hay errores
    }

    setEditError(null); // Limpiar errores si no hay problemas
    return false;
  };

  // Función para manejar errores de eliminación
  const handleDeleteError = (animalCorteToDelete) => {
    if (!animalCorteToDelete || !animalCorteToDelete.id) {
      setDeleteError("No se pudo eliminar el animal/corte. Inténtalo nuevamente.");
      return true;
    }

    setDeleteError(null); // Limpiar error si no hay problemas
    return false;
  };

  return {
    createError,
    editError,
    deleteError,
    handleCreateError,
    handleEditError,
    handleDeleteError,
  };
};
