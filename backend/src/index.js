"use strict";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import express, { json, urlencoded } from "express";
import { cookieKey, HOST, PORT } from "./config/configEnv.js";
import { connectDB } from "./config/configDb.js";
import { createUsers } from "./config/initialSetup.js";
import { passportJwtSetup } from "./auth/passport.auth.js";
import indexRoutes from "./routes/index.routes.js";
import { cargarCategoriasPredeterminadas } from "./services/categoria.service.js";

async function setupServer() {
  try {
    const app = express();

    app.disable("x-powered-by");

    // Middlewares
    app.use(
      cors({
        credentials: true,
        origin: true,
      })
    );

    app.use(
      urlencoded({
        extended: true,
        limit: "1mb",
      })
    );

    app.use(
      json({
        limit: "1mb",
      })
    );

    app.use(cookieParser());
    app.use(morgan("dev"));

    app.use(
      session({
        secret: process.env.SESSION_SECRET, // Usa la clave desde el archivo .env
        resave: false, // Evita guardar la sesión si no hay cambios
        saveUninitialized: false, // No guarda sesiones vacías
        cookie: {
          secure: process.env.NODE_ENV === "production", // Asegura las cookies solo en producción
          httpOnly: true, // Previene acceso desde JavaScript
          sameSite: "strict", // Protege contra ataques CSRF
        },
      })
    );

    app.use(passport.initialize());
    app.use(passport.session());

    // Configuración de Passport
    passportJwtSetup();

    // Rutas
    app.use("/api", indexRoutes);

    // Iniciar el servidor
    app.listen(PORT, () => {
      console.log(`=> Servidor corriendo en ${HOST}:${PORT}/api`);
    });
  } catch (error) {
    console.log("Error en index.js -> setupServer(), el error es: ", error);
  }
}

async function setupAPI() {
  try {
    await connectDB();                         // Conectar a la base de datos
    await cargarCategoriasPredeterminadas();  // Cargar categorías predeterminadas
    await setupServer();                       // Configurar el servidor
    await createUsers();                       // Crear usuarios iniciales si es necesario
  } catch (error) {
    console.log("Error en index.js -> setupAPI(), el error es: ", error);
  }
}

setupAPI()
  .then(() => console.log("=> API Iniciada exitosamente"))
  .catch((error) =>
    console.log("Error en index.js -> setupAPI(), el error es: ", error)
  );
