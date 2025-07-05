import { useState, useEffect } from 'react';
import { getStockActual } from '@services/stockActual.service.js';

const useStockActual = () => {
  const [stock, setStock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStock = async () => {
    try {
      setLoading(true);
      setError(null);
      const [data, err] = await getStockActual();
      
      if (err) {
        setError(err);
        setStock([]);
      } else {
        // Agregar campo virtual para búsqueda de producto completo
        const stockConCampoVirtual = (data || []).map(item => ({
          ...item,
          productoCompleto: `${item.nombre || ''}${item.variante ? ` - ${item.variante}` : ''}`
        }));
        setStock(stockConCampoVirtual);
      }
    } catch (error) {
      setError("Error al cargar el stock actual");
      setStock([]);
      console.error("Error en useStockActual:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStock();
  }, []);

  return {
    stock,
    loading,
    error,
    refetch: fetchStock
  };
};

export default useStockActual;
