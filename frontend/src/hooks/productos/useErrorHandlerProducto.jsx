import { useState } from "react";

// Función para validar el nombre del producto
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

// Función para validar la variante del producto
const validateVariante = (variante) => {
  if (variante && variante.length > 100) {
    return {
      status: "Client error",
      message: "La variante no puede tener más de 100 caracteres.",
      details: {}
    };
  }
  return null;
};

// Función para validar el precio de venta
const validatePrecioVenta = (precio) => {
  if (precio === "" || precio === undefined || precio === null) {
    return {
      status: "Client error",
      message: "El precio de venta es obligatorio.",
      details: {}
    };
  }
  const precioNum = parseFloat(precio);
  if (isNaN(precioNum)) {
    return {
      status: "Client error",
      message: "El precio de venta debe ser un número.",
      details: {}
    };
  }
  if (precioNum < 1) {
    return {
      status: "Client error",
      message: "El precio de venta debe ser mayor a 0.",
      details: {}
    };
  }
  if (precioNum > 99999999) {
    return {
      status: "Client error",
      message: "El precio de venta no puede tener más de 8 cifras.",
      details: {}
    };
  }
  return null;
};

// Función para validar el tipo de producto
const validateTipoProducto = (tipoProducto, tiposDisponibles = []) => {
  if (!tipoProducto || !tipoProducto.id) {
    return {
      status: "Client error",
      message: "El tipo de producto es obligatorio.",
      details: {}
    };
  }
  const esValido = tiposDisponibles.some(tipo => tipo.id === tipoProducto.id);
  if (!esValido) {
    return {
      status: "Client error",
      message: "El tipo de producto seleccionado no es válido.",
      details: {}
    };
  }
  return null;
};

// Función para validar la marca del producto
const validateMarcaProducto = (marcaProducto, marcasDisponibles = []) => {
  if (!marcaProducto || !marcaProducto.id) {
    return {
      status: "Client error",
      message: "La marca del producto es obligatoria.",
      details: {}
    };
  }
  const esValida = marcasDisponibles.some(marca => marca.id === marcaProducto.id);
  if (!esValida) {
    return {
      status: "Client error",
      message: "La marca del producto seleccionada no es válida.",
      details: {}
    };
  }
  return null;
};

// Función para validar nombre de tipo de producto
const validateNombreTipo = (nombre, tiposExistentes = [], currentId = null) => {
  if (!nombre || nombre.trim() === "") {
    return {
      status: "Client error",
      message: "El nombre del tipo es obligatorio.",
      details: {}
    };
  }
  // Validar duplicados en el frontend
  const nombreTrimmed = nombre.trim();
  const existeNombre = tiposExistentes.some(item => 
    item.nombre.trim().toLowerCase() === nombreTrimmed.toLowerCase() && 
    item.id !== currentId
  );
  if (existeNombre) {
    return {
      field: 'nombre',
      status: "Client error",
      message: "El tipo de producto ya existe.",
      details: {}
    };
  }
  if (nombre.length > 100) {
    return {
      status: "Client error",
      message: "El nombre del tipo no puede tener más de 100 caracteres.",
      details: {}
    };
  }
  return null;
};

// Función para validar nombre de marca de producto
const validateNombreMarca = (nombre, marcasExistentes = [], currentId = null) => {
  if (!nombre || nombre.trim() === "") {
    return {
      status: "Client error",
      message: "El nombre de la marca es obligatorio.",
      details: {}
    };
  }
  // Validar duplicados en el frontend
  const nombreTrimmed = nombre.trim();
  const existeNombre = marcasExistentes.some(item => 
    item.nombre.trim().toLowerCase() === nombreTrimmed.toLowerCase() && 
    item.id !== currentId
  );
  if (existeNombre) {
    return {
      field: 'nombre',
      status: "Client error",
      message: "La marca ya existe.",
      details: {}
    };
  }
  if (nombre.length > 100) {
    return {
      status: "Client error",
      message: "El nombre de la marca no puede tener más de 100 caracteres.",
      details: {}
    };
  }
  return null;
};

export const useErrorHandlerProducto = () => {
  const [createError, setCreateError] = useState(null);
  const [editError, setEditError] = useState(null);
  const [createTipoError, setCreateTipoError] = useState(null);
  const [editTipoError, setEditTipoError] = useState(null);
  const [createMarcaError, setCreateMarcaError] = useState(null);
  const [editMarcaError, setEditMarcaError] = useState(null);

  const handleCreateError = (data, productosExistentes = [], tiposDisponibles = [], marcasDisponibles = []) => {
    const errors = [];
    // Validar nombre
    const nombreError = validateNombre(data.nombre);
    if (nombreError) {
      errors.push({ field: 'nombre', message: nombreError.message });
    }
    // Validar variante
    const varianteError = validateVariante(data.variante);
    if (varianteError) {
      errors.push({ field: 'variante', message: varianteError.message });
    }
    // Validar precio de venta
    const precioError = validatePrecioVenta(data.precioVenta);
    if (precioError) {
      errors.push({ field: 'precioVenta', message: precioError.message });
    }
    // Validar tipo de producto
    const tipoError = validateTipoProducto(data.tipo, tiposDisponibles);
    if (tipoError) {
      errors.push({ field: 'tipo', message: tipoError.message });
    }
    // Validar marca del producto
    const marcaError = validateMarcaProducto(data.marca, marcasDisponibles);
    if (marcaError) {
      errors.push({ field: 'marca', message: marcaError.message });
    }
    if (errors.length > 0) {
      setCreateError({ status: "Client error", errors, details: {} });
      return true;
    }
    setCreateError(null);
    return false;
  };

  const handleEditError = (data, productosExistentes = [], tiposDisponibles = [], marcasDisponibles = [], currentId = null) => {
    const errors = [];
    // Validar nombre
    const nombreError = validateNombre(data.nombre);
    if (nombreError) {
      errors.push({ field: 'nombre', message: nombreError.message });
    }
    // Validar variante
    const varianteError = validateVariante(data.variante);
    if (varianteError) {
      errors.push({ field: 'variante', message: varianteError.message });
    }
    // Validar precio de venta
    const precioError = validatePrecioVenta(data.precioVenta);
    if (precioError) {
      errors.push({ field: 'precioVenta', message: precioError.message });
    }
    // Validar tipo de producto
    const tipoError = validateTipoProducto(data.tipo, tiposDisponibles);
    if (tipoError) {
      errors.push({ field: 'tipo', message: tipoError.message });
    }
    // Validar marca del producto
    const marcaError = validateMarcaProducto(data.marca, marcasDisponibles);
    if (marcaError) {
      errors.push({ field: 'marca', message: marcaError.message });
    }
    if (errors.length > 0) {
      setEditError({ status: "Client error", errors, details: {} });
      return true;
    }
    setEditError(null);
    return false;
  };

  const handleCreateTipoError = (data, tiposExistentes = []) => {
    const errors = [];

    // Validar nombre de tipo incluyendo verificación de duplicados
    const nombreError = validateNombreTipo(data.nombre, tiposExistentes);
    if (nombreError) {
      errors.push({
        field: 'nombre',
        message: nombreError.message
      });
    }

    if (errors.length > 0) {
      setCreateTipoError({
        status: "Client error",
        errors: errors,
        details: {}
      });
      return true;
    }

    setCreateTipoError(null);
    return false;
  };

  const handleEditTipoError = (data, tiposExistentes = [], currentId = null) => {
    const errors = [];

    // Validar nombre de tipo incluyendo verificación de duplicados (excluyendo el tipo actual)
    const nombreError = validateNombreTipo(data.nombre, tiposExistentes, currentId);
    if (nombreError) {
      errors.push({
        field: 'nombre',
        message: nombreError.message
      });
    }

    if (errors.length > 0) {
      setEditTipoError({
        status: "Client error",
        errors: errors,
        details: {}
      });
      return true;
    }

    setEditTipoError(null);
    return false;
  };

  const handleCreateMarcaError = (data, marcasExistentes = []) => {
    const errors = [];

    // Validar nombre de marca incluyendo verificación de duplicados
    const nombreError = validateNombreMarca(data.nombre, marcasExistentes);
    if (nombreError) {
      errors.push({
        field: 'nombre',
        message: nombreError.message
      });
    }

    if (errors.length > 0) {
      setCreateMarcaError({
        status: "Client error",
        errors: errors,
        details: {}
      });
      return true;
    }

    setCreateMarcaError(null);
    return false;
  };

  const handleEditMarcaError = (data, marcasExistentes = [], currentId = null) => {
    const errors = [];

    // Validar nombre de marca incluyendo verificación de duplicados (excluyendo la marca actual)
    const nombreError = validateNombreMarca(data.nombre, marcasExistentes, currentId);
    if (nombreError) {
      errors.push({
        field: 'nombre',
        message: nombreError.message
      });
    }

    if (errors.length > 0) {
      setEditMarcaError({
        status: "Client error",
        errors: errors,
        details: {}
      });
      return true;
    }

    setEditMarcaError(null);
    return false;
  };
  return {
    createError,
    editError,
    createTipoError,
    editTipoError,
    createMarcaError,
    editMarcaError,
    handleCreateError,
    handleEditError,
    handleCreateTipoError,
    handleEditTipoError,
    handleCreateMarcaError,
    handleEditMarcaError
  };
};
