import Joi from "joi";

const proveedorSchema = Joi.object({
  nombre: Joi.string()
    .min(3)
    .max(255)
    .required()
    .messages({
      "string.base": "El nombre debe ser un texto",
      "string.empty": "El nombre no puede estar vacío",
      "string.min": "El nombre debe tener al menos {#limit} caracteres",
      "string.max": "El nombre no puede tener más de {#limit} caracteres",
      "any.required": "El nombre es obligatorio",
    }),
  direccion: Joi.string()
    .max(255)
    .optional()
    .messages({
      "string.base": "La dirección debe ser un texto",
      "string.max": "La dirección no puede tener más de {#limit} caracteres",
    }),
  banco: Joi.string()
    .max(255)
    .optional()
    .messages({
      "string.base": "El banco debe ser un texto",
      "string.max": "El banco no puede tener más de {#limit} caracteres",
    }),
  numeroCuenta: Joi.string()
    .max(50)
    .optional()
    .messages({
      "string.base": "El número de cuenta debe ser un texto",
      "string.max": "El número de cuenta no puede tener más de {#limit} caracteres",
    }),
  tipoCuenta: Joi.string()
    .valid("Cuenta corriente", "Cuenta vista", "Cuenta de ahorro")
    .required()
    .messages({
      "string.base": "El tipo de cuenta debe ser un texto",
      "string.valid": "El tipo de cuenta debe ser uno de los siguientes: 'Cuenta corriente', 'Cuenta vista', 'Cuenta de ahorro'",
      "any.required": "El tipo de cuenta es obligatorio",
    }),
  idEncargado: Joi.string()
    .optional()
    .messages({
      "string.base": "El ID del encargado debe ser un texto",
    }),
  nombreEncargado: Joi.string()
    .max(255)
    .optional()
    .messages({
      "string.base": "El nombre del encargado debe ser un texto",
      "string.max": "El nombre del encargado no puede tener más de {#limit} caracteres",
    }),
  estadoEncargado: Joi.string()
    .valid("Activo", "Inactivo")
    .optional()
    .messages({
      "string.base": "El estado del encargado debe ser un texto",
      "string.valid": "El estado del encargado debe ser 'Activo' o 'Inactivo'",
    }),
  contactosEncargado: Joi.array()
    .items(Joi.string().email().optional())
    .optional()
    .messages({
      "array.base": "Los contactos del encargado deben ser un arreglo",
      "array.items": "Cada contacto del encargado debe ser una cadena de texto válida",
    }),
  idRepartidor: Joi.string()
    .optional()
    .messages({
      "string.base": "El ID del repartidor debe ser un texto",
    }),
  nombreRepartidor: Joi.string()
    .max(255)
    .optional()
    .messages({
      "string.base": "El nombre del repartidor debe ser un texto",
      "string.max": "El nombre del repartidor no puede tener más de {#limit} caracteres",
    }),
  estadoRepartidor: Joi.string()
    .valid("Activo", "Inactivo")
    .optional()
    .messages({
      "string.base": "El estado del repartidor debe ser un texto",
      "string.valid": "El estado del repartidor debe ser 'Activo' o 'Inactivo'",
    }),
  contactosRepartidor: Joi.array()
    .items(Joi.string().email().optional())
    .optional()
    .messages({
      "array.base": "Los contactos del repartidor deben ser un arreglo",
      "array.items": "Cada contacto del repartidor debe ser una cadena de texto válida",
    }),
  categorias: Joi.array()
    .items(Joi.number().integer().positive())
    .optional()
    .messages({
      "array.base": "Las categorías deben ser un arreglo",
      "array.items": "Cada categoría debe ser un número entero positivo",
    }),
})
  .unknown(false)
  .messages({
    "object.unknown": "No se permiten propiedades adicionales.",
  });

export const proveedorBodyValidation = {
  validate: (data) => proveedorSchema.validate(data),
};

export const proveedorUpdateBodyValidation = {
  validate: (data) => proveedorSchema.validate(data),
};

export const proveedorQueryValidation = Joi.object({
  id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      "number.base": "El ID debe ser un número entero",
      "number.integer": "El ID debe ser un número entero",
      "number.positive": "El ID debe ser un número positivo",
      "any.required": "El ID es obligatorio",
    }),
  nombre: Joi.string().optional(),
  direccion: Joi.string().optional(),
  banco: Joi.string().optional(),
  numeroCuenta: Joi.string().optional(),
  tipoCuenta: Joi.string().optional(),
  categorias: Joi.array().items(Joi.number().integer().positive()).optional(),
})
  .unknown(false)
  .messages({
    "object.unknown": "No se permiten propiedades adicionales.",
  });
