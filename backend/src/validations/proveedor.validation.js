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

  nombreEncargado: Joi.string()
    .max(255)
    .optional()
    .messages({
      "string.base": "El nombre del encargado debe ser un texto",
      "string.max": "El nombre del encargado no puede tener más de {#limit} caracteres",
    }),

  movilEncargado: Joi.string()
    .max(50)
    .optional()
    .messages({
      "string.base": "El móvil del encargado debe ser un texto",
      "string.max": "El móvil del encargado no puede tener más de {#limit} caracteres",
    }),

  telefonoEncargado: Joi.string()
    .max(50)
    .optional()
    .messages({
      "string.base": "El teléfono del encargado debe ser un texto",
      "string.max": "El teléfono del encargado no puede tener más de {#limit} caracteres",
    }),

  nombreRepartidor: Joi.string()
    .max(255)
    .optional()
    .messages({
      "string.base": "El nombre del repartidor debe ser un texto",
      "string.max": "El nombre del repartidor no puede tener más de {#limit} caracteres",
    }),

  movilRepartidor: Joi.string()
    .max(50)
    .optional()
    .messages({
      "string.base": "El móvil del repartidor debe ser un texto",
      "string.max": "El móvil del repartidor no puede tener más de {#limit} caracteres",
    }),

  telefonoRepartidor: Joi.string()
    .max(50)
    .optional()
    .messages({
      "string.base": "El teléfono del repartidor debe ser un texto",
      "string.max": "El teléfono del repartidor no puede tener más de {#limit} caracteres",
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
  nombre: Joi.string().optional(),
  direccion: Joi.string().optional(),
  banco: Joi.string().optional(),
  numeroCuenta: Joi.string().optional(),
  tipoCuenta: Joi.string().optional(),
})
  .unknown(true)
  .messages({
    "object.unknown": "No se permiten propiedades adicionales.",
  });
