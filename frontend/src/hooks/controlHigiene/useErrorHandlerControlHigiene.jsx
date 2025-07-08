import { useState } from "react";

// Función para validar la fecha
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

// Función para validar campos booleanos
const validateBooleanField = (value, fieldName) => {
  if (typeof value !== 'boolean') {
    return {
      status: "Client error",
      message: `${fieldName} debe ser verdadero o falso.`,
      details: {}
    };
  }
  return null;
};

// Función para validar la observación
const validateObservacion = (observacion) => {
  if (observacion && observacion.length > 500) {
    return {
      status: "Client error",
      message: "La observación no puede tener más de 500 caracteres.",
      details: {}
    };
  }
  return null;
};

// Función para validar el VB de cumplimiento
const validateVbCumplimiento = (vbCumplimiento) => {
  if (!vbCumplimiento) {
    return {
      status: "Client error",
      message: "El VB de cumplimiento es obligatorio.",
      details: {}
    };
  }

  if (!["C", "NC"].includes(vbCumplimiento)) {
    return {
      status: "Client error",
      message: "El VB de cumplimiento debe ser 'C' o 'NC'.",
      details: {}
    };
  }

  return null;
};

// Función para validar el número de acción correctiva
const validateNroAccionCorrectiva = (nroAccionCorrectiva, vbCumplimiento) => {
  if (!nroAccionCorrectiva) {
    return {
      status: "Client error",
      message: "El número de acción correctiva es obligatorio.",
      details: {}
    };
  }

  const accionesValidas = ["ACC N°1", "ACC N°2", "ACC N°3", "ACC N°4", "ACC N°5", "ACC N°6", "ACC N°7", "No Aplica"];
  
  if (!accionesValidas.includes(nroAccionCorrectiva)) {
    return {
      status: "Client error",
      message: "El número de acción correctiva debe ser una opción válida.",
      details: {}
    };
  }

  // Validación condicional basada en vbCumplimiento
  if (vbCumplimiento === "C") {
    // Cuando CUMPLE (C), la acción correctiva debe ser "No Aplica"
    if (nroAccionCorrectiva !== "No Aplica") {
      return {
        status: "Client error",
        message: "Para cumplimiento 'C', la acción correctiva debe ser 'No Aplica'.",
        details: {}
      };
    }
  } else if (vbCumplimiento === "NC") {
    // Cuando NO CUMPLE (NC), la acción correctiva debe ser una ACC del N°1 al N°7
    const accionesNC = ["ACC N°1", "ACC N°2", "ACC N°3", "ACC N°4", "ACC N°5", "ACC N°6", "ACC N°7"];
    if (!accionesNC.includes(nroAccionCorrectiva)) {
      return {
        status: "Client error",
        message: "Para no cumplimiento 'NC', la acción correctiva debe ser una ACC del N°1 al N°7.",
        details: {}
      };
    }
  }

  return null;
};

// Función para validar el personal
const validatePersonal = (personal, personalDisponible = []) => {
  if (!personal || !personal.id) {
    return {
      status: "Client error",
      message: "El personal es obligatorio.",
      details: {}
    };
  }

  const esValido = personalDisponible.some(persona => persona.id === personal.id);
  
  if (!esValido) {
    return {
      status: "Client error",
      message: "El personal seleccionado no es válido.",
      details: {}
    };
  }

  return null;
};

export const useErrorHandlerControlHigiene = () => {
  const [createError, setCreateError] = useState(null);
  const [editError, setEditError] = useState(null);

  const handleCreateError = (data, personalDisponible = []) => {
    const errors = [];

    // Validar fecha
    const fechaError = validateFecha(data.fecha);
    if (fechaError) {
      errors.push({
        field: 'fecha',
        message: fechaError.message
      });
    }

    // Validar campos booleanos
    const booleanFields = [
      { field: 'usoCofia', name: 'El uso de cofia' },
      { field: 'usoMascarilla', name: 'El uso de mascarilla' },
      { field: 'higieneManos', name: 'La higiene de manos' },
      { field: 'unasCortas', name: 'El estado de uñas cortas' },
      { field: 'afeitado', name: 'El estado de afeitado' },
      { field: 'uniformeLimpio', name: 'El estado del uniforme limpio' },
      { field: 'sinAccesorios', name: 'El estado de sin accesorios' }
    ];

    booleanFields.forEach(({ field, name }) => {
      if (data[field] === undefined || data[field] === null) {
        errors.push({
          field: field,
          message: `${name} es obligatorio.`
        });
      } else {
        const booleanError = validateBooleanField(data[field], name);
        if (booleanError) {
          errors.push({
            field: field,
            message: booleanError.message
          });
        }
      }
    });

    // Validar observación
    const observacionError = validateObservacion(data.observacion);
    if (observacionError) {
      errors.push({
        field: 'observacion',
        message: observacionError.message
      });
    }

    // Validar VB de cumplimiento
    const vbError = validateVbCumplimiento(data.vbCumplimiento);
    if (vbError) {
      errors.push({
        field: 'vbCumplimiento',
        message: vbError.message
      });
    }

    // Validar número de acción correctiva
    const accionError = validateNroAccionCorrectiva(data.nroAccionCorrectiva, data.vbCumplimiento);
    if (accionError) {
      errors.push({
        field: 'nroAccionCorrectiva',
        message: accionError.message
      });
    }

    // Validar personal
    const personalError = validatePersonal(data.personal, personalDisponible);
    if (personalError) {
      errors.push({
        field: 'personal',
        message: personalError.message
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

  const handleEditError = (data, personalDisponible = []) => {
    const errors = [];

    // Validar fecha
    const fechaError = validateFecha(data.fecha);
    if (fechaError) {
      errors.push({
        field: 'fecha',
        message: fechaError.message
      });
    }

    // Validar campos booleanos
    const booleanFields = [
      { field: 'usoCofia', name: 'El uso de cofia' },
      { field: 'usoMascarilla', name: 'El uso de mascarilla' },
      { field: 'higieneManos', name: 'La higiene de manos' },
      { field: 'unasCortas', name: 'El estado de uñas cortas' },
      { field: 'afeitado', name: 'El estado de afeitado' },
      { field: 'uniformeLimpio', name: 'El estado del uniforme limpio' },
      { field: 'sinAccesorios', name: 'El estado de sin accesorios' }
    ];

    booleanFields.forEach(({ field, name }) => {
      if (data[field] === undefined || data[field] === null) {
        errors.push({
          field: field,
          message: `${name} es obligatorio.`
        });
      } else {
        const booleanError = validateBooleanField(data[field], name);
        if (booleanError) {
          errors.push({
            field: field,
            message: booleanError.message
          });
        }
      }
    });

    // Validar observación
    const observacionError = validateObservacion(data.observacion);
    if (observacionError) {
      errors.push({
        field: 'observacion',
        message: observacionError.message
      });
    }

    // Validar VB de cumplimiento
    const vbError = validateVbCumplimiento(data.vbCumplimiento);
    if (vbError) {
      errors.push({
        field: 'vbCumplimiento',
        message: vbError.message
      });
    }

    // Validar número de acción correctiva
    const accionError = validateNroAccionCorrectiva(data.nroAccionCorrectiva, data.vbCumplimiento);
    if (accionError) {
      errors.push({
        field: 'nroAccionCorrectiva',
        message: accionError.message
      });
    }

    // Validar personal
    const personalError = validatePersonal(data.personal, personalDisponible);
    if (personalError) {
      errors.push({
        field: 'personal',
        message: personalError.message
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
