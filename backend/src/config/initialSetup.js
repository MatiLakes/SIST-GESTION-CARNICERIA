"use strict";
import User from "../entity/user.entity.js";
import { AppDataSource } from "./configDb.js";
import { encryptPassword } from "../helpers/bcrypt.helper.js";

async function createUsers() {
  try {
    const userRepository = AppDataSource.getRepository(User);

    // Eliminar todos los usuarios existentes
    await userRepository.clear(); // Esto eliminará todos los usuarios en la tabla

    // Crear nuevo administrador y un usuario
    await Promise.all([
      userRepository.save(
        userRepository.create({
          nombreCompleto: "Administador Genérico", // Solo el nuevo administrador
          rut: "1.234.567-8",
          email: "administrador2024@gmail.cl", // Asignando el correo del administrador
          password: await encryptPassword("admin1234"),
          rol: "administrador",
        })
      ),
      userRepository.save(
        userRepository.create({
          nombreCompleto: "Usuario Genérico", // Puedes cambiar este nombre si deseas
          rut: "2.356.789-0",
          email: "usuario1.2024@gmail.cl",
          password: await encryptPassword("user1234"),
          rol: "usuario",
        })
      )
    ]);

    console.log("* => Usuarios creados exitosamente");
  } catch (error) {
    console.error("Error al crear usuarios:", error);
  }
}

export { createUsers };