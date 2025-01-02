import { useState } from "react";
import { deletePedido } from "@services/pedido.service.js";

const useDeletePedido = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const remove = async (id) => {
    setLoading(true);
    try {
      await deletePedido(id);
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
