import { AppDataSource } from "../config/configDb.js";
import ControlHigiene from "../entity/ControlHigiene.entity.js";
import Personal from "../entity/Personal.entity.js";

// Función para inicializar la base de datos
async function iniciarDB() {
  try {
    await AppDataSource.initialize();
    console.log("Base de datos inicializada correctamente");
    return true;
  } catch (error) {
    console.error("Error al inicializar la base de datos:", error);
    return false;
  }
}

// Función para verificar registros de control de higiene
async function verificarControlHigiene() {
  const dbIniciada = await iniciarDB();
  if (!dbIniciada) return;
  
  try {
    const controlHigieneRepo = AppDataSource.getRepository(ControlHigiene);
    const personalRepo = AppDataSource.getRepository(Personal);
    
    // Consultar todos los registros de control de higiene
    const controles = await controlHigieneRepo.find({
      relations: ["personal"]
    });
    
    console.log(`Se encontraron ${controles.length} registros de control de higiene`);
    
    // Analizar cada registro
    controles.forEach(control => {
      console.log(`ID: ${control.id}, Fecha: ${control.fecha}`);
      
      if (!control.personal) {
        console.error(`❌ El registro ID ${control.id} NO tiene personal asociado`);
      } else {
        console.log(`✅ Personal asociado: ${control.personal.nombre} (ID: ${control.personal.id}) - ${control.personal.seccion}`);
      }
      
      console.log("--------------------------");
    });
    
    // Verificar registros con problemas
    const registrosProblematicos = controles.filter(c => !c.personal);
    if (registrosProblematicos.length > 0) {
      console.log(`\n⚠️ Se encontraron ${registrosProblematicos.length} registros sin personal asociado`);
      
      // Intentar arreglar manualmente
      const listaPersonal = await personalRepo.find();
      if (listaPersonal.length > 0) {
        console.log(`\nHay ${listaPersonal.length} registros de personal disponibles`);
        console.log("Primer personal disponible:", listaPersonal[0]);
        
        // Sugerir corrección
        console.log(`\nPara arreglar un registro problemático, ejecute:
        
        const controlRepo = AppDataSource.getRepository(ControlHigiene);
        const personalRepo = AppDataSource.getRepository(Personal);
        
        const registroProblema = await controlRepo.findOneBy({ id: ID_DEL_REGISTRO });
        const personal = await personalRepo.findOneBy({ id: ID_DEL_PERSONAL });
        
        registroProblema.personal = personal;
        await controlRepo.save(registroProblema);
        `);
      } else {
        console.log("⚠️ No hay personal registrado en la base de datos!");
      }
    }
    
  } catch (error) {
    console.error("Error al verificar control de higiene:", error);
  } finally {
    // Cerrar la conexión
    await AppDataSource.destroy();
    console.log("Conexión cerrada");
  }
}

// Ejecutar la función de verificación
verificarControlHigiene();
