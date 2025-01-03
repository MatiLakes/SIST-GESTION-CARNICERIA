import { useState } from "react";
import { getPedidosByFechaEntrega } from "@services/pedido.service.js";

const useFilterPedidosByFecha = () => {
  const [filteredPedidos, setFilteredPedidos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const filterPedidos = async (fecha) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getPedidosByFechaEntrega(fecha);
      setFilteredPedidos(response.data);
    } catch (err) {
      setError(err.message);
      console.error("Error al filtrar pedidos:", err);
    } finally {
      setLoading(false);
    }
  };

  return { filteredPedidos, filterPedidos, loading, error };
};

export default useFilterPedidosByFecha;
