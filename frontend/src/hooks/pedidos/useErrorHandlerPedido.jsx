import { useState } from "react";

// Función para validar el nombre del cliente
const validateClienteNombre = (clienteNombre) => {
  if (!clienteNombre || clienteNombre.trim() === "") {
    return {
      status: "Client error",
      message: "El nombre del cliente es obligatorio.",
      details: {}
    };
  }

  if (clienteNombre.length > 100) {
    return {
      status: "Client error",
      message: "El nombre del cliente no puede exceder los 100 caracteres.",
      details: {}
    };
  }

  // Validar que solo contenga letras, espacios y comience con una letra
  const namePattern = /^[a-zA-ZáéíóúüÁÉÍÓÚÜñÑ][a-zA-ZáéíóúüÁÉÍÓÚÜñÑ\s]*$/;
  if (!namePattern.test(clienteNombre)) {
    return {
      status: "Client error",
      message: "El nombre del cliente solo puede contener letras y espacios, y debe comenzar con una letra.",
      details: {}
    };
  }

  return null;
};

// Función para validar el teléfono del cliente
const validateTelefonoCliente = (telefono) => {
  if (!telefono || telefono.trim() === "") {
    return {
      status: "Client error",
      message: "El teléfono del cliente es obligatorio.",
      details: {}
    };
  }

  // Validar formato +56 seguido de 9 dígitos
  const phonePattern = /^\+56[0-9]{9}$/;
  if (!phonePattern.test(telefono)) {
    return {
      status: "Client error",
      message: "El teléfono debe tener el formato +56 seguido de 9 dígitos.",
      details: {}
    };
  }

  return null;
};

// Función para validar el nombre del carnicero
const validateCarniceroNombre = (carniceroNombre) => {
  if (!carniceroNombre || carniceroNombre.trim() === "") {
    return {
      status: "Client error",
      message: "El nombre del carnicero es obligatorio.",
      details: {}
    };
  }

  if (carniceroNombre.length > 100) {
    return {
      status: "Client error",
      message: "El nombre del carnicero no puede exceder los 100 caracteres.",
      details: {}
    };
  }

  // Validar que solo contenga letras, espacios y comience con una letra
  const namePattern = /^[a-zA-ZáéíóúüÁÉÍÓÚÜñÑ][a-zA-ZáéíóúüÁÉÍÓÚÜñÑ\s]*$/;
  if (!namePattern.test(carniceroNombre)) {
    return {
      status: "Client error",
      message: "El nombre del carnicero solo puede contener letras y espacios, y debe comenzar con una letra.",
      details: {}
    };
  }

  return null;
};

// Función para validar la fecha de entrega
const validateFechaEntrega = (fecha) => {
  if (!fecha) {
    return {
      status: "Client error",
      message: "La fecha de entrega es obligatoria.",
      details: {}
    };
  }

  // Crear fecha desde el input (formato YYYY-MM-DD) de manera local
  const [año, mes, dia] = fecha.split('-').map(Number);
  const fechaIngresada = new Date(año, mes - 1, dia); // mes - 1 porque Date usa 0-11 para meses
  
  if (isNaN(fechaIngresada.getTime())) {
    return {
      status: "Client error",
      message: "La fecha de entrega debe ser una fecha válida.",
      details: {}
    };
  }
  // Obtener la fecha actual (sin restar días)
  const fechaActual = new Date();
  const fechaMinima = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), fechaActual.getDate());

  if (fechaIngresada < fechaMinima) {
    return {
      status: "Client error",
      message: "La fecha de entrega debe ser igual o posterior a la fecha actual.",
      details: {}
    };
  }

  return null;
};

// Función para validar la descripción de productos
const validateProductos = (productos) => {
  if (!productos || productos.trim() === "") {
    return {
      status: "Client error",
      message: "La descripción de los productos es obligatoria.",
      details: {}
    };
  }

  if (productos.length > 500) {
    return {
      status: "Client error",
      message: "La descripción de los productos no puede exceder los 500 caracteres.",
      details: {}
    };
  }

  return null;
};

export const useErrorHandlerPedido = () => {
  const [createError, setCreateError] = useState(null);
  const [editError, setEditError] = useState(null);

  const handleCreateError = (data) => {
    const errors = [];

    // Validar nombre del cliente
    const clienteNombreError = validateClienteNombre(data.cliente_nombre);
    if (clienteNombreError) {
      errors.push({
        field: 'cliente_nombre',
        message: clienteNombreError.message
      });
    }

    // Validar teléfono del cliente
    const telefonoError = validateTelefonoCliente(data.telefono_cliente);
    if (telefonoError) {
      errors.push({
        field: 'telefono_cliente',
        message: telefonoError.message
      });
    }

    // Validar nombre del carnicero
    const carniceroNombreError = validateCarniceroNombre(data.carnicero_nombre);
    if (carniceroNombreError) {
      errors.push({
        field: 'carnicero_nombre',
        message: carniceroNombreError.message
      });
    }

    // Validar fecha de entrega
    const fechaEntregaError = validateFechaEntrega(data.fecha_entrega);
    if (fechaEntregaError) {
      errors.push({
        field: 'fecha_entrega',
        message: fechaEntregaError.message
      });
    }

    // Validar productos
    const productosError = validateProductos(data.productos);
    if (productosError) {
      errors.push({
        field: 'productos',
        message: productosError.message
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

  const handleEditError = (data) => {
    const errors = [];

    // Para edición, validar solo los campos que no están vacíos
    // Validar nombre del cliente (si se proporciona)
    if (data.cliente_nombre !== undefined && data.cliente_nombre !== "") {
      const clienteNombreError = validateClienteNombre(data.cliente_nombre);
      if (clienteNombreError) {
        errors.push({
          field: 'cliente_nombre',
          message: clienteNombreError.message
        });
      }
    }

    // Validar teléfono del cliente (si se proporciona)
    if (data.telefono_cliente !== undefined && data.telefono_cliente !== "") {
      const telefonoError = validateTelefonoCliente(data.telefono_cliente);
      if (telefonoError) {
        errors.push({
          field: 'telefono_cliente',
          message: telefonoError.message
        });
      }
    }

    // Validar nombre del carnicero (si se proporciona)
    if (data.carnicero_nombre !== undefined && data.carnicero_nombre !== "") {
      const carniceroNombreError = validateCarniceroNombre(data.carnicero_nombre);
      if (carniceroNombreError) {
        errors.push({
          field: 'carnicero_nombre',
          message: carniceroNombreError.message
        });
      }
    }

    // Validar fecha de entrega (si se proporciona)
    if (data.fecha_entrega !== undefined && data.fecha_entrega !== "") {
      const fechaEntregaError = validateFechaEntrega(data.fecha_entrega);
      if (fechaEntregaError) {
        errors.push({
          field: 'fecha_entrega',
          message: fechaEntregaError.message
        });
      }
    }

    // Validar productos (si se proporciona)
    if (data.productos !== undefined && data.productos !== "") {
      const productosError = validateProductos(data.productos);
      if (productosError) {
        errors.push({
          field: 'productos',
          message: productosError.message
        });
      }
    }

    if (errors.length > 0) {
      setEditError({
        status: "Client error",
        errors: errors,
        details: {}
      });
      return true;
    }    setEditError(null);
    return false;
  };

  return {
    createError,
    editError,
    handleCreateError,
    handleEditError
  };
};
