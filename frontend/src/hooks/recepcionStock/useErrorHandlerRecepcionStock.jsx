import { useState } from "react";

export const useErrorHandlerRecepcionStock = () => {
  const [createError, setCreateError] = useState("");
  const [editError, setEditError] = useState("");

  const validateRecepcion = (recepcion) => {
    // Validar que se haya seleccionado un producto
    if (!recepcion.productoId || recepcion.productoId === "") {
      return "Debe seleccionar un producto";
    }
    
    // Validar que la cantidad sea un número mayor que 0
    if (!recepcion.cantidad || recepcion.cantidad <= 0) {
      return "La cantidad debe ser mayor que 0";
    }
    
    // Validar que el costo unitario sea un número mayor que 0
    if (!recepcion.costoUnitario || recepcion.costoUnitario <= 0) {
      return "El costo unitario debe ser mayor que 0";
    }

    // Validar la fecha de vencimiento
    if (!recepcion.fechaVencimiento) {
      return "Debe ingresar una fecha de vencimiento";
    }
    
    return null;
  };

  const handleCreateError = (recepcion) => {
    const validationError = validateRecepcion(recepcion);
    if (validationError) {
      setCreateError(validationError);
      return true;
    }
    setCreateError("");
    return false;
  };

  const handleEditError = (recepcion) => {
    const validationError = validateRecepcion(recepcion);
    if (validationError) {
      setEditError(validationError);
      return true;
    }
    setEditError("");
    return false;
  };

  return {
    createError,
    editError,
    handleCreateError,
    handleEditError,
  };
};
