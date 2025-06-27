import { useState } from "react";

// Función para calcular el dígito verificador de un RUT
const calcularDV = (rutNumero) => {
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
};

// Función para validar el tipo de cliente
const validateTipoCliente = (tipoCliente) => {
  if (!tipoCliente) {
    return {
      status: "Client error",
      message: "El tipo de cliente es obligatorio.",
      details: {}
    };
  }

  if (tipoCliente !== "Empresa" && tipoCliente !== "Persona") {
    return {
      status: "Client error",
      message: "El tipo de cliente debe ser 'Empresa' o 'Persona'.",
      details: {}
    };
  }

  return null;
};

// Función para validar el RUT
const validateRUT = (rut, tipoCliente, clientesExistentes = [], currentId = null) => {
  if (!rut) {
    return {
      status: "Client error",
      message: "El RUT es obligatorio.",
      details: {}
    };
  }

  // Validar duplicados en el frontend
  const rutTrimmed = rut.trim();
  const existeRUT = clientesExistentes.some(cliente => 
    cliente.rut.trim() === rutTrimmed && 
    cliente.id !== currentId
  );

  if (existeRUT) {
    return {
      field: 'rut',
      status: "Client error",
      message: "Ya existe un cliente con este RUT.",
      details: {}
    };
  }

  // Validar formato del RUT
  const rutPattern = /^(\d{1,2}(?:\.\d{3}){2}|\d{7,8})-[0-9kK]$/;
  if (!rutPattern.test(rut)) {
    return {
      status: "Client error",
      message: "El RUT debe tener el formato correcto (ej: 12.345.678-9 o 12345678-9).",
      details: {}
    };
  }

  // Remover los puntos para validación
  const rutLimpio = rut.replace(/\./g, '');
  const [numero, dv] = rutLimpio.split('-');
  
  // Validar que el número sea positivo
  if (parseInt(numero) <= 0) {
    return {
      status: "Client error",
      message: "El número de RUT debe ser positivo.",
      details: {}
    };
  }

  // Validar el rango según tipo de cliente
  const rutNumero = parseInt(numero);
  if (tipoCliente === 'Empresa') {
    if (rutNumero < 60000000) {
      if (rutNumero <= 30000000) {
        return {
          status: "Client error",
          message: "Este RUT corresponde a una persona natural (menor a 30 millones). Para empresas el RUT debe ser mayor a 60 millones.",
          details: {}
        };
      }
      return {
        status: "Client error",
        message: "El RUT debe ser mayor o igual a 60.000.000 para empresas. Los RUTs menores corresponden a personas naturales.",
        details: {}
      };
    }
    if (rutNumero > 90999999) {
      return {
        status: "Client error",
        message: "El RUT de empresa debe ser menor o igual a 90.999.999.",
        details: {}
      };
    }
  } else {
    if (rutNumero < 1000000) {
      return {
        status: "Client error",
        message: "Para personas naturales, el RUT debe ser mayor o igual a 1.000.000.",
        details: {}
      };
    }
    if (rutNumero > 30000000) {
      if (rutNumero >= 60000000) {
        return {
          status: "Client error",
          message: "Este RUT corresponde a una empresa (mayor a 60 millones). Para personas naturales el RUT debe ser menor a 30 millones.",
          details: {}
        };
      }
      return {
        status: "Client error",
        message: "Para personas naturales, el RUT debe ser menor o igual a 46.999.999.",
        details: {}
      };
    }
  }

  // Validar que el dígito verificador sea correcto
  const dvEnviado = dv.toLowerCase();
  const dvCalculado = calcularDV(rutNumero);

  if (dvCalculado !== dvEnviado) {
    return {
      status: "Client error",
      message: "El dígito verificador del RUT no es válido.",
      details: {}
    };
  }

  return null;
};

// Función para validar nombres
const validateNombres = (nombres, tipoCliente) => {
  if (tipoCliente === 'Persona') {
    if (!nombres) {
      return {
        status: "Client error",
        message: "Los nombres son obligatorios para personas.",
        details: {}
      };
    }

    if (nombres.length > 100) {
      return {
        status: "Client error",
        message: "Los nombres no pueden exceder los 100 caracteres.",
        details: {}
      };
    }

    const nombresPattern = /^[a-zA-ZáéíóúüÁÉÍÓÚÜñÑ\s]*$/;
    if (!nombresPattern.test(nombres)) {
      return {
        status: "Client error",
        message: "Los nombres solo pueden contener letras y espacios.",
        details: {}
      };
    }
  }

  return null;
};

// Función para validar apellidos
const validateApellidos = (apellidos, tipoCliente) => {
  if (tipoCliente === 'Persona') {
    if (!apellidos) {
      return {
        status: "Client error",
        message: "Los apellidos son obligatorios para personas.",
        details: {}
      };
    }

    if (apellidos.length > 100) {
      return {
        status: "Client error",
        message: "Los apellidos no pueden exceder los 100 caracteres.",
        details: {}
      };
    }

    const apellidosPattern = /^[a-zA-ZáéíóúüÁÉÍÓÚÜñÑ\s]*$/;
    if (!apellidosPattern.test(apellidos)) {
      return {
        status: "Client error",
        message: "Los apellidos solo pueden contener letras y espacios.",
        details: {}
      };
    }
  }

  return null;
};

// Función para validar razón social
const validateRazonSocial = (razonSocial, tipoCliente) => {
  if (tipoCliente === 'Empresa') {
    if (!razonSocial) {
      return {
        status: "Client error",
        message: "La razón social es obligatoria para empresas.",
        details: {}
      };
    }

    if (razonSocial.length > 100) {
      return {
        status: "Client error",
        message: "La razón social no puede exceder los 100 caracteres.",
        details: {}
      };
    }
  }

  return null;
};

// Función para validar giro
const validateGiro = (giro, tipoCliente) => {
  if (tipoCliente === 'Empresa') {
    if (!giro) {
      return {
        status: "Client error",
        message: "El giro es obligatorio para empresas.",
        details: {}
      };
    }

    if (giro.length > 100) {
      return {
        status: "Client error",
        message: "El giro no puede exceder los 100 caracteres.",
        details: {}
      };
    }
  }

  return null;
};

// Función para validar email
const validateEmail = (email) => {
  if (!email) {
    return {
      status: "Client error",
      message: "El email es obligatorio.",
      details: {}
    };
  }

  if (email.length > 100) {
    return {
      status: "Client error",
      message: "El email no puede exceder los 100 caracteres.",
      details: {}
    };
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return {
      status: "Client error",
      message: "El email debe tener un formato válido.",
      details: {}
    };
  }

  return null;
};

// Función para validar teléfono
const validateTelefono = (telefono) => {
  if (!telefono) {
    return {
      status: "Client error",
      message: "El teléfono es obligatorio.",
      details: {}
    };
  }

  const telefonoPattern = /^\+56[0-9]{9}$/;
  if (!telefonoPattern.test(telefono)) {
    return {
      status: "Client error",
      message: "El número telefónico debe tener el formato +56 seguido de 9 dígitos (ejemplo: +56912345678).",
      details: {}
    };
  }

  return null;
};

// Función para validar dirección
const validateDireccion = (direccion) => {
  if (!direccion) {
    return {
      status: "Client error",
      message: "La dirección es obligatoria.",
      details: {}
    };
  }

  if (direccion.length > 200) {
    return {
      status: "Client error",
      message: "La dirección no puede exceder los 200 caracteres.",
      details: {}
    };
  }

  const direccionPattern = /^[a-zA-Z0-9áéíóúüÁÉÍÓÚÜñÑ\s,.\-_#°/()&]*$/;
  if (!direccionPattern.test(direccion)) {
    return {
      status: "Client error",
      message: "La dirección solo puede contener letras, números, espacios y caracteres especiales (. , - _ # ° / ( ) &).",
      details: {}
    };
  }

  return null;
};

// Función para validar región
const validateRegion = (region) => {
  if (!region) {
    return {
      status: "Client error",
      message: "La región es obligatoria.",
      details: {}
    };
  }

  const regionesValidas = [
    "Arica y Parinacota",
    "Tarapacá",
    "Antofagasta",
    "Atacama",
    "Coquimbo",
    "Valparaíso",
    "Metropolitana de Santiago",
    "O'Higgins",
    "Maule",
    "Ñuble",
    "Biobío",
    "Araucanía",
    "Los Ríos",
    "Los Lagos",
    "Aysén",
    "Magallanes y la Antártica Chilena"
  ];

  if (!regionesValidas.includes(region)) {
    return {
      status: "Client error",
      message: "Debe seleccionar una región válida de Chile.",
      details: {}
    };
  }

  return null;
};

// Función para validar comuna
const validateComuna = (comuna) => {
  if (!comuna) {
    return {
      status: "Client error",
      message: "La comuna es obligatoria.",
      details: {}
    };
  }

  if (comuna.length > 100) {
    return {
      status: "Client error",
      message: "La comuna no puede exceder los 100 caracteres.",
      details: {}
    };
  }

  const comunaPattern = /^[a-zA-ZáéíóúüÁÉÍÓÚÜñÑ\s]*$/;
  if (!comunaPattern.test(comuna)) {
    return {
      status: "Client error",
      message: "La comuna solo puede contener letras y espacios.",
      details: {}
    };
  }

  return null;
};

// Función para validar ciudad
const validateCiudad = (ciudad) => {
  if (!ciudad) {
    return {
      status: "Client error",
      message: "La ciudad es obligatoria.",
      details: {}
    };
  }

  if (ciudad.length > 100) {
    return {
      status: "Client error",
      message: "La ciudad no puede exceder los 100 caracteres.",
      details: {}
    };
  }

  const ciudadPattern = /^[a-zA-ZáéíóúüÁÉÍÓÚÜñÑ\s]*$/;
  if (!ciudadPattern.test(ciudad)) {
    return {
      status: "Client error",
      message: "La ciudad solo puede contener letras y espacios.",
      details: {}
    };
  }

  return null;
};

export const useErrorHandlerCliente = () => {
  const [createError, setCreateError] = useState(null);
  const [editError, setEditError] = useState(null);
  const handleCreateError = (data, clientesExistentes = []) => {
    const errors = [];

    // Validar tipo de cliente
    const tipoClienteError = validateTipoCliente(data.tipoCliente);
    if (tipoClienteError) {
      errors.push({
        field: 'tipoCliente',
        message: tipoClienteError.message
      });
    }

    // Validar RUT incluyendo verificación de duplicados
    const rutError = validateRUT(data.rut, data.tipoCliente, clientesExistentes);
    if (rutError) {
      errors.push({
        field: 'rut',
        message: rutError.message
      });
    }

    // Validar campos específicos según tipo de cliente
    if (data.tipoCliente === 'Persona') {
      const nombresError = validateNombres(data.nombres, data.tipoCliente);
      if (nombresError) {
        errors.push({
          field: 'nombres',
          message: nombresError.message
        });
      }

      const apellidosError = validateApellidos(data.apellidos, data.tipoCliente);
      if (apellidosError) {
        errors.push({
          field: 'apellidos',
          message: apellidosError.message
        });
      }
    } else if (data.tipoCliente === 'Empresa') {
      const razonSocialError = validateRazonSocial(data.razonSocial, data.tipoCliente);
      if (razonSocialError) {
        errors.push({
          field: 'razonSocial',
          message: razonSocialError.message
        });
      }

      const giroError = validateGiro(data.giro, data.tipoCliente);
      if (giroError) {
        errors.push({
          field: 'giro',
          message: giroError.message
        });
      }
    }

    // Validar email
    const emailError = validateEmail(data.email);
    if (emailError) {
      errors.push({
        field: 'email',
        message: emailError.message
      });
    }

    // Validar teléfono
    const telefonoError = validateTelefono(data.telefono);
    if (telefonoError) {
      errors.push({
        field: 'telefono',
        message: telefonoError.message
      });
    }

    // Validar dirección
    const direccionError = validateDireccion(data.direccion);
    if (direccionError) {
      errors.push({
        field: 'direccion',
        message: direccionError.message
      });
    }

    // Validar región
    const regionError = validateRegion(data.region);
    if (regionError) {
      errors.push({
        field: 'region',
        message: regionError.message
      });
    }

    // Validar comuna
    const comunaError = validateComuna(data.comuna);
    if (comunaError) {
      errors.push({
        field: 'comuna',
        message: comunaError.message
      });
    }

    // Validar ciudad
    const ciudadError = validateCiudad(data.ciudad);
    if (ciudadError) {
      errors.push({
        field: 'ciudad',
        message: ciudadError.message
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
  const handleEditError = (data, clientesExistentes = [], currentId = null) => {
    const errors = [];

    // Validar tipo de cliente
    const tipoClienteError = validateTipoCliente(data.tipoCliente);
    if (tipoClienteError) {
      errors.push({
        field: 'tipoCliente',
        message: tipoClienteError.message
      });
    }

    // Validar RUT incluyendo verificación de duplicados
    const rutError = validateRUT(data.rut, data.tipoCliente, clientesExistentes, currentId);
    if (rutError) {
      errors.push({
        field: 'rut',
        message: rutError.message
      });
    }

    // Validar campos específicos según tipo de cliente
    if (data.tipoCliente === 'Persona') {
      const nombresError = validateNombres(data.nombres, data.tipoCliente);
      if (nombresError) {
        errors.push({
          field: 'nombres',
          message: nombresError.message
        });
      }

      const apellidosError = validateApellidos(data.apellidos, data.tipoCliente);
      if (apellidosError) {
        errors.push({
          field: 'apellidos',
          message: apellidosError.message
        });
      }
    } else if (data.tipoCliente === 'Empresa') {
      const razonSocialError = validateRazonSocial(data.razonSocial, data.tipoCliente);
      if (razonSocialError) {
        errors.push({
          field: 'razonSocial',
          message: razonSocialError.message
        });
      }

      const giroError = validateGiro(data.giro, data.tipoCliente);
      if (giroError) {
        errors.push({
          field: 'giro',
          message: giroError.message
        });
      }
    }

    // Validar email
    const emailError = validateEmail(data.email);
    if (emailError) {
      errors.push({
        field: 'email',
        message: emailError.message
      });
    }

    // Validar teléfono
    const telefonoError = validateTelefono(data.telefono);
    if (telefonoError) {
      errors.push({
        field: 'telefono',
        message: telefonoError.message
      });
    }

    // Validar dirección
    const direccionError = validateDireccion(data.direccion);
    if (direccionError) {
      errors.push({
        field: 'direccion',
        message: direccionError.message
      });
    }

    // Validar región
    const regionError = validateRegion(data.region);
    if (regionError) {
      errors.push({
        field: 'region',
        message: regionError.message
      });
    }

    // Validar comuna
    const comunaError = validateComuna(data.comuna);
    if (comunaError) {
      errors.push({
        field: 'comuna',
        message: comunaError.message
      });
    }

    // Validar ciudad
    const ciudadError = validateCiudad(data.ciudad);
    if (ciudadError) {
      errors.push({
        field: 'ciudad',
        message: ciudadError.message
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
