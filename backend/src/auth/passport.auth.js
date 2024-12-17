"use strict";
import passport from "passport";
import User from "../entity/user.entity.js";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import dotenv from "dotenv";
import { AppDataSource } from "../config/configDb.js";

dotenv.config();

// Verifica que el secreto esté definido
if (!process.env.ACCESS_TOKEN_SECRET) {
  console.error("❌ Error: La variable de entorno ACCESS_TOKEN_SECRET no está definida.");
  process.exit(1);
}

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.ACCESS_TOKEN_SECRET, // Usa el secreto desde el .env
};

passport.use(
  new JwtStrategy(options, async (jwt_payload, done) => {
    try {
      // Accede al repositorio de usuarios desde TypeORM
      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOne({
        where: {
          email: jwt_payload.email, // Busca al usuario por email en el token
        },
      });

      if (user) {
        return done(null, user); // Si el usuario existe, continúa con la autenticación
      } else {
        return done(null, false); // Si no, rechaza la autenticación
      }
    } catch (error) {
      console.error("❌ Error en JwtStrategy:", error.message);
      return done(error, false); // Manejo de errores durante la autenticación
    }
  })
);

export function passportJwtSetup() {
  // Inicializa Passport
  passport.initialize();
  console.log("✅ Passport JWT configurado correctamente.");
}