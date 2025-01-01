import { useState } from "react";

// El hook devuelve los errores y las funciones para manejar cada uno de ellos.
export const useErrorHandlerCategoria = () => {
  const [createError, setCreateError] = useState(null);
  const [editError, setEditError] = useState(null);
  const [deleteError, setDeleteError] = useState(null);

  // Función para manejar errores de creación
  const handleCreateError = (newCategoryData) => {
    if (newCategoryData.nombre.trim() === "") {
      setCreateError("El nombre de la categoría no puede estar vacío");
      return true; // Retorna true si hay un error
    }

    if (newCategoryData.nombre.length < 3) {
      setCreateError("El nombre debe tener al menos 3 caracteres.");
      return true;
    }

    setCreateError(null); // Limpiar error si no hay problemas
    return false;
  };

  // Función para manejar errores de edición
  const handleEditError = (formData) => {
    if (formData.nombre.trim() === "") {
      setEditError("El nombre de la categoría no puede estar vacío");
      return true;
    }

    if (formData.nombre.length < 3) {
      setEditError("El nombre debe tener al menos 3 caracteres.");
      return true;
    }

    setEditError(null); // Limpiar error si no hay problemas
    return false;
  };

  // Función para manejar errores de eliminación
  const handleDeleteError = (categoriaToDelete) => {
    if (!categoriaToDelete) {
      setDeleteError("No se pudo eliminar la categoría. Inténtalo nuevamente.");
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
