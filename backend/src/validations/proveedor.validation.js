/* eslint-disable max-len */
"use strict";
import Joi from "joi";

// Esquema de validación para crear y actualizar un proveedor
const proveedorSchema = Joi.object({
  nombre: Joi.string()
    .min(2)
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
  nombreEncargado: Joi.string()
    .max(255)
    .optional()
    .messages({
      "string.base": "El nombre del encargado debe ser un texto",
      "string.max": "El nombre del encargado no puede tener más de {#limit} caracteres",
    }),
  
  contactosRepartidor: Joi.array()
    .items(
      Joi.object({
        tipo: Joi.string().valid("teléfono", "móvil").required().messages({
          "any.required": "El tipo de contacto es obligatorio",
          "string.base": "El tipo debe ser 'teléfono' o 'móvil'",
        }),
        numero: Joi.string().pattern(/^[0-9]{9}$/).required().messages({
          "any.required": "El número de contacto es obligatorio",
          "string.pattern.base": "El número de contacto debe tener exactamente 9 dígitos",
        }),
      })
    )
    .optional()
    .messages({
      "array.base": "Los contactos del repartidor deben ser un array de objetos",
    }),
  nombreRepartidor: Joi.string()
    .max(255)
    .optional()
    .messages({
      "string.base": "El nombre del repartidor debe ser un texto",
      "string.max": "El nombre del repartidor no puede tener más de {#limit} caracteres",
    }),
  
  contactosEncargado: Joi.array()
    .items(
      Joi.object({
        tipo: Joi.string().valid("teléfono", "móvil").required().messages({
          "any.required": "El tipo de contacto es obligatorio",
          "string.base": "El tipo debe ser 'teléfono' o 'móvil'",
        }),
        numero: Joi.string().pattern(/^[0-9]{9}$/).required().messages({
          "any.required": "El número de contacto es obligatorio",
          "string.pattern.base": "El número de contacto debe tener exactamente 9 dígitos",
        }),
      })
    )
    .optional()
    .messages({
      "array.base": "Los contactos del encargado deben ser un array de objetos",
    }),
 
  banco: Joi.string()
    .max(255)
    .required()
    .messages({
      "string.base": "El banco debe ser un texto",
      "string.empty": "El banco no puede estar vacío",
      "any.required": "El banco es obligatorio",
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
    .optional()
    .messages({
      "string.base": "El tipo de cuenta debe ser un texto",
      "string.valid": "El tipo de cuenta debe ser uno de los siguientes: 'Cuenta corriente', 'Cuenta vista', 'Cuenta de ahorro'",
    }),
  categorias: Joi.array()
    .items(Joi.number().integer().positive())
    .optional()
    .min(1)  
    .messages({
      "array.base": "Las categorías deben ser un array",
      "array.includes": "Las categorías deben contener solo números enteros positivos",
      "array.min": "Las categorías deben contener al menos un número",
    }),
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
  telefono: Joi.string().optional(),
})
  .unknown(false)
  .messages({
    "object.unknown": "No se permiten propiedades adicionales.",
  });
