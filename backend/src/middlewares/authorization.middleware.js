import User from "../entity/user.entity.js";
import { AppDataSource } from "../config/configDb.js";
import {
handleErrorClient,
handleErrorServer,
} from "../handlers/responseHandlers.js";

export async function isAdmin(req, res, next) {
try {
    console.log(`[Auth] Verificando permisos de administrador para: ${req.method} ${req.originalUrl}`);
    
    if (!req.user || !req.user.email) {
      console.error('[Auth Error] Solicitud sin datos de usuario autenticado');
      return handleErrorClient(
        res,
        401,
        "Autenticación requerida para acceder a este recurso"
      );
    }
    
    const userRepository = AppDataSource.getRepository(User);
    console.log(`[Auth] Buscando usuario por email: ${req.user.email}`);

    const userFound = await userRepository.findOneBy({ email: req.user.email });

    if (!userFound) {
      console.error(`[Auth Error] Usuario ${req.user.email} no encontrado en la base de datos`);
      return handleErrorClient(
        res,
        404,
        "Usuario no encontrado en la base de datos",
      );
    }

    const rolUser = userFound.rol;
    console.log(`[Auth] Rol del usuario ${userFound.email}: ${rolUser}`);

    if (rolUser !== "administrador") {
        console.warn(`[Auth Error] Usuario ${userFound.email} con rol ${rolUser} intentó acceder a recurso restringido`);
        return handleErrorClient(
            res,
            403,
            "Error al acceder al recurso",
            "Se requiere un rol de administrador para realizar esta acción."
        );
    }
    next();
} catch (error) {
    handleErrorServer(
    res,
    500,
    error.message,
    );
}
}