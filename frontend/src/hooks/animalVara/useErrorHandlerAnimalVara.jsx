import { useState } from "react";

// Validar fecha de llegada
const validateFechaLlegada = (fecha) => {
  if (!fecha) {
    return {
      status: "Client error",
      message: "La fecha de llegada es obligatoria.",
      details: {}
    };
  }
  const [año, mes, dia] = fecha.split('-').map(Number);
  const fechaIngresada = new Date(año, mes - 1, dia);
  if (isNaN(fechaIngresada.getTime())) {
    return {
      status: "Client error",
      message: "La fecha de llegada debe ser una fecha válida.",
      details: {}
    };
  }
  const fechaActual = new Date();
  const fechaHoy = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), fechaActual.getDate());
  if (fechaIngresada > fechaHoy) {
    return {
      status: "Client error",
      message: "La fecha de llegada no puede ser posterior a hoy.",
      details: {}
    };
  }
  return null;
};

// Validar temperatura de llegada
const validateTemperaturaLlegada = (temperatura) => {
  if (temperatura === undefined || temperatura === "") {
    return {
      status: "Client error",
      message: "La temperatura de llegada es obligatoria.",
      details: {}
    };
  }
  const tempNum = parseFloat(temperatura);
  if (isNaN(tempNum)) {
    return {
      status: "Client error",
      message: "La temperatura de llegada debe ser un número.",
      details: {}
    };
  }
  if (tempNum < -10) {
    return {
      status: "Client error",
      message: "La temperatura de llegada no puede ser menor a -10°C.",
      details: {}
    };
  }
  if (tempNum > 10) {
    return {
      status: "Client error",
      message: "La temperatura de llegada no puede ser mayor a 10°C.",
      details: {}
    };
  }
  return null;
};

// Validar precio total de la vara
const validatePrecioTotalVara = (precio) => {
  if (precio === undefined || precio === "") {
    return {
      status: "Client error",
      message: "El precio total de la vara es obligatorio.",
      details: {}
    };
  }
  const precioNum = parseInt(precio);
  if (isNaN(precioNum)) {
    return {
      status: "Client error",
      message: "El precio total de la vara debe ser un número.",
      details: {}
    };
  }
  if (precioNum < 1) {
    return {
      status: "Client error",
      message: "El precio total de la vara debe ser mayor a 0.",
      details: {}
    };
  }
  if (precioNum > 99999999) {
    return {
      status: "Client error",
      message: "El precio total de la vara no puede tener más de 8 cifras.",
      details: {}
    };
  }
  if (!Number.isInteger(precioNum)) {
    return {
      status: "Client error",
      message: "El precio total de la vara debe ser un número entero.",
      details: {}
    };
  }
  return null;
};

// Validar tipoAnimalId
const validateTipoAnimalId = (tipoAnimalId, tiposDisponibles = []) => {
  if (!tipoAnimalId || tipoAnimalId === "") {
    return {
      status: "Client error",
      message: "El tipo de animal es obligatorio.",
      details: {}
    };
  }
  const idNum = parseInt(tipoAnimalId);
  if (isNaN(idNum) || !Number.isInteger(idNum) || idNum < 1) {
    return {
      status: "Client error",
      message: "El tipo de animal debe ser un id numérico válido.",
      details: {}
    };
  }
  const existe = tiposDisponibles.some(tipo => tipo.id === idNum);
  if (!existe) {
    return {
      status: "Client error",
      message: "El tipo de animal seleccionado no es válido.",
      details: {}
    };
  }
  return null;
};

export const useErrorHandlerAnimalVara = () => {
  const [createError, setCreateError] = useState(null);
  const [editError, setEditError] = useState(null);

  const handleCreateError = (data, tiposDisponibles = []) => {
    const errors = [];
    const fechaError = validateFechaLlegada(data.fechaLlegada);
    if (fechaError) errors.push({ field: 'fechaLlegada', message: fechaError.message });
    const temperaturaError = validateTemperaturaLlegada(data.temperaturaLlegada);
    if (temperaturaError) errors.push({ field: 'temperaturaLlegada', message: temperaturaError.message });
    const precioError = validatePrecioTotalVara(data.precioTotalVara);
    if (precioError) errors.push({ field: 'precioTotalVara', message: precioError.message });
    const tipoAnimalError = validateTipoAnimalId(data.tipoAnimalId, tiposDisponibles);
    if (tipoAnimalError) errors.push({ field: 'tipoAnimal', message: tipoAnimalError.message });
    if (errors.length > 0) {
      setCreateError({ status: "Client error", errors, details: {} });
      return true;
    }
    setCreateError(null);
    return false;
  };

  const handleEditError = (data, tiposDisponibles = []) => {
    const errors = [];
    const fechaError = validateFechaLlegada(data.fechaLlegada);
    if (fechaError) errors.push({ field: 'fechaLlegada', message: fechaError.message });
    const temperaturaError = validateTemperaturaLlegada(data.temperaturaLlegada);
    if (temperaturaError) errors.push({ field: 'temperaturaLlegada', message: temperaturaError.message });
    const precioError = validatePrecioTotalVara(data.precioTotalVara);
    if (precioError) errors.push({ field: 'precioTotalVara', message: precioError.message });
    const tipoAnimalError = validateTipoAnimalId(data.tipoAnimalId, tiposDisponibles);
    if (tipoAnimalError) errors.push({ field: 'tipoAnimal', message: tipoAnimalError.message });
    if (errors.length > 0) {
      setEditError({ status: "Client error", errors, details: {} });
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
