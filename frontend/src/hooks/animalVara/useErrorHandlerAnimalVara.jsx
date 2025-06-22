import { useState } from "react";

// Función para validar la fecha de llegada
const validateFechaLlegada = (fecha) => {
  if (!fecha) {
    return {
      status: "Client error",
      message: "La fecha de llegada es obligatoria.",
      details: {}
    };
  }  // Crear fecha desde el input (formato YYYY-MM-DD) de manera local
  const [año, mes, dia] = fecha.split('-').map(Number);
  const fechaIngresada = new Date(año, mes - 1, dia); // mes - 1 porque Date usa 0-11 para meses
  
  if (isNaN(fechaIngresada.getTime())) {
    return {
      status: "Client error",
      message: "La fecha de llegada debe ser una fecha válida.",
      details: {}
    };
  }

  // Obtener la fecha actual solo con año, mes y día (sin hora)
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

// Función para validar la temperatura de llegada
const validateTemperaturaLlegada = (temperatura) => {
  if (typeof temperatura !== 'number') {
    return {
      status: "Client error",
      message: "La temperatura de llegada debe ser un número.",
      details: {}
    };
  }
  
  if (temperatura < -10) {
    return {
      status: "Client error",
      message: "La temperatura de llegada no puede ser menor a -10°C.",
      details: {}
    };
  }
  
  if (temperatura > 10) {
    return {
      status: "Client error",
      message: "La temperatura de llegada no puede ser mayor a 10°C.",
      details: {}
    };
  }
  
  return null;
};

// Función para validar el precio total de la vara
const validatePrecioTotalVara = (precio) => {
  if (typeof precio !== 'number') {
    return {
      status: "Client error",
      message: "El precio total de la vara debe ser un número.",
      details: {}
    };
  }
  
  if (precio < 1) {
    return {
      status: "Client error",
      message: "El precio total de la vara debe ser mayor a 0.",
      details: {}
    };
  }
  
  if (precio > 99999999) {
    return {
      status: "Client error",
      message: "El precio total de la vara no puede tener más de 8 cifras.",
      details: {}
    };
  }
  
  if (!Number.isInteger(precio)) {
    return {
      status: "Client error",
      message: "El precio total de la vara debe ser un número entero.",
      details: {}
    };
  }
  
  return null;
};

// Función para validar el tipo de animal
const validateTipoAnimal = (tipoAnimal, tiposDisponibles = []) => {
  if (!tipoAnimal || !tipoAnimal.nombreLista) {
    return {
      status: "Client error",
      message: "El tipo de animal es obligatorio.",
      details: {}
    };
  }

  const nombreLista = tipoAnimal.nombreLista;
  const esValido = tiposDisponibles.some(tipo => tipo.nombreLista === nombreLista);
  
  if (!esValido) {
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

    // Validar fecha de llegada
    const fechaError = validateFechaLlegada(data.fechaLlegada);
    if (fechaError) {
      errors.push({
        field: 'fechaLlegada',
        message: fechaError.message
      });
    }

    // Validar temperatura de llegada
    if (data.temperaturaLlegada !== "" && data.temperaturaLlegada !== undefined) {
      const temperaturaError = validateTemperaturaLlegada(parseFloat(data.temperaturaLlegada));
      if (temperaturaError) {
        errors.push({
          field: 'temperaturaLlegada',
          message: temperaturaError.message
        });
      }
    }

    // Validar precio total de la vara
    if (data.precioTotalVara !== "" && data.precioTotalVara !== undefined) {
      const precioError = validatePrecioTotalVara(parseFloat(data.precioTotalVara));
      if (precioError) {
        errors.push({
          field: 'precioTotalVara',
          message: precioError.message
        });
      }
    }

    // Validar tipo de animal
    const tipoAnimalError = validateTipoAnimal(data.tipoAnimal, tiposDisponibles);
    if (tipoAnimalError) {
      errors.push({
        field: 'tipoAnimal',
        message: tipoAnimalError.message
      });
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
  };

  const handleEditError = (data, tiposDisponibles = []) => {
    const errors = [];

    // Validar fecha de llegada
    const fechaError = validateFechaLlegada(data.fechaLlegada);
    if (fechaError) {
      errors.push({
        field: 'fechaLlegada',
        message: fechaError.message
      });
    }

    // Validar temperatura de llegada
    if (data.temperaturaLlegada !== "" && data.temperaturaLlegada !== undefined) {
      const temperaturaError = validateTemperaturaLlegada(parseFloat(data.temperaturaLlegada));
      if (temperaturaError) {
        errors.push({
          field: 'temperaturaLlegada',
          message: temperaturaError.message
        });
      }
    }

    // Validar precio total de la vara
    if (data.precioTotalVara !== "" && data.precioTotalVara !== undefined) {
      const precioError = validatePrecioTotalVara(parseFloat(data.precioTotalVara));
      if (precioError) {
        errors.push({
          field: 'precioTotalVara',
          message: precioError.message
        });
      }
    }

    // Validar tipo de animal
    const tipoAnimalError = validateTipoAnimal(data.tipoAnimal, tiposDisponibles);
    if (tipoAnimalError) {
      errors.push({
        field: 'tipoAnimal',
        message: tipoAnimalError.message
      });
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
