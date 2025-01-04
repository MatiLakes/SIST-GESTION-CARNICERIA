import { useState } from "react";
import { deletePedido } from "@services/pedido.service.js";

const useDeletePedido = (fetchPedidos) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const remove = async (id) => {
    setLoading(true);
    try {
      await deletePedido(id);
      console.log(`Pedido con ID ${id} eliminado con éxito`);
      // Llama a fetchPedidos para recargar los datos
      if (fetchPedidos) {
        await fetchPedidos();
      }
    } catch (err) {
      setError(err.message);
      console.error("Error al eliminar pedido:", err);
    } finally {
      setLoading(false);
    }
  };

  return { remove, loading, error };
};

export default useDeletePedido;
