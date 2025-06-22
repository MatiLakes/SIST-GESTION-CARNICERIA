import { useState } from "react";

// Función para validar el monto
const validateMonto = (monto) => {
  if (!monto || monto.toString().trim() === "") {
    return {
      status: "Client error",
      message: "El monto es obligatorio.",
      details: {}
    };
  }

  const montoNum = parseFloat(monto);

  if (isNaN(montoNum)) {
    return {
      status: "Client error",
      message: "El monto debe ser un número válido.",
      details: {}
    };
  }

  if (montoNum < 1) {
    return {
      status: "Client error",
      message: "El monto debe ser mayor a 0.",
      details: {}
    };
  }
  if (montoNum > 99999999) {
    return {
      status: "Client error",
      message: "El monto no puede tener más de 8 cifras.",
      details: {}
    };
  }

  return null;
};

// Función para validar la fecha del pedido
const validateFechaPedido = (fecha) => {
  if (!fecha) {
    return {
      status: "Client error",
      message: "La fecha del pedido es obligatoria.",
      details: {}
    };
  }

  // Crear fecha desde el input (formato YYYY-MM-DD) de manera local
  const [año, mes, dia] = fecha.split('-').map(Number);
  const fechaIngresada = new Date(año, mes - 1, dia); // mes - 1 porque Date usa 0-11 para meses
  
  if (isNaN(fechaIngresada.getTime())) {
    return {
      status: "Client error",
      message: "La fecha del pedido debe ser una fecha válida.",
      details: {}
    };
  }

  // Obtener la fecha actual
  const fechaActual = new Date();
  const fechaHoy = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), fechaActual.getDate());

  if (fechaIngresada.getTime() !== fechaHoy.getTime()) {
    return {
      status: "Client error",
      message: "La fecha del pedido debe ser la fecha actual.",
      details: {}
    };
  }

  return null;
};

// Función para validar la fecha límite
const validateFechaLimite = (fechaLimite, fechaPedido) => {
  if (!fechaLimite) {
    return {
      status: "Client error",
      message: "La fecha límite es obligatoria.",
      details: {}
    };
  }

  // Crear fecha límite desde el input
  const [añoLimite, mesLimite, diaLimite] = fechaLimite.split('-').map(Number);
  const fechaLimiteIngresada = new Date(añoLimite, mesLimite - 1, diaLimite);
  
  if (isNaN(fechaLimiteIngresada.getTime())) {
    return {
      status: "Client error",
      message: "La fecha límite debe ser una fecha válida.",
      details: {}
    };
  }

  // Validar que la fecha límite sea igual o posterior a la fecha del pedido
  if (fechaPedido) {
    const [añoPedido, mesPedido, diaPedido] = fechaPedido.split('-').map(Number);
    const fechaPedidoIngresada = new Date(añoPedido, mesPedido - 1, diaPedido);
    
    if (fechaLimiteIngresada < fechaPedidoIngresada) {
      return {
        status: "Client error",
        message: "La fecha límite debe ser igual o posterior a la fecha del pedido.",
        details: {}
      };
    }
  }

  return null;
};

// Función para validar el estado
const validateEstado = (estado) => {
  if (!estado || estado.trim() === "") {
    return {
      status: "Client error",
      message: "El estado es obligatorio.",
      details: {}
    };
  }

  const estadosValidos = ["Pendiente", "Pagado", "Vencido"];
  if (!estadosValidos.includes(estado)) {
    return {
      status: "Client error",
      message: "El estado debe ser 'Pendiente', 'Pagado' o 'Vencido'.",
      details: {}
    };
  }

  return null;
};

// Función para validar la factura (opcional)
const validateFactura = (factura) => {
  if (!factura || factura.trim() === "") {
    return null; // La factura es opcional
  }

  if (factura.length > 255) {
    return {
      status: "Client error",
      message: "La ruta de la factura no puede exceder los 255 caracteres.",
      details: {}
    };
  }

  // Validar extensión del archivo
  const extensionPattern = /\.(pdf|jpg|jpeg)$/i;
  if (!extensionPattern.test(factura)) {
    return {
      status: "Client error",
      message: "La factura debe ser un archivo PDF o JPG.",
      details: {}
    };
  }

  return null;
};

// Función para validar el cliente ID
const validateClienteId = (clienteId) => {
  if (!clienteId) {
    return {
      status: "Client error",
      message: "El ID del cliente es obligatorio.",
      details: {}
    };
  }

  const clienteIdNum = parseInt(clienteId);

  if (isNaN(clienteIdNum)) {
    return {
      status: "Client error",
      message: "El ID del cliente debe ser un número.",
      details: {}
    };
  }

  if (!Number.isInteger(clienteIdNum)) {
    return {
      status: "Client error",
      message: "El ID del cliente debe ser un número entero.",
      details: {}
    };
  }

  if (clienteIdNum < 1) {
    return {
      status: "Client error",
      message: "El ID del cliente debe ser mayor a 0.",
      details: {}
    };
  }

  return null;
};

export const useErrorHandlerPagoPendiente = () => {
  const [createError, setCreateError] = useState(null);
  const [editError, setEditError] = useState(null);

  const handleCreateError = (data) => {
    const errors = [];

    // Validar monto
    const montoError = validateMonto(data.monto);
    if (montoError) {
      errors.push({
        field: 'monto',
        message: montoError.message
      });
    }

    // Validar fecha del pedido
    const fechaPedidoError = validateFechaPedido(data.fechaPedido);
    if (fechaPedidoError) {
      errors.push({
        field: 'fechaPedido',
        message: fechaPedidoError.message
      });
    }

    // Validar fecha límite
    const fechaLimiteError = validateFechaLimite(data.fechaLimite, data.fechaPedido);
    if (fechaLimiteError) {
      errors.push({
        field: 'fechaLimite',
        message: fechaLimiteError.message
      });
    }

    // Validar estado
    const estadoError = validateEstado(data.estado);
    if (estadoError) {
      errors.push({
        field: 'estado',
        message: estadoError.message
      });
    }

    // Validar factura (opcional)
    const facturaError = validateFactura(data.factura);
    if (facturaError) {
      errors.push({
        field: 'factura',
        message: facturaError.message
      });
    }

    // Validar cliente ID
    const clienteIdError = validateClienteId(data.cliente?.id || data.clienteId);
    if (clienteIdError) {
      errors.push({
        field: 'clienteId',
        message: clienteIdError.message
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
    // Validar monto (si se proporciona)
    if (data.monto !== undefined && data.monto !== "") {
      const montoError = validateMonto(data.monto);
      if (montoError) {
        errors.push({
          field: 'monto',
          message: montoError.message
        });
      }
    }

    // Validar fecha del pedido (si se proporciona)
    if (data.fechaPedido !== undefined && data.fechaPedido !== "") {
      const fechaPedidoError = validateFechaPedido(data.fechaPedido);
      if (fechaPedidoError) {
        errors.push({
          field: 'fechaPedido',
          message: fechaPedidoError.message
        });
      }
    }

    // Validar fecha límite (si se proporciona)
    if (data.fechaLimite !== undefined && data.fechaLimite !== "") {
      const fechaLimiteError = validateFechaLimite(data.fechaLimite, data.fechaPedido);
      if (fechaLimiteError) {
        errors.push({
          field: 'fechaLimite',
          message: fechaLimiteError.message
        });
      }
    }

    // Validar estado (si se proporciona)
    if (data.estado !== undefined && data.estado !== "") {
      const estadoError = validateEstado(data.estado);
      if (estadoError) {
        errors.push({
          field: 'estado',
          message: estadoError.message
        });
      }
    }

    // Validar factura (si se proporciona)
    if (data.factura !== undefined && data.factura !== "") {
      const facturaError = validateFactura(data.factura);
      if (facturaError) {
        errors.push({
          field: 'factura',
          message: facturaError.message
        });
      }
    }

    // Validar cliente ID (si se proporciona)
    if ((data.cliente?.id !== undefined && data.cliente?.id !== "") || 
        (data.clienteId !== undefined && data.clienteId !== "")) {
      const clienteIdError = validateClienteId(data.cliente?.id || data.clienteId);
      if (clienteIdError) {
        errors.push({
          field: 'clienteId',
          message: clienteIdError.message
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
