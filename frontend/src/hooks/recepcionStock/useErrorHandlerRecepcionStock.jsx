import { useState } from "react";

export const useErrorHandlerRecepcionStock = () => {
  const [createErrors, setCreateErrors] = useState({});
  const [editErrors, setEditErrors] = useState({});

  const validateCantidad = (cantidad) => {
    if (!cantidad && cantidad !== 0) {
      return "El campo cantidad es obligatorio";
    }
    
    const num = parseFloat(cantidad);
    if (isNaN(num)) {
      return "La cantidad debe ser un número válido";
    }
    
    if (num < 0) {
      return "La cantidad no puede ser negativa";
    }
    
    if (num > 10000) {
      return "La cantidad no puede ser mayor a 10,000";
    }
    
    // Verificar que no tenga más de 3 decimales
    const decimals = (cantidad.toString().split('.')[1] || '').length;
    if (decimals > 3) {
      return "La cantidad no puede tener más de 3 decimales";
    }
    
    return null;
  };

  const validateCostoUnitario = (costoUnitario) => {
    if (!costoUnitario && costoUnitario !== 0) {
      return "El campo costo unitario es obligatorio";
    }
    
    const num = parseFloat(costoUnitario);
    if (isNaN(num)) {
      return "El costo unitario debe ser un número válido";
    }
    
    if (num < 0) {
      return "El costo unitario no puede ser negativo";
    }
    
    if (num > 10000000) {
      return "El costo unitario no puede ser mayor a 10,000,000";
    }
    
    // Verificar que sea un entero (sin decimales)
    if (!Number.isInteger(num)) {
      return "El costo unitario debe ser un número entero (sin decimales)";
    }
    
    return null;
  };

  const validateProductoId = (productoId) => {
    if (!productoId || productoId === "") {
      return "Debe seleccionar un producto";
    }
    return null;
  };

  const validateFechaVencimiento = (fechaVencimiento) => {
    if (!fechaVencimiento) {
      return "Debe ingresar una fecha de vencimiento";
    }
    
    const fecha = new Date(fechaVencimiento);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    if (fecha < hoy) {
      return "La fecha de vencimiento no puede ser anterior a hoy";
    }
    
    return null;
  };

  const validateRecepcion = (recepcion) => {
    const errors = {};
    
    const productoError = validateProductoId(recepcion.productoId);
    if (productoError) errors.productoId = productoError;
    
    const cantidadError = validateCantidad(recepcion.cantidad);
    if (cantidadError) errors.cantidad = cantidadError;
    
    const costoError = validateCostoUnitario(recepcion.costoUnitario);
    if (costoError) errors.costoUnitario = costoError;
    
    const fechaError = validateFechaVencimiento(recepcion.fechaVencimiento);
    if (fechaError) errors.fechaVencimiento = fechaError;
    
    return errors;
  };

  const handleCreateError = (recepcion) => {
    const errors = validateRecepcion(recepcion);
    setCreateErrors(errors);
    return Object.keys(errors).length > 0;
  };

  const handleEditError = (recepcion) => {
    const errors = validateRecepcion(recepcion);
    setEditErrors(errors);
    return Object.keys(errors).length > 0;
  };

  const clearCreateErrors = () => setCreateErrors({});
  const clearEditErrors = () => setEditErrors({});

  return {
    createErrors,
    editErrors,
    handleCreateError,
    handleEditError,
    clearCreateErrors,
    clearEditErrors,
  };
};
