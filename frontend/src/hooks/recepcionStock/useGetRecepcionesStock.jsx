import { useState, useEffect } from "react";
import { getRecepcionesStock } from "@services/recepcionStock.service.js";

const useGetRecepcionesStock = () => {
  const [recepciones, setRecepciones] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRecepciones = async () => {
    setLoading(true);
    try {
      const response = await getRecepcionesStock();
      
      // Extracción de datos
      let datosRecepciones = [];
      
      if (response && response.data) {
        // Caso 1: {data: [...], success: true}
        if (response.data.data && Array.isArray(response.data.data)) {
          datosRecepciones = response.data.data;
        }
        // Caso 2: Array directo
        else if (Array.isArray(response.data)) {
          datosRecepciones = response.data;
        }
        // Caso 3: [data, error]
        else if (response.data[0] && Array.isArray(response.data[0])) {
          datosRecepciones = response.data[0];
        }
        // Caso 4: Objeto único
        else if (typeof response.data === 'object' && !Array.isArray(response.data)) {
          if (response.data.id) {
            datosRecepciones = [response.data];
          }
        }
      }
      
      // Verificar y procesar productos
      if (!Array.isArray(datosRecepciones)) {
        datosRecepciones = [];
      }
      
      const recepcionesProcessed = datosRecepciones.map(recepcion => {
        if (!recepcion) return null;
        
        // Crear copia segura
        const recepcionCopy = { ...recepcion };
        
        // Validar producto
        if (!recepcionCopy.producto || typeof recepcionCopy.producto !== 'object') {
          recepcionCopy.producto = { nombre: 'No disponible', variante: '' };
        }

        // Asegurar que la fechaVencimiento sea correcta
        if (recepcionCopy.fechaVencimiento) {
          console.log('Fecha vencimiento recibida:', recepcionCopy.fechaVencimiento);
          // No hacer más transformaciones, mantener el formato original
        }
        
        return recepcionCopy;
      }).filter(Boolean); // Eliminar valores null
      
      setRecepciones(recepcionesProcessed);
    } catch (error) {
      console.error("Error al obtener las recepciones de stock:", error);
      setRecepciones([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecepciones();
  }, []);

  return { recepciones, setRecepciones, loading, fetchRecepciones };
};

export default useGetRecepcionesStock;
