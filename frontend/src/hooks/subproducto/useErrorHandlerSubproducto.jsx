import { useState } from "react";

// Función para validar fechas
const validateFecha = (fecha, fieldName) => {
  if (!fecha) {
    return {
      status: "Client error",
      message: `${fieldName} es obligatoria.`,
      details: {}
    };
  }

  // Crear fecha desde el input (formato YYYY-MM-DD) de manera local
  const [año, mes, dia] = fecha.split('-').map(Number);
  const fechaIngresada = new Date(año, mes - 1, dia); // mes - 1 porque Date usa 0-11 para meses
  
  if (isNaN(fechaIngresada.getTime())) {
    return {
      status: "Client error",
      message: `${fieldName} debe ser una fecha válida.`,
      details: {}
    };
  }

  // Obtener la fecha actual solo con año, mes y día (sin hora)
  const fechaActual = new Date();
  const fechaHoy = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), fechaActual.getDate());

  if (fechaIngresada > fechaHoy) {
    return {
      status: "Client error",
      message: `${fieldName} no puede ser posterior a la fecha actual.`,
      details: {}
    };
  }

  return null;
};

// Función para validar número de animales faenados
const validateNumeroAnimalesFaenados = (numeroAnimales) => {
  if (!numeroAnimales && numeroAnimales !== 0) {
    return {
      status: "Client error",
      message: "El número de animales faenados es obligatorio.",
      details: {}
    };
  }

  const numero = parseInt(numeroAnimales);
  
  if (isNaN(numero)) {
    return {
      status: "Client error",
      message: "El número de animales faenados debe ser un número.",
      details: {}
    };
  }

  if (numero < 1) {
    return {
      status: "Client error",
      message: "Debe haber al menos un animal faenado.",
      details: {}
    };
  }

  if (numero > 100) {
    return {
      status: "Client error",
      message: "El número de animales faenados no puede ser mayor a 100.",
      details: {}
    };
  }

  return null;
};

// Función para validar cantidades (decomisados y entregados)
const validateCantidad = (cantidad, fieldName) => {
  if (cantidad === "" || cantidad === undefined || cantidad === null) {
    cantidad = 0; // Valor por defecto
  }

  const numero = parseInt(cantidad);
  
  if (isNaN(numero)) {
    return {
      status: "Client error",
      message: `${fieldName} debe ser un número.`,
      details: {}
    };
  }

  if (numero < 0) {
    return {
      status: "Client error",
      message: `${fieldName} no puede ser negativo.`,
      details: {}
    };
  }

  if (numero > 1000) {
    return {
      status: "Client error",
      message: `${fieldName} no puede ser mayor a 1000.`,
      details: {}
    };
  }

  return null;
};

// Función para validar precios
const validatePrecio = (precio, fieldName) => {
  if (precio === "" || precio === undefined || precio === null) {
    precio = 0; // Valor por defecto
  }

  const numero = parseFloat(precio);
  
  if (isNaN(numero)) {
    return {
      status: "Client error",
      message: `${fieldName} debe ser un número.`,
      details: {}
    };
  }

  if (numero < 0) {
    return {
      status: "Client error",
      message: `${fieldName} debe ser mayor o igual a 0.`,
      details: {}
    };
  }

  if (numero > 9999999) {
    return {
      status: "Client error",
      message: `${fieldName} no puede tener más de 7 cifras.`,
      details: {}
    };
  }

  return null;
};

export const useErrorHandlerSubproducto = () => {
  const [createError, setCreateError] = useState(null);
  const [editError, setEditError] = useState(null);

  const handleCreateError = (data) => {
    const errors = [];

    // Validar fecha de faena
    const fechaFaenaError = validateFecha(data.fechaFaena, "La fecha de faena");
    if (fechaFaenaError) {
      errors.push({
        field: 'fechaFaena',
        message: fechaFaenaError.message
      });
    }

    // Validar fecha de entrega
    const fechaEntregaError = validateFecha(data.fechaEntrega, "La fecha de entrega");
    if (fechaEntregaError) {
      errors.push({
        field: 'fechaEntrega',
        message: fechaEntregaError.message
      });
    }

    // Validar número de animales faenados
    const numeroAnimalesError = validateNumeroAnimalesFaenados(data.numeroAnimalesFaenados);
    if (numeroAnimalesError) {
      errors.push({
        field: 'numeroAnimalesFaenados',
        message: numeroAnimalesError.message
      });
    }

    // Validar cantidades y precios de cada subproducto
    const subproductos = [
      { base: 'guata', name: 'Guata' },
      { base: 'corazon', name: 'Corazón' },
      { base: 'cabezas', name: 'Cabezas' },
      { base: 'lenguas', name: 'Lenguas' },
      { base: 'chunchul', name: 'Chunchul' },
      { base: 'higado', name: 'Hígado' },
      { base: 'rinon', name: 'Riñón' },
      { base: 'patas', name: 'Patas' },
      { base: 'charcha', name: 'Charcha' }
    ];

    subproductos.forEach(({ base, name }) => {
      // Validar decomisados
      const decomisadosField = `${base}Decomisados`;
      const decomisadosError = validateCantidad(data[decomisadosField], `${name} decomisados`);
      if (decomisadosError) {
        errors.push({
          field: decomisadosField,
          message: decomisadosError.message
        });
      }

      // Validar entregados
      const entregadosField = `${base}Entregados`;
      const entregadosError = validateCantidad(data[entregadosField], `${name} entregados`);
      if (entregadosError) {
        errors.push({
          field: entregadosField,
          message: entregadosError.message
        });
      }

      // Validar precio
      const precioField = `precio${base.charAt(0).toUpperCase() + base.slice(1)}`;
      const precioError = validatePrecio(data[precioField], `Precio de ${name.toLowerCase()}`);
      if (precioError) {
        errors.push({
          field: precioField,
          message: precioError.message
        });
      }
    });

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

  const handleEditError = (data) => {
    const errors = [];

    // Validar fecha de faena
    const fechaFaenaError = validateFecha(data.fechaFaena, "La fecha de faena");
    if (fechaFaenaError) {
      errors.push({
        field: 'fechaFaena',
        message: fechaFaenaError.message
      });
    }

    // Validar fecha de entrega
    const fechaEntregaError = validateFecha(data.fechaEntrega, "La fecha de entrega");
    if (fechaEntregaError) {
      errors.push({
        field: 'fechaEntrega',
        message: fechaEntregaError.message
      });
    }

    // Validar número de animales faenados
    const numeroAnimalesError = validateNumeroAnimalesFaenados(data.numeroAnimalesFaenados);
    if (numeroAnimalesError) {
      errors.push({
        field: 'numeroAnimalesFaenados',
        message: numeroAnimalesError.message
      });
    }

    // Validar cantidades y precios de cada subproducto
    const subproductos = [
      { base: 'guata', name: 'Guata' },
      { base: 'corazon', name: 'Corazón' },
      { base: 'cabezas', name: 'Cabezas' },
      { base: 'lenguas', name: 'Lenguas' },
      { base: 'chunchul', name: 'Chunchul' },
      { base: 'higado', name: 'Hígado' },
      { base: 'rinon', name: 'Riñón' },
      { base: 'patas', name: 'Patas' },
      { base: 'charcha', name: 'Charcha' }
    ];

    subproductos.forEach(({ base, name }) => {
      // Validar decomisados
      const decomisadosField = `${base}Decomisados`;
      const decomisadosError = validateCantidad(data[decomisadosField], `${name} decomisados`);
      if (decomisadosError) {
        errors.push({
          field: decomisadosField,
          message: decomisadosError.message
        });
      }

      // Validar entregados
      const entregadosField = `${base}Entregados`;
      const entregadosError = validateCantidad(data[entregadosField], `${name} entregados`);
      if (entregadosError) {
        errors.push({
          field: entregadosField,
          message: entregadosError.message
        });
      }

      // Validar precio
      const precioField = `precio${base.charAt(0).toUpperCase() + base.slice(1)}`;
      const precioError = validatePrecio(data[precioField], `Precio de ${name.toLowerCase()}`);
      if (precioError) {
        errors.push({
          field: precioField,
          message: precioError.message
        });
      }
    });

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
