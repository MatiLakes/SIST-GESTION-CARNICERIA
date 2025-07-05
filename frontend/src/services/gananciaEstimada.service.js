import rootService from './root.service.js';

/**
 * Servicio para gestionar las consultas de ganancia estimada
 */
class GananciaEstimadaService {
  
  /**
   * Obtiene el cálculo completo de ganancia estimada
   * @returns {Promise} Respuesta con el cálculo completo
   */
  async obtenerGananciaCompleta() {
    try {
      console.log('📊 Obteniendo ganancia estimada completa...');
      const response = await rootService({
        method: 'GET',
        url: '/ganancia-estimada'
      });
      
      console.log('✅ Ganancia estimada completa obtenida:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error al obtener ganancia estimada completa:', error);
      throw this.handleError(error, 'Error al obtener la ganancia estimada completa');
    }
  }

  /**
   * Obtiene solo el resumen de ganancia estimada
   * @returns {Promise} Respuesta con el resumen
   */
  async obtenerResumen() {
    try {
      console.log('📊 Obteniendo resumen de ganancia estimada...');
      const response = await rootService({
        method: 'GET',
        url: '/ganancia-estimada/resumen'
      });
      
      console.log('✅ Resumen de ganancia estimada obtenido:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error al obtener resumen de ganancia estimada:', error);
      throw this.handleError(error, 'Error al obtener el resumen de ganancia estimada');
    }
  }

  /**
   * Obtiene el detalle por categorías
   * @returns {Promise} Respuesta con el detalle por categorías
   */
  async obtenerDetalle() {
    try {
      console.log('📊 Obteniendo detalle de ganancia estimada...');
      const response = await rootService({
        method: 'GET',
        url: '/ganancia-estimada/detalle'
      });
      
      console.log('✅ Detalle de ganancia estimada obtenido:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error al obtener detalle de ganancia estimada:', error);
      throw this.handleError(error, 'Error al obtener el detalle de ganancia estimada');
    }
  }

  /**
   * Obtiene las ganancias específicas de animales en vara
   * @returns {Promise} Respuesta con ganancias de animal vara
   */
  async obtenerGananciasAnimalVara() {
    try {
      console.log('🐄 Obteniendo ganancias de animal vara...');
      const response = await rootService({
        method: 'GET',
        url: '/ganancia-estimada/animal-vara'
      });
      
      console.log('✅ Ganancias de animal vara obtenidas:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error al obtener ganancias de animal vara:', error);
      throw this.handleError(error, 'Error al obtener las ganancias de animal vara');
    }
  }

  /**
   * Obtiene las ganancias específicas de productos
   * @returns {Promise} Respuesta con ganancias de productos
   */
  async obtenerGananciasProductos() {
    try {
      console.log('📦 Obteniendo ganancias de productos...');
      const response = await rootService({
        method: 'GET',
        url: '/ganancia-estimada/productos'
      });
      
      console.log('✅ Ganancias de productos obtenidas:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error al obtener ganancias de productos:', error);
      throw this.handleError(error, 'Error al obtener las ganancias de productos');
    }
  }

  /**
   * Obtiene las ganancias específicas de subproductos
   * @returns {Promise} Respuesta con ganancias de subproductos
   */
  async obtenerGananciasSubproductos() {
    try {
      console.log('🥩 Obteniendo ganancias de subproductos...');
      const response = await rootService({
        method: 'GET',
        url: '/ganancia-estimada/subproductos'
      });
      
      console.log('✅ Ganancias de subproductos obtenidas:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error al obtener ganancias de subproductos:', error);
      throw this.handleError(error, 'Error al obtener las ganancias de subproductos');
    }
  }

  /**
   * Obtiene las pérdidas por mermas
   * @returns {Promise} Respuesta con pérdidas por mermas
   */
  async obtenerPerdidasMermas() {
    try {
      console.log('⚠️ Obteniendo pérdidas por mermas...');
      const response = await rootService({
        method: 'GET',
        url: '/ganancia-estimada/mermas'
      });
      
      console.log('✅ Pérdidas por mermas obtenidas:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error al obtener pérdidas por mermas:', error);
      throw this.handleError(error, 'Error al obtener las pérdidas por mermas');
    }
  }

  /**
   * Maneja los errores de las peticiones HTTP
   * @param {Object} error - Error original
   * @param {string} defaultMessage - Mensaje por defecto
   * @returns {Error} Error procesado
   */
  handleError(error, defaultMessage) {
    if (error.response) {
      // Error de respuesta del servidor
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          return new Error('No autorizado. Por favor, inicia sesión nuevamente.');
        case 403:
          return new Error('No tienes permisos para acceder a esta información.');
        case 404:
          return new Error('Servicio no encontrado.');
        case 500:
          return new Error('Error interno del servidor. Por favor, intenta más tarde.');
        default:
          return new Error(data?.message || defaultMessage);
      }
    } else if (error.request) {
      // Error de red
      return new Error('Error de conexión. Verifica tu conexión a internet.');
    } else {
      // Error en la configuración de la petición
      return new Error(defaultMessage);
    }
  }

  /**
   * Formatea números a formato de moneda chilena
   * @param {number} amount - Cantidad a formatear
   * @returns {string} Cantidad formateada
   */
  formatCurrency(amount) {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(amount);
  }

  /**
   * Formatea porcentajes
   * @param {number} percentage - Porcentaje a formatear
   * @returns {string} Porcentaje formateado
   */
  formatPercentage(percentage) {
    return `${parseFloat(percentage).toFixed(2)}%`;
  }

  /**
   * Calcula el estado de la ganancia (positiva, negativa, neutro)
   * @param {number} ganancia - Ganancia a evaluar
   * @returns {string} Estado de la ganancia
   */
  getGananciaStatus(ganancia) {
    if (ganancia > 0) return 'positive';
    if (ganancia < 0) return 'negative';
    return 'neutral';
  }

  /**
   * Obtiene el color apropiado para mostrar una ganancia
   * @param {number} ganancia - Ganancia a evaluar
   * @returns {string} Clase CSS o color
   */
  getGananciaColor(ganancia) {
    if (ganancia > 0) return 'text-green-600';
    if (ganancia < 0) return 'text-red-600';
    return 'text-gray-600';
  }
}

export default new GananciaEstimadaService();
