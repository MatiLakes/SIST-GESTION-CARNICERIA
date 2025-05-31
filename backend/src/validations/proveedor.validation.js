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
    .required()
    .messages({
      "string.base": "La dirección debe ser un texto",
      "string.max": "La dirección no puede tener más de {#limit} caracteres",
      "any.required": "La dirección es obligatoria",
      "string.empty": "La dirección no puede estar vacía",
    }),

  banco: Joi.string()
    .max(255)
    .required()
    .messages({
      "string.base": "El banco debe ser un texto",
      "string.max": "El banco no puede tener más de {#limit} caracteres",
      "any.required": "El banco es obligatorio",
      "string.empty": "El banco no puede estar vacío",
    }),
  numeroCuenta: Joi.string()
    .pattern(/^[0-9]+$/)
    .min(5)
    .max(20)
    .required()
    .messages({
      "string.pattern.base": "El número de cuenta debe contener solo números",
      "string.min": "El número de cuenta debe tener al menos {#limit} dígitos",
      "string.max": "El número de cuenta no puede exceder los {#limit} dígitos",
      "any.required": "El número de cuenta es obligatorio",
      "string.empty": "El número de cuenta no puede estar vacío",
    }),

  tipoCuenta: Joi.string()
    .valid("Cuenta corriente", "Cuenta vista", "Cuenta de ahorro")
    .required()
    .messages({
      "string.base": "El tipo de cuenta debe ser un texto",
      "string.valid": "El tipo de cuenta debe ser uno de los siguientes: 'Cuenta corriente', 'Cuenta vista', 'Cuenta de ahorro'",
      "any.required": "El tipo de cuenta es obligatorio",
      "string.empty": "El tipo de cuenta no puede estar vacío",
    }),

  nombreEncargado: Joi.string()
    .max(255)
    .required()
    .messages({
      "string.base": "El nombre del encargado debe ser un texto",
      "string.max": "El nombre del encargado no puede tener más de {#limit} caracteres",
      "any.required": "El nombre del encargado es obligatorio",
      "string.empty": "El nombre del encargado no puede estar vacío",
    }),
  movilEncargado: Joi.alternatives().try(
    Joi.string()
      .pattern(/^\+?[0-9]+$/)
      .min(8)
      .max(15)
      .required()
      .messages({
        "any.required": "El móvil del encargado es obligatorio",
        "string.pattern.base": "El móvil debe contener solo números y puede comenzar con +",
        "string.min": "El móvil debe tener al menos 8 dígitos",
        "string.max": "El móvil no puede exceder los 15 dígitos",
        "string.empty": "El móvil no puede estar vacío",
      }),
    Joi.array().items(      Joi.string()
        .pattern(/^\+?[0-9]+$/)
        .min(8)
        .max(15)
        .required()
        .messages({
          "any.required": "El móvil del encargado es obligatorio",
          "string.pattern.base": "El móvil debe contener solo números y puede comenzar con +",
          "string.min": "El móvil debe tener al menos 8 dígitos",
          "string.max": "El móvil no puede exceder los 15 dígitos",
          "string.empty": "El móvil no puede estar vacío",
        })
    )
  ).required()
    .messages({
      "any.required": "Debe proporcionar al menos un móvil del encargado",
      "alternatives.types": "El móvil debe ser un número o una lista de números",
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
