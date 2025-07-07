"use strict";

import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { pagoPendienteController } from "../controllers/PagoPendiente.controller.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { isAdmin } from "../middlewares/authorization.middleware.js";
import { AppDataSource } from "../config/configDb.js";
import PagoPendiente from "../entity/PagoPendiente.entity.js";

const router = Router();

// Función para limpiar facturas huérfanas automáticamente
async function limpiarFacturasHuerfanas() {
  try {
    // Obtener facturas activas de la BD
    const pagoPendienteRepository = AppDataSource.getRepository(PagoPendiente);
    const pagosActivos = await pagoPendienteRepository.find({
      select: ["factura"]
    });

    const facturasActivas = pagosActivos
      .filter(pago => pago.factura && pago.factura.trim() !== '')
      .map(pago => path.basename(pago.factura));

    // Obtener archivos físicos del directorio
    if (!fs.existsSync(uploadsDir)) {
      return { deleted: 0, errors: 0 };
    }

    const archivosEnDisco = fs.readdirSync(uploadsDir).filter(file => {
      const filePath = path.join(uploadsDir, file);
      return fs.statSync(filePath).isFile();
    });

    // Identificar archivos huérfanos
    const archivosHuerfanos = archivosEnDisco.filter(archivo => 
      !facturasActivas.includes(archivo)
    );

    if (archivosHuerfanos.length === 0) {
      return { deleted: 0, errors: 0, message: "No hay archivos huérfanos" };
    }

    console.log(`🧹 Auto-limpieza: eliminando ${archivosHuerfanos.length} facturas huérfanas...`);

    let eliminados = 0;
    let errores = 0;

    // Eliminar archivos huérfanos
    for (const archivo of archivosHuerfanos) {
      try {
        const rutaArchivo = path.join(uploadsDir, archivo);
        fs.unlinkSync(rutaArchivo);
        eliminados++;
      } catch (error) {
        errores++;
        console.error(`❌ Error eliminando ${archivo}:`, error.message);
      }
    }

    if (eliminados > 0) {
      console.log(`✅ Auto-limpieza completada: ${eliminados} archivos eliminados`);
    }

    return { deleted: eliminados, errors: errores };
  } catch (error) {
    console.error("❌ Error en auto-limpieza:", error.message);
    return { deleted: 0, errors: 1 };
  }
}

// Iniciar limpieza automática cada 30 minutos
setInterval(async () => {
  await limpiarFacturasHuerfanas();
}, 30 * 60 * 1000);

// Ejecutar limpieza inicial
setTimeout(async () => {
  console.log("🚀 Iniciando auto-limpieza de facturas...");
  await limpiarFacturasHuerfanas();
}, 5000); // 5 segundos después de que se carguen las rutas

// Asegurar que la carpeta de facturas existe
const uploadsDir = "uploads/facturas";
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log(`📁 Carpeta creada: ${uploadsDir}`);
}

// Configuración de multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `factura_${Date.now()}_${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ 
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

router.use(authenticateJwt).use(isAdmin);

router.post("/", upload.single("factura"), pagoPendienteController.crearPagoPendiente);
router.get("/", pagoPendienteController.obtenerPagosPendientes);
router.put("/:id", upload.single("factura"), pagoPendienteController.modificarPagoPendiente);
router.delete("/:id", pagoPendienteController.eliminarPagoPendiente);

// Endpoint para servir archivos de facturas
router.get("/facturas/archivo/:filename", authenticateJwt, async (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(process.cwd(), "uploads", "facturas", filename);
    
    // Verificar que el archivo existe
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: "Archivo no encontrado"
      });
    }
    
    // Verificar que el archivo está referenciado en la BD (seguridad)
    const pagoPendienteRepository = AppDataSource.getRepository(PagoPendiente);
    const pagoConFactura = await pagoPendienteRepository.findOne({
      where: {
        factura: `uploads/facturas/${filename}`
      }
    });
    
    if (!pagoConFactura) {
      return res.status(403).json({
        success: false,
        message: "Acceso no autorizado al archivo"
      });
    }
    
    // Establecer headers apropiados para PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
    
    // Enviar el archivo
    res.sendFile(filePath);
    
  } catch (error) {
    console.error("Error sirviendo archivo:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor"
    });
  }
});

// Endpoint para descargar archivos de facturas (fuerza descarga)
router.get("/facturas/descargar/:filename", authenticateJwt, async (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(process.cwd(), "uploads", "facturas", filename);
    
    // Verificar que el archivo existe
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: "Archivo no encontrado"
      });
    }
    
    // Verificar que el archivo está referenciado en la BD (seguridad)
    const pagoPendienteRepository = AppDataSource.getRepository(PagoPendiente);
    const pagoConFactura = await pagoPendienteRepository.findOne({
      where: {
        factura: `uploads/facturas/${filename}`
      }
    });
    
    if (!pagoConFactura) {
      return res.status(403).json({
        success: false,
        message: "Acceso no autorizado al archivo"
      });
    }
    
    // Establecer headers para forzar descarga
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    
    // Enviar el archivo
    res.sendFile(filePath);
    
  } catch (error) {
    console.error("Error descargando archivo:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor"
    });
  }
});

// Endpoint para ejecutar limpieza manual inmediata
router.post("/facturas/limpiar", async (req, res) => {
  try {
    const resultado = await limpiarFacturasHuerfanas();
    res.json({
      success: true,
      message: `Limpieza ejecutada: ${resultado.deleted} facturas huérfanas eliminadas`,
      data: resultado
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error ejecutando limpieza"
    });
  }
});

export default router;
