"use strict";
import passport from "passport";
import {
  handleErrorClient,
  handleErrorServer,
  } from "../handlers/responseHandlers.js";

export function authenticateJwt(req, res, next) {
  console.log(`[Auth] Intentando autenticar solicitud a: ${req.method} ${req.originalUrl}`);
  
  // Verificar si el token está en la cabecera
  const authHeader = req.headers.authorization;
  console.log(`[Auth] Cabecera de autorización presente: ${authHeader ? 'SÍ' : 'NO'}`);
  
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err) {
      console.error('[Auth Error] Error de servidor en autenticación JWT:', err);
      return handleErrorServer(
        res,
        500,
        "Error de autenticación en el servidor"
      );
    }

    if (!user) {
      console.warn(`[Auth Error] Autenticación fallida: ${info ? info.message : 'Usuario no encontrado'}`);
      return handleErrorClient(
        res,
        401,
        "No tienes permiso para acceder a este recurso",
        { info: info ? info.message : "No se encontró el usuario" }
      )
    }

    console.log(`[Auth] Usuario autenticado: ${user.email}, Rol: ${user.rol}`);
    req.user = user;
    next();
  })(req, res, next);
}