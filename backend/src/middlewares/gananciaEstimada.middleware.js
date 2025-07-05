"use strict";

/**
 * Middleware para logging y monitoreo del módulo de ganancia estimada
 */

/**
 * Middleware para registrar consultas de ganancia estimada
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
export const logGananciaEstimadaRequest = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const userInfo = req.user ? `Usuario: ${req.user.username} (${req.user.email})` : 'Usuario no identificado';
  const endpoint = req.originalUrl;
  
  console.log(`[${timestamp}] GANANCIA ESTIMADA - ${endpoint} - ${userInfo}`);
  
  // Guardar timestamp para calcular tiempo de respuesta
  req.startTime = Date.now();
  
  // Interceptar la respuesta para logging
  const originalSend = res.send;
  res.send = function(data) {
    const endTime = Date.now();
    const responseTime = endTime - req.startTime;
    
    console.log(`[${timestamp}] GANANCIA ESTIMADA COMPLETADA - ${endpoint} - Tiempo: ${responseTime}ms - Status: ${res.statusCode}`);
    
    // Restaurar función original y enviar respuesta
    res.send = originalSend;
    return originalSend.call(this, data);
  };
  
  next();
};

/**
 * Middleware para validar parámetros opcionales de consulta
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
export const validateGananciaEstimadaQuery = (req, res, next) => {
  const { fechaDesde, fechaHasta, categoria } = req.query;
  
  // Validar fechas si se proporcionan
  if (fechaDesde) {
    const fecha = new Date(fechaDesde);
    if (isNaN(fecha.getTime())) {
      return res.status(400).json({
        success: false,
        message: "El parámetro 'fechaDesde' debe ser una fecha válida (YYYY-MM-DD)"
      });
    }
    req.query.fechaDesde = fecha;
  }
  
  if (fechaHasta) {
    const fecha = new Date(fechaHasta);
    if (isNaN(fecha.getTime())) {
      return res.status(400).json({
        success: false,
        message: "El parámetro 'fechaHasta' debe ser una fecha válida (YYYY-MM-DD)"
      });
    }
    req.query.fechaHasta = fecha;
  }
  
  // Validar que fechaDesde sea menor que fechaHasta
  if (fechaDesde && fechaHasta && req.query.fechaDesde > req.query.fechaHasta) {
    return res.status(400).json({
      success: false,
      message: "La fecha de inicio debe ser anterior a la fecha de fin"
    });
  }
  
  // Validar categoría si se proporciona
  if (categoria) {
    const categoriasValidas = ['animalVara', 'productos', 'subproductos', 'mermas'];
    if (!categoriasValidas.includes(categoria)) {
      return res.status(400).json({
        success: false,
        message: `Categoría inválida. Valores permitidos: ${categoriasValidas.join(', ')}`
      });
    }
  }
  
  next();
};

/**
 * Middleware para cachear resultados de ganancia estimada (opcional)
 * Útil para evitar recálculos frecuentes de la misma información
 */
let cacheGananciaEstimada = {
  data: null,
  timestamp: null,
  ttl: 5 * 60 * 1000 // 5 minutos en millisegundos
};

export const cacheGananciaEstimadaMiddleware = (req, res, next) => {
  // Solo cachear para consultas sin parámetros específicos
  if (Object.keys(req.query).length > 0) {
    return next();
  }
  
  const now = Date.now();
  
  // Verificar si hay cache válido
  if (cacheGananciaEstimada.data && 
      cacheGananciaEstimada.timestamp && 
      (now - cacheGananciaEstimada.timestamp) < cacheGananciaEstimada.ttl) {
    
    console.log(`[${new Date().toISOString()}] GANANCIA ESTIMADA - Usando cache - ${req.originalUrl}`);
    
    return res.status(200).json({
      success: true,
      message: "Ganancia estimada obtenida desde cache",
      data: cacheGananciaEstimada.data,
      cached: true,
      cachedAt: new Date(cacheGananciaEstimada.timestamp).toISOString()
    });
  }
  
  // Interceptar la respuesta para guardar en cache
  const originalSend = res.send;
  res.send = function(data) {
    try {
      const responseData = JSON.parse(data);
      if (responseData.success && responseData.data) {
        cacheGananciaEstimada.data = responseData.data;
        cacheGananciaEstimada.timestamp = now;
        console.log(`[${new Date().toISOString()}] GANANCIA ESTIMADA - Guardado en cache`);
      }
    } catch (error) {
      console.error('Error al cachear ganancia estimada:', error);
    }
    
    res.send = originalSend;
    return originalSend.call(this, data);
  };
  
  next();
};

/**
 * Función para limpiar el cache manualmente
 */
export const clearGananciaEstimadaCache = () => {
  cacheGananciaEstimada = {
    data: null,
    timestamp: null,
    ttl: 5 * 60 * 1000
  };
  console.log(`[${new Date().toISOString()}] GANANCIA ESTIMADA - Cache limpiado manualmente`);
};
