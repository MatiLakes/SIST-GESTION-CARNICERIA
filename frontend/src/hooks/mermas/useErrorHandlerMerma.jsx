import { useState } from "react";

export const useErrorHandlerMerma = () => {
  const [createError, setCreateError] = useState("");
  const [editError, setEditError] = useState("");

  const handleCreateError = (error) => {
    if (error.response && error.response.data && error.response.data.message) {
      setCreateError(error.response.data.message);
    } else {
      setCreateError("Error al crear la merma. Inténtelo de nuevo.");
    }
  };

  const handleEditError = (error) => {
    if (error.response && error.response.data && error.response.data.message) {
      setEditError(error.response.data.message);
    } else {
      setEditError("Error al editar la merma. Inténtelo de nuevo.");
    }
  };

  const clearErrors = () => {
    setCreateError("");
    setEditError("");
  };

  return {
    createError,
    editError,
    handleCreateError,
    handleEditError,
    clearErrors
  };
};
