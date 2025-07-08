import { useState } from "react";

// Función para validar documento único por día
const validateDocumentoUnicoPorDia = (fecha, documentos = [], documentoActualId = null) => {
  if (!fecha) return null;
  
  // Verificar si ya existe un documento para esta fecha
  const documentoExistente = documentos.find(doc => {
    const fechaDoc = doc.fecha.split('T')[0]; // Obtener solo YYYY-MM-DD
    return fechaDoc === fecha && doc.id !== documentoActualId;
  });
  
  if (documentoExistente) {
    return {
      status: "Client error",
      message: `Ya existe un documento de temperatura para la fecha ${fecha}. Solo se permite un documento por día.`,
      details: {}
    };
  }
  
  return null;
};

// Función para validar la fecha (igual que control higiene)
const validateFecha = (fecha) => {
  if (!fecha) {
    return {
      status: "Client error",
      message: "La fecha es obligatoria.",
      details: {}
    };
  }

  // Crear fecha desde el input (formato YYYY-MM-DD) de manera local
  const [año, mes, dia] = fecha.split('-').map(Number);
  const fechaIngresada = new Date(año, mes - 1, dia); // mes - 1 porque Date usa 0-11 para meses
  
  if (isNaN(fechaIngresada.getTime())) {
    return {
      status: "Client error",
      message: "La fecha debe ser una fecha válida.",
      details: {}
    };
  }

  // Obtener la fecha actual solo con año, mes y día (sin hora)
  const fechaActual = new Date();
  const fechaHoy = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), fechaActual.getDate());

  if (fechaIngresada > fechaHoy) {
    return {
      status: "Client error",
      message: "La fecha no puede ser posterior a la fecha actual.",
      details: {}
    };
  }

  return null;
};

// Función para validar la hora
const validateHora = (hora) => {
  if (!hora) {
    return {
      status: "Client error",
      message: "La hora es obligatoria.",
      details: {}
    };
  }

  const horaPattern = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  if (!horaPattern.test(hora)) {
    return {
      status: "Client error",
      message: "La hora debe tener el formato HH:MM (24 horas).",
      details: {}
    };
  }

  return null;
};

// Función para validar el equipo
const validateEquipo = (equipo) => {
  if (!equipo || equipo.trim() === "") {
    return {
      status: "Client error",
      message: "El nombre del equipo es obligatorio.",
      details: {}
    };
  }

  if (equipo.length > 100) {
    return {
      status: "Client error",
      message: "El nombre del equipo no puede tener más de 100 caracteres.",
      details: {}
    };
  }

  return null;
};

// Función para validar la temperatura
const validateTemperatura = (temperatura) => {
  if (temperatura === "" || temperatura === null || temperatura === undefined) {
    return {
      status: "Client error",
      message: "La temperatura es obligatoria.",
      details: {}
    };
  }

  const tempNumber = parseFloat(temperatura);
  
  if (isNaN(tempNumber)) {
    return {
      status: "Client error",
      message: "La temperatura debe ser un número.",
      details: {}
    };
  }

  if (tempNumber < -100) {
    return {
      status: "Client error",
      message: "La temperatura no puede ser menor a -100°C.",
      details: {}
    };
  }

  if (tempNumber > 100) {
    return {
      status: "Client error",
      message: "La temperatura no puede ser mayor a 100°C.",
      details: {}
    };
  }

  // Validar que no tenga más de 1 decimal
  const tempString = temperatura.toString();
  if (tempString.includes('.')) {
    const decimalPlaces = tempString.split('.')[1].length;
    if (decimalPlaces > 1) {
      return {
        status: "Client error",
        message: "La temperatura puede tener máximo 1 decimal.",
        details: {}
      };
    }
  }

  return null;
};

// Función para validar el campo funciona
const validateFunciona = (funciona) => {
  if (typeof funciona !== 'boolean') {
    return {
      status: "Client error",
      message: "El estado de funcionamiento debe ser verdadero o falso.",
      details: {}
    };
  }
  return null;
};

// Función para validar el motivo (condicional)
const validateMotivo = (motivo, funciona) => {
  if (!funciona) {
    // Si el equipo no funciona, el motivo es obligatorio
    if (!motivo || motivo.trim() === "") {
      return {
        status: "Client error",
        message: "El motivo es obligatorio cuando el equipo no funciona correctamente.",
        details: {}
      };
    }
    if (motivo.length > 200) {
      return {
        status: "Client error",
        message: "El motivo no puede tener más de 200 caracteres.",
        details: {}
      };
    }
  } else {
    // Si el equipo funciona, validar longitud si se proporciona
    if (motivo && motivo.length > 200) {
      return {
        status: "Client error",
        message: "El motivo no puede tener más de 200 caracteres.",
        details: {}
      };
    }
  }
  return null;
};

// Función para validar la acción correctiva (condicional)
const validateAccionCorrectiva = (accionCorrectiva, funciona) => {
  if (!funciona) {
    // Si el equipo no funciona, la acción correctiva es obligatoria
    if (!accionCorrectiva || accionCorrectiva.trim() === "") {
      return {
        status: "Client error",
        message: "La acción correctiva es obligatoria cuando el equipo no funciona correctamente.",
        details: {}
      };
    }
    if (accionCorrectiva.length > 200) {
      return {
        status: "Client error",
        message: "La acción correctiva no puede tener más de 200 caracteres.",
        details: {}
      };
    }
  } else {
    // Si el equipo funciona, validar longitud si se proporciona
    if (accionCorrectiva && accionCorrectiva.length > 200) {
      return {
        status: "Client error",
        message: "La acción correctiva no puede tener más de 200 caracteres.",
        details: {}
      };
    }
  }
  return null;
};

// Función para validar el responsable
const validateResponsable = (responsableId, personalDisponible = []) => {
  if (!responsableId) {
    return {
      status: "Client error",
      message: "El responsable es obligatorio.",
      details: {}
    };
  }

  const responsableIdNum = parseInt(responsableId);
  if (isNaN(responsableIdNum) || responsableIdNum <= 0) {
    return {
      status: "Client error",
      message: "El ID del responsable debe ser un número positivo.",
      details: {}
    };
  }

  const esValido = personalDisponible.some(persona => persona.id === responsableIdNum);
  
  if (!esValido) {
    return {
      status: "Client error",
      message: "El responsable seleccionado no es válido.",
      details: {}
    };
  }

  return null;
};

// Función para validar un registro individual
const validateRegistro = (registro, index, personalDisponible = []) => {
  const errors = [];

  // Validar hora
  const horaError = validateHora(registro.hora);
  if (horaError) {
    errors.push({
      field: `registros.${index}.hora`,
      message: horaError.message
    });
  }

  // Validar equipo
  const equipoError = validateEquipo(registro.equipo);
  if (equipoError) {
    errors.push({
      field: `registros.${index}.equipo`,
      message: equipoError.message
    });
  }

  // Validar temperatura
  const temperaturaError = validateTemperatura(registro.temperatura);
  if (temperaturaError) {
    errors.push({
      field: `registros.${index}.temperatura`,
      message: temperaturaError.message
    });
  }

  // Validar funciona
  const funcionaError = validateFunciona(registro.funciona);
  if (funcionaError) {
    errors.push({
      field: `registros.${index}.funciona`,
      message: funcionaError.message
    });
  }

  // Validar motivo (condicional)
  const motivoError = validateMotivo(registro.motivo, registro.funciona);
  if (motivoError) {
    errors.push({
      field: `registros.${index}.motivo`,
      message: motivoError.message
    });
  }

  // Validar acción correctiva (condicional)
  const accionError = validateAccionCorrectiva(registro.AccionCorrectiva, registro.funciona);
  if (accionError) {
    errors.push({
      field: `registros.${index}.AccionCorrectiva`,
      message: accionError.message
    });
  }

  // Validar responsable
  const responsableError = validateResponsable(registro.responsableId, personalDisponible);
  if (responsableError) {
    errors.push({
      field: `registros.${index}.responsableId`,
      message: responsableError.message
    });
  }

  return errors;
};

// Función para validar todos los registros
const validateRegistros = (registros, personalDisponible = []) => {
  if (!registros || !Array.isArray(registros)) {
    return [{
      field: 'registros',
      message: 'Los registros deben ser un array.'
    }];
  }

  if (registros.length < 1) {
    return [{
      field: 'registros',
      message: 'Debe haber al menos 1 registro de temperatura.'
    }];
  }

  const allErrors = [];
  registros.forEach((registro, index) => {
    const registroErrors = validateRegistro(registro, index, personalDisponible);
    allErrors.push(...registroErrors);
  });

  return allErrors;
};

export const useErrorHandlerDocumentoTemperatura = () => {
  const [createError, setCreateError] = useState(null);
  const [editError, setEditError] = useState(null);

  // Función utilitaria para obtener errores de un campo específico
  const getFieldErrors = (errorState, fieldName) => {
    if (!errorState || !errorState.errors) return [];
    return errorState.errors.filter(error => error.field === fieldName);
  };

  const handleCreateError = (data, personalDisponible = [], documentos = []) => {
    const errors = [];

    // Validar fecha
    const fechaError = validateFecha(data.fecha);
    if (fechaError) {
      errors.push({
        field: 'fecha',
        message: fechaError.message
      });
    }

    // Validar documento único por día
    const documentoUnicoError = validateDocumentoUnicoPorDia(data.fecha, documentos);
    if (documentoUnicoError) {
      errors.push({
        field: 'fecha',
        message: documentoUnicoError.message
      });
    }

    // Validar registros
    const registrosErrors = validateRegistros(data.registros, personalDisponible);
    errors.push(...registrosErrors);

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

  const handleEditError = (data, personalDisponible = [], documentos = [], documentoActualId = null) => {
    const errors = [];

    // Validar fecha
    const fechaError = validateFecha(data.fecha);
    if (fechaError) {
      errors.push({
        field: 'fecha',
        message: fechaError.message
      });
    }

    // Validar documento único por día (excluyendo el documento actual)
    const documentoUnicoError = validateDocumentoUnicoPorDia(data.fecha, documentos, documentoActualId);
    if (documentoUnicoError) {
      errors.push({
        field: 'fecha',
        message: documentoUnicoError.message
      });
    }

    // Validar registros
    const registrosErrors = validateRegistros(data.registros, personalDisponible);
    errors.push(...registrosErrors);

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
    handleEditError,
    clearCreateError: () => setCreateError(null),
    clearEditError: () => setEditError(null),
    getFieldErrors
  };
};
