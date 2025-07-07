
import axios from 'axios';
import cookies from 'js-cookie';

const API_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:3050/api';

const instance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

instance.interceptors.request.use(
  (config) => {
    const token = cookies.get('jwt-auth', { path: '/' });
    if(token) {
      console.log('Token encontrado en cookies, añadiendo a la cabecera Authorization');
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn('No se encontró token JWT en cookies. La solicitud podría fallar si la ruta está protegida.');
    }
    
    // Solo establecer Content-Type si no es FormData
    if (!(config.data instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json';
    } else {
      // Para FormData, permitir que el navegador establezca el Content-Type automáticamente
      console.log('📎 [AXIOS] Detectado FormData, permitiendo Content-Type automático');
    }
    
    // Mostrar información de la solicitud para depuración
    console.log(`[API Request] ${config.method.toUpperCase()} ${config.url}`);
    console.log(`[API Request] Content-Type:`, config.headers['Content-Type'] || 'Auto (FormData)');
    
    return config;
  },
  (error) => {
    console.error('Error en interceptor de solicitud:', error);
    return Promise.reject(error);
  }
);

// Interceptor de respuesta para debugging
instance.interceptors.response.use(
  (response) => {
    console.log(`[API Response] ${response.status} para ${response.config.url}`);
    return response;
  },
  (error) => {
    if (error.response) {
      console.error(`[API Error] ${error.response.status} para ${error.config.url}:`, error.response.data);
    } else {
      console.error('[API Error] Sin respuesta del servidor:', error.message);
    }
    return Promise.reject(error);
  }
);

export default instance;
