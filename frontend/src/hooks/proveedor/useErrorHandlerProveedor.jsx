import { useState } from "react";

// Función para calcular el dígito verificador de un RUT
function calcularDV(rutNumero) {
  let suma = 0;
  let multiplicador = 2;
  
  // Convertir a string y recorrer de derecha a izquierda
  let numeroStr = rutNumero.toString();
  for (let i = numeroStr.length - 1; i >= 0; i--) {
    suma += parseInt(numeroStr[i]) * multiplicador;
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
  }
  
  const resto = suma % 11;
  const dv = 11 - resto;
  
  if (dv === 11) return '0';
  if (dv === 10) return 'k';
  return dv.toString();
}

// Función para validar RUT
const validateRut = (rut) => {
  if (!rut) {
    return {
      status: "Client error",
      message: "El RUT es obligatorio.",
      details: {}
    };
  }

  // Validar formato
  const rutPattern = /^[0-9]{1,2}\.?[0-9]{3}\.?[0-9]{3}-[0-9kK]$/;
  if (!rutPattern.test(rut)) {
    return {
      status: "Client error",
      message: "El RUT debe tener el formato correcto (ej: 12.345.678-9 o 12345678-9).",
      details: {}
    };
  }

  // Limpiar el RUT de puntos
  const rutLimpio = rut.replace(/\./g, '');
  
  // Separar número y dígito verificador
  const [numero, dv] = rutLimpio.split('-');
  
  // Validar dígito verificador
  const dvCalculado = calcularDV(numero);
  const dvIngresado = dv.toLowerCase();
  
  if (dvCalculado !== dvIngresado) {
    return {
      status: "Client error",
      message: "El RUT ingresado no es válido (dígito verificador incorrecto).",
      details: {}
    };
  }

  return null;
};

// Función para validar nombre
const validateNombre = (nombre) => {
  if (!nombre || nombre.trim() === "") {
    return {
      status: "Client error",
      message: "El nombre es obligatorio.",
      details: {}
    };
  }
  if (nombre.length > 100) {
    return {
      status: "Client error",
      message: "El nombre no puede tener más de 100 caracteres.",
      details: {}
    };
  }

  return null;
};

// Función para validar dirección
const validateDireccion = (direccion) => {
  if (!direccion || direccion.trim() === "") {
    return {
      status: "Client error",
      message: "La dirección es obligatoria.",
      details: {}
    };
  }

  if (direccion.length > 200) {
    return {
      status: "Client error",
      message: "La dirección no puede tener más de 200 caracteres.",
      details: {}
    };
  }

  return null;
};

// Función para validar banco
const validateBanco = (banco) => {
  const bancosValidos = [
    "Banco de Chile",
    "Banco Santander",
    "Banco BCI",
    "Banco Itaú",
    "Scotiabank",
    "Banco Estado",
    "Banco BICE",
    "Banco Security",
    "Banco Falabella",
    "Banco Ripley",
    "Banco Consorcio",
    "Banco Internacional",
    "Banco BTG Pactual",
    "HSBC Bank",
    "Deutsche Bank"
  ];

  if (!banco) {
    return {
      status: "Client error",
      message: "El banco es obligatorio.",
      details: {}
    };
  }

  if (!bancosValidos.includes(banco)) {
    return {
      status: "Client error",
      message: "El banco seleccionado no es válido.",
      details: {}
    };
  }

  return null;
};

// Función para validar número de cuenta
const validateNumeroCuenta = (numeroCuenta) => {
  if (!numeroCuenta || numeroCuenta.trim() === "") {
    return {
      status: "Client error",
      message: "El número de cuenta es obligatorio.",
      details: {}
    };
  }

  if (numeroCuenta.length > 50) {
    return {
      status: "Client error",
      message: "El número de cuenta no puede tener más de 50 caracteres.",
      details: {}
    };
  }

  const numeroPattern = /^\d+$/;
  if (!numeroPattern.test(numeroCuenta)) {
    return {
      status: "Client error",
      message: "El número de cuenta debe contener solo números, sin letras ni símbolos.",
      details: {}
    };
  }

  return null;
};

// Función para validar tipo de cuenta
const validateTipoCuenta = (tipoCuenta) => {
  const tiposValidos = ['Cuenta corriente', 'Cuenta vista', 'Cuenta de ahorro'];

  if (!tipoCuenta) {
    return {
      status: "Client error",
      message: "El tipo de cuenta es obligatorio.",
      details: {}
    };
  }

  if (!tiposValidos.includes(tipoCuenta)) {
    return {
      status: "Client error",
      message: "El tipo de cuenta debe ser 'Cuenta corriente', 'Cuenta vista' o 'Cuenta de ahorro'.",
      details: {}
    };
  }

  return null;
};

// Función para validar nombre del encargado
const validateNombreEncargado = (nombreEncargado) => {
  if (!nombreEncargado || nombreEncargado.trim() === "") {
    return {
      status: "Client error",
      message: "El nombre del encargado es obligatorio.",
      details: {}
    };
  }

  if (nombreEncargado.length > 100) {
    return {
      status: "Client error",
      message: "El nombre del encargado no puede tener más de 100 caracteres.",
      details: {}
    };
  }

  const nombrePattern = /^[A-Za-záéíóúÁÉÍÓÚñÑ\s]+$/;
  if (!nombrePattern.test(nombreEncargado)) {
    return {
      status: "Client error",
      message: "El nombre del encargado solo puede contener letras y espacios.",
      details: {}
    };
  }

  return null;
};

// Función para validar móviles del encargado
const validateMovilEncargado = (movilEncargado) => {
  if (!movilEncargado || (Array.isArray(movilEncargado) && movilEncargado.length === 0)) {
    return {
      status: "Client error",
      message: "Debe ingresar al menos un número móvil.",
      details: {}
    };
  }

  const moviles = Array.isArray(movilEncargado) ? movilEncargado : [movilEncargado];
  
  if (moviles.length > 2) {
    return {
      status: "Client error",
      message: "Solo puede ingresar hasta 2 números móviles.",
      details: {}
    };
  }

  const movilPattern = /^\+56[0-9]{9}$/;
  
  for (let i = 0; i < moviles.length; i++) {
    const movil = moviles[i];
    if (!movil || movil.trim() === "") {
      return {
        status: "Client error",
        message: "Los números móviles no pueden estar vacíos.",
        details: {}
      };
    }

    if (!movilPattern.test(movil)) {
      return {
        status: "Client error",
        message: "Los números móviles deben tener el formato +56 seguido de 9 dígitos.",
        details: {}
      };
    }
  }

  return null;
};

// Función para validar RUT duplicado
const validateRutDuplicado = (rut, proveedoresExistentes = [], currentId = null) => {
  if (!rut) return null;

  const rutExistente = proveedoresExistentes.find(proveedor => 
    proveedor.rut === rut && proveedor.id !== currentId
  );

  if (rutExistente) {
    return {
      status: "Client error",
      message: `Ya existe un proveedor con el RUT ${rut}.`,
      details: {}
    };
  }

  return null;
};

// Función para validar nombre duplicado
const validateNombreDuplicado = (nombre, proveedoresExistentes = [], currentId = null) => {
  if (!nombre) return null;

  const nombreExistente = proveedoresExistentes.find(proveedor => 
    proveedor.nombre.toLowerCase() === nombre.toLowerCase() && proveedor.id !== currentId
  );

  if (nombreExistente) {
    return {
      status: "Client error",
      message: "Ya existe un proveedor con este nombre.",
      details: {}
    };
  }

  return null;
};

export const useErrorHandlerProveedor = () => {
  const [createError, setCreateError] = useState(null);
  const [editError, setEditError] = useState(null);

  const handleCreateError = (data, proveedoresExistentes = []) => {
    const errors = [];

    // Validar RUT
    const rutError = validateRut(data.rut);
    if (rutError) {
      errors.push({
        field: 'rut',
        message: rutError.message
      });
    } else {
      // Validar RUT duplicado solo si el formato es válido
      const rutDuplicadoError = validateRutDuplicado(data.rut, proveedoresExistentes);
      if (rutDuplicadoError) {
        errors.push({
          field: 'rut',
          message: rutDuplicadoError.message
        });
      }
    }

    // Validar nombre
    const nombreError = validateNombre(data.nombre);
    if (nombreError) {
      errors.push({
        field: 'nombre',
        message: nombreError.message
      });
    } else {
      // Validar nombre duplicado solo si el formato es válido
      const nombreDuplicadoError = validateNombreDuplicado(data.nombre, proveedoresExistentes);
      if (nombreDuplicadoError) {
        errors.push({
          field: 'nombre',
          message: nombreDuplicadoError.message
        });
      }
    }

    // Validar dirección
    const direccionError = validateDireccion(data.direccion);
    if (direccionError) {
      errors.push({
        field: 'direccion',
        message: direccionError.message
      });
    }

    // Validar banco
    const bancoError = validateBanco(data.banco);
    if (bancoError) {
      errors.push({
        field: 'banco',
        message: bancoError.message
      });
    }

    // Validar número de cuenta
    const numeroCuentaError = validateNumeroCuenta(data.numeroCuenta);
    if (numeroCuentaError) {
      errors.push({
        field: 'numeroCuenta',
        message: numeroCuentaError.message
      });
    }

    // Validar tipo de cuenta
    const tipoCuentaError = validateTipoCuenta(data.tipoCuenta);
    if (tipoCuentaError) {
      errors.push({
        field: 'tipoCuenta',
        message: tipoCuentaError.message
      });
    }

    // Validar nombre del encargado
    const nombreEncargadoError = validateNombreEncargado(data.nombreEncargado);
    if (nombreEncargadoError) {
      errors.push({
        field: 'nombreEncargado',
        message: nombreEncargadoError.message
      });
    }

    // Validar móvil del encargado
    const movilEncargadoError = validateMovilEncargado(data.movilEncargado);
    if (movilEncargadoError) {
      errors.push({
        field: 'movilEncargado',
        message: movilEncargadoError.message
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

  const handleEditError = (data, proveedoresExistentes = [], currentId = null) => {
    const errors = [];

    // Validar RUT
    const rutError = validateRut(data.rut);
    if (rutError) {
      errors.push({
        field: 'rut',
        message: rutError.message
      });
    } else {
      // Validar RUT duplicado solo si el formato es válido
      const rutDuplicadoError = validateRutDuplicado(data.rut, proveedoresExistentes, currentId);
      if (rutDuplicadoError) {
        errors.push({
          field: 'rut',
          message: rutDuplicadoError.message
        });
      }
    }

    // Validar nombre
    const nombreError = validateNombre(data.nombre);
    if (nombreError) {
      errors.push({
        field: 'nombre',
        message: nombreError.message
      });
    } else {
      // Validar nombre duplicado solo si el formato es válido
      const nombreDuplicadoError = validateNombreDuplicado(data.nombre, proveedoresExistentes, currentId);
      if (nombreDuplicadoError) {
        errors.push({
          field: 'nombre',
          message: nombreDuplicadoError.message
        });
      }
    }

    // Validar dirección
    const direccionError = validateDireccion(data.direccion);
    if (direccionError) {
      errors.push({
        field: 'direccion',
        message: direccionError.message
      });
    }

    // Validar banco
    const bancoError = validateBanco(data.banco);
    if (bancoError) {
      errors.push({
        field: 'banco',
        message: bancoError.message
      });
    }

    // Validar número de cuenta
    const numeroCuentaError = validateNumeroCuenta(data.numeroCuenta);
    if (numeroCuentaError) {
      errors.push({
        field: 'numeroCuenta',
        message: numeroCuentaError.message
      });
    }

    // Validar tipo de cuenta
    const tipoCuentaError = validateTipoCuenta(data.tipoCuenta);
    if (tipoCuentaError) {
      errors.push({
        field: 'tipoCuenta',
        message: tipoCuentaError.message
      });
    }

    // Validar nombre del encargado
    const nombreEncargadoError = validateNombreEncargado(data.nombreEncargado);
    if (nombreEncargadoError) {
      errors.push({
        field: 'nombreEncargado',
        message: nombreEncargadoError.message
      });
    }

    // Validar móvil del encargado
    const movilEncargadoError = validateMovilEncargado(data.movilEncargado);
    if (movilEncargadoError) {
      errors.push({
        field: 'movilEncargado',
        message: movilEncargadoError.message
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
