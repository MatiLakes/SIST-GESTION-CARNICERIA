"use strict";

import Joi from "joi";

// Función para obtener la fecha actual en zona horaria de Chile
const getChileanDate = () => {
    // Crear fecha actual
    const now = new Date();
    
    // Convertir a zona horaria de Chile (UTC-3 o UTC-4 dependiendo del horario de verano)
    const chileanTime = new Date(now.toLocaleString("en-US", { timeZone: "America/Santiago" }));
    
    // Establecer a medianoche para comparar solo días
    chileanTime.setHours(0, 0, 0, 0);
    
    console.log('🌎 [DEBUG] Fecha chilena calculada:', chileanTime);
    
    return chileanTime;
};

export const pagoPendienteValidation = {
    create: Joi.object({        monto: Joi.number()
            .min(1)
            .max(99999999)
            .required()
            .messages({
                "number.base": "El monto debe ser un número.",
                "number.min": "El monto debe ser mayor a 0.",
                "number.max": "El monto no puede tener más de 8 cifras.",
                "any.required": "El monto es obligatorio."
            }),

        fechaPedido: Joi.date()
            .required()
            .custom((value, helpers) => {
                console.log('🔍 [VALIDACION] Validando fechaPedido:', value);
                console.log('🔍 [VALIDACION] Tipo de dato:', typeof value);
                console.log('🔍 [VALIDACION] Fecha parseada:', new Date(value));
                console.log('✅ [VALIDACION] Fecha aceptada sin restricciones');
                return value;
            })
            .messages({
                "date.base": "La fecha del pedido debe ser una fecha válida.",
                "any.required": "La fecha del pedido es obligatoria."
            }),

        fechaLimite: Joi.date()
            .custom((value, helpers) => {
                const fechaLimite = new Date(value);
                const fechaPedido = new Date(helpers.state.ancestors[0].fechaPedido);
                
                // Establecer las fechas a medianoche para comparar solo días
                fechaLimite.setHours(0, 0, 0, 0);
                fechaPedido.setHours(0, 0, 0, 0);
                
                if (fechaLimite < fechaPedido) {
                    return helpers.error('date.min');
                }
                return value;
            })
            .required()
            .messages({
                "date.base": "La fecha límite debe ser una fecha válida.",
                "date.min": "La fecha límite debe ser igual o posterior a la fecha del pedido.",
                "any.required": "La fecha límite es obligatoria."
            }),

        // Estado se establece automáticamente como "Pendiente" en el servicio

        factura: Joi.string()
            .max(255)
            .allow(null, '')
            .pattern(/\.(pdf|jpg|jpeg)$/i)
            .messages({
                "string.max": "La ruta de la factura no puede exceder los 255 caracteres.",
                "string.pattern.base": "La factura debe ser un archivo PDF o JPG."
            }),

        cliente: Joi.object({
            id: Joi.number()
                .integer()
                .min(1)
                .required()
                .messages({
                    "number.base": "El ID del cliente debe ser un número.",
                    "number.integer": "El ID del cliente debe ser un número entero.",
                    "number.min": "El ID del cliente debe ser mayor a 0.",
                    "any.required": "El ID del cliente es obligatorio."
                })
        })
        .required()
        .messages({
            "object.base": "Los datos del cliente deben ser un objeto.",
            "any.required": "Los datos del cliente son obligatorios."    })
    }),

    update: Joi.object({        monto: Joi.number()
            .min(1)
            .max(99999999)
            .messages({
                "number.base": "El monto debe ser un número.",
                "number.min": "El monto debe ser mayor a 0.",
                "number.max": "El monto no puede tener más de 8 cifras."
            }),

        fechaPedido: Joi.date()
            .messages({
                "date.base": "La fecha del pedido debe ser una fecha válida."
            }),

        fechaLimite: Joi.date()
            .custom((value, helpers) => {
                if (!value) return value;
                
                const fechaLimite = new Date(value);
                const fechaPedido = helpers.state.ancestors[0].fechaPedido ? 
                    new Date(helpers.state.ancestors[0].fechaPedido) : 
                    new Date();
                
                // Establecer las fechas a medianoche para comparar solo días
                fechaLimite.setHours(0, 0, 0, 0);
                fechaPedido.setHours(0, 0, 0, 0);
                
                if (fechaLimite < fechaPedido) {
                    return helpers.error('date.min');
                }
                return value;
            })
            .messages({
                "date.base": "La fecha límite debe ser una fecha válida.",
                "date.min": "La fecha límite debe ser igual o posterior a la fecha del pedido."
            }),

        estado: Joi.string()
            .valid("Pendiente", "Pagado")
            .messages({
                "string.base": "El estado debe ser un texto.",
                "any.only": "El estado debe ser 'Pendiente' o 'Pagado'. El estado 'Vencido' se asigna automáticamente."
            }),

        factura: Joi.string()
            .max(255)
            .allow(null, '')
            .pattern(/\.(pdf|jpg|jpeg)$/i)
            .messages({
                "string.max": "La ruta de la factura no puede exceder los 255 caracteres.",
                "string.pattern.base": "La factura debe ser un archivo PDF o JPG."
            }),

        cliente: Joi.object({
            id: Joi.number()
                .integer()
                .min(1)
                .messages({
                    "number.base": "El ID del cliente debe ser un número.",
                    "number.integer": "El ID del cliente debe ser un número entero.",
                    "number.min": "El ID del cliente debe ser mayor a 0."
                })
        })
        .messages({
            "object.base": "Los datos del cliente deben ser un objeto."
        })
    })
    .min(1)
    .messages({
        "object.min": "Debe proporcionar al menos un campo para actualizar."
    })
};
